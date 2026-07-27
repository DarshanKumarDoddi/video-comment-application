import { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { fetchVideo, fetchComments, postComment, likeComment } from "../../lib/api";
import { Video, Comment, CommentWithReplies } from "../../types";
import { buildCommentTree } from "../../lib/utils";
import { useYouTubePlayer } from "../../hooks/useYouTubePlayer";
import VideoPlayer from "../../components/VideoPlayer";
import CommentThread from "../../components/CommentThread";
import CommentComposer from "../../components/CommentComposer";
import TimestampMarker from "../../components/TimestampMarker";

type SortMode = "latest" | "timestamp";

export default function WatchScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortMode, setSortMode] = useState<SortMode>("latest");
  const [playerReady, setPlayerReady] = useState(false);
  const { playerRef, seekTo, getCurrentTime } = useYouTubePlayer();
  const timeTrackerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [liveCurrentTime, setLiveCurrentTime] = useState<number | null>(null);

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

  useEffect(() => {
    if (playerReady) {
      timeTrackerRef.current = setInterval(async () => {
        const time = await getCurrentTime();
        if (time != null) setLiveCurrentTime(time);
      }, 1000);
    }
    return () => {
      if (timeTrackerRef.current) clearInterval(timeTrackerRef.current);
    };
  }, [playerReady, getCurrentTime]);

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

  const handleReply = async (parentId: string, text: string) => {
    if (!id) return;
    await postComment({
      video_id: id,
      text_content: text,
      parent_comment_id: parentId,
    });
    loadComments();
  };

  const handleLike = async (commentId: string) => {
    await likeComment(commentId);
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

  const getTimestampMarkers = (): Comment[] => {
    return comments.filter(
      (c) => c.timestamp_seconds != null && !c.parent_comment_id
    );
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
  const markers = getTimestampMarkers();

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
              onReady={() => setPlayerReady(true)}
              onChangeState={() => {}}
            />

            <View style={styles.videoInfo}>
              <Text style={[styles.videoTitle, { color: colors.textPrimary }]}>
                {video?.title ?? "Video"}
              </Text>
            </View>

            {markers.length > 0 && (
              <View style={[styles.markersRow, { borderTopColor: colors.border }]}>
                <Text style={[styles.markersLabel, { color: colors.textSecondary }]}>
                  Timestamps
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {markers.map((c) => (
                    <TimestampMarker
                      key={c.id}
                      seconds={c.timestamp_seconds!}
                      onPress={(sec) => seekTo(sec)}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={[styles.sortBar, { borderTopColor: colors.border }]}>
              <TouchableOpacity
                style={[
                  styles.sortBtn,
                  sortMode === "latest" && { backgroundColor: colors.primary },
                ]}
                onPress={() => setSortMode("latest")}
              >
                <Text
                  style={[
                    styles.sortBtnText,
                    { color: sortMode === "latest" ? "#fff" : colors.textSecondary },
                  ]}
                >
                  Latest
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sortBtn,
                  sortMode === "timestamp" && { backgroundColor: colors.primary },
                ]}
                onPress={() => setSortMode("timestamp")}
              >
                <Text
                  style={[
                    styles.sortBtnText,
                    {
                      color:
                        sortMode === "timestamp" ? "#fff" : colors.textSecondary,
                    },
                  ]}
                >
                  Timestamp
                </Text>
              </TouchableOpacity>
              <Text style={[styles.commentCount, { color: colors.textSecondary }]}>
                {comments.length} comments
              </Text>
            </View>

            <CommentComposer
              currentTime={liveCurrentTime}
              onSubmit={handlePostComment}
            />

            <CommentThread
              comments={tree}
              onLike={handleLike}
              onSeek={seekTo}
              onReply={handleReply}
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
  markersRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    borderTopWidth: 1,
  },
  markersLabel: { fontSize: 12, fontWeight: "500" },
  sortBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    borderTopWidth: 1,
    alignItems: "center",
  },
  sortBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  sortBtnText: { fontSize: 13, fontWeight: "500" },
  commentCount: { marginLeft: "auto", fontSize: 12 },
  empty: { padding: 40, alignItems: "center" },
  emptyText: { fontSize: 14 },
});
