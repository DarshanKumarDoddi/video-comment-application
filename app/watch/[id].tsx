import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import YoutubePlayer from "react-native-youtube-iframe";
import { useTheme } from "../../context/ThemeContext";
import { fetchVideo, fetchComments, postComment, likeComment } from "../../lib/api";
import { Video, Comment, CommentWithReplies } from "../../types";
import { buildCommentTree, formatTimestamp } from "../../lib/utils";
import { useYouTubePlayer } from "../../hooks/useYouTubePlayer";
import VideoPlayer from "../../components/VideoPlayer";
import CommentThread from "../../components/CommentThread";
import CommentComposer from "../../components/CommentComposer";

type SortMode = "latest" | "timestamp";

export default function WatchScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortMode, setSortMode] = useState<SortMode>("latest");
  const { playerRef, currentTime, seekTo, getCurrentTime } =
    useYouTubePlayer();

  const loadVideo = useCallback(async () => {
    if (!id) return;
    try {
      const data = await fetchVideo(id);
      setVideo(data);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadComments = useCallback(async () => {
    if (!id) return;
    try {
      const data = await fetchComments(id);
      setComments(data);
    } catch {
    }
  }, [id]);

  useEffect(() => {
    loadVideo();
    loadComments();
  }, [loadVideo, loadComments]);

  const handlePostComment = async (
    text: string,
    videoUrl: string | null,
    timestampSeconds: number | null
  ) => {
    if (!id) return;
    await postComment({
      video_id: id,
      text_content: text || null,
      video_url: videoUrl,
      timestamp_seconds: timestampSeconds,
    });
    loadComments();
  };

  const handleLike = async (commentId: string) => {
    await likeComment(commentId);
    loadComments();
  };

  const getSortedComments = (): Comment[] => {
    const sorted = [...comments];
    if (sortMode === "timestamp") {
      sorted.sort((a, b) => {
        const aTime = a.timestamp_seconds ?? Infinity;
        const bTime = b.timestamp_seconds ?? Infinity;
        return aTime - bTime;
      });
    }
    return sorted;
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const sorted = getSortedComments();
  const tree = buildCommentTree(sorted);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={
          <>
            <VideoPlayer
              youtubeVideoId={video?.youtube_video_id ?? ""}
              playerRef={playerRef}
              onReady={() => {}}
              onChangeState={() => {}}
            />

            <View style={styles.videoInfo}>
              <Text style={[styles.videoTitle, { color: colors.textPrimary }]}>
                {video?.title ?? "Video"}
              </Text>
            </View>

            <View
              style={[styles.sortBar, { borderTopColor: colors.border }]}
            >
              <TouchableOpacity
                style={[
                  styles.sortBtn,
                  sortMode === "latest" && {
                    backgroundColor: colors.primary,
                  },
                ]}
                onPress={() => setSortMode("latest")}
              >
                <Text
                  style={[
                    styles.sortBtnText,
                    {
                      color:
                        sortMode === "latest" ? "#fff" : colors.textSecondary,
                    },
                  ]}
                >
                  Latest
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sortBtn,
                  sortMode === "timestamp" && {
                    backgroundColor: colors.primary,
                  },
                ]}
                onPress={() => setSortMode("timestamp")}
              >
                <Text
                  style={[
                    styles.sortBtnText,
                    {
                      color:
                        sortMode === "timestamp"
                          ? "#fff"
                          : colors.textSecondary,
                    },
                  ]}
                >
                  Timestamp
                </Text>
              </TouchableOpacity>
            </View>

            <CommentComposer onSubmit={handlePostComment} />

            <CommentThread
              comments={tree}
              onLike={handleLike}
              onSeek={seekTo}
            />

            {tree.length === 0 && (
              <View style={styles.empty}>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No comments yet. Be the first!
                </Text>
              </View>
            )}
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  videoInfo: { padding: 16 },
  videoTitle: { fontSize: 22, fontWeight: "600" },
  sortBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    borderTopWidth: 1,
  },
  sortBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  sortBtnText: { fontSize: 13, fontWeight: "500" },
  empty: { padding: 40, alignItems: "center" },
  emptyText: { fontSize: 14 },
});
