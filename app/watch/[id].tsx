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
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { fetchVideo, fetchComments, postComment, likeComment } from "../../lib/api";
import { Video, Comment, CommentWithReplies } from "../../types";
import { buildCommentTree } from "../../lib/utils";
import { useYouTubePlayer } from "../../hooks/useYouTubePlayer";
import VideoPlayer from "../../components/VideoPlayer";
import CommentThread from "../../components/CommentThread";
import CommentComposer from "../../components/CommentComposer";
import TimestampMarker from "../../components/TimestampMarker";
import AppHeader from "../../components/AppHeader";
import ChannelAvatar from "../../components/ChannelAvatar";

type SortMode = "latest" | "timestamp";

const PAGE_SIZE = 5;

export default function WatchScreen() {
  const { id, videoUrl, parentId } = useLocalSearchParams<{ id: string; videoUrl?: string; parentId?: string }>();
  const { colors } = useTheme();
  const router = useRouter();
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortMode, setSortMode] = useState<SortMode>("latest");
  const [playerReady, setPlayerReady] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [saved, setSaved] = useState(false);
  const { playerRef, seekTo, getCurrentTime } = useYouTubePlayer();
  const timeTrackerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [liveCurrentTime, setLiveCurrentTime] = useState<number | null>(null);

  const loadVideo = useCallback(async () => {
    if (!id) return;
    try {
      const data = await fetchVideo(id);
      setVideo(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Could not load video");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadComments = useCallback(async () => {
    if (!id) return;
    try {
      const data = await fetchComments(id);
      setComments(data);
      setCommentsError(null);
    } catch (err: any) {
      setCommentsError(err.message || "Could not load comments");
    }
  }, [id]);

  useEffect(() => {
    loadVideo();
    loadComments();
  }, [loadVideo, loadComments]);

  useEffect(() => {
    if (videoUrl && id) {
      postComment({
        video_id: id,
        video_url: videoUrl,
        parent_comment_id: parentId || null,
      }).then(() => {
        setVisibleCount(PAGE_SIZE);
        loadComments();
      });
    }
  }, [videoUrl, id, parentId]);

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
    setVisibleCount(PAGE_SIZE);
    loadComments();
  };

  const handleReply = async (parentId: string, text: string) => {
    if (!id) return;
    await postComment({
      video_id: id,
      text_content: text,
      parent_comment_id: parentId,
    });
    setVisibleCount(PAGE_SIZE);
    loadComments();
  };

  const handleLike = async (commentId: string) => {
    await likeComment(commentId);
  };

  const handleEndReached = () => {
    if (loadingMore || visibleCount >= tree.length) return;
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((c) => Math.min(c + PAGE_SIZE, tree.length));
      setLoadingMore(false);
    }, 400);
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
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <Ionicons name="cloud-offline-outline" size={64} color={colors.secondary} />
        <Text style={[styles.errorTitle, { color: colors.textPrimary }]}>
          Could not load video
        </Text>
        <Text style={[styles.errorText, { color: colors.textSecondary }]}>
          {error}
        </Text>
        <TouchableOpacity
          style={[styles.retryBtn, { backgroundColor: colors.primary }]}
          onPress={() => {
            setLoading(true);
            setError(null);
            loadVideo();
          }}
        >
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const sorted = getSortedComments();
  const tree = buildCommentTree(sorted);
  const visibleTree = tree.slice(0, visibleCount);
  const hasMoreComments = visibleCount < tree.length;
  const markers = getTimestampMarkers();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppHeader showBack onBack={() => router.back()} />

      <FlatList
        data={[]}
        renderItem={null}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : hasMoreComments ? (
            <TouchableOpacity style={styles.footer} onPress={handleEndReached}>
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                Load more comments
              </Text>
            </TouchableOpacity>
          ) : null
        }
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

              <View style={styles.channelRow}>
                <ChannelAvatar name="VidTalk" size={40} />
                <View style={styles.channelText}>
                  <Text style={[styles.channelName, { color: colors.textPrimary }]}>
                    VidTalk
                  </Text>
                  <Text style={[styles.channelSub, { color: colors.textSecondary }]}>
                    Community channel
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.subscribeBtn,
                    subscribed
                      ? {
                          backgroundColor: colors.surface,
                          borderWidth: 1,
                          borderColor: colors.border,
                        }
                      : { backgroundColor: colors.subscribeBg },
                  ]}
                  onPress={() => setSubscribed(!subscribed)}
                >
                  <Text
                    style={[
                      styles.subscribeText,
                      {
                        color: subscribed
                          ? colors.textSecondary
                          : colors.subscribeText,
                      },
                    ]}
                  >
                    {subscribed ? "Subscribed" : "Subscribe"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.actionBar}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => setLiked(!liked)}
                >
                  <Ionicons
                    name={liked ? "thumbs-up" : "thumbs-up-outline"}
                    size={22}
                    color={liked ? colors.primary : colors.iconBtn}
                  />
                  <Text
                    style={[
                      styles.actionText,
                      { color: liked ? colors.primary : colors.iconBtn },
                    ]}
                  >
                    {liked ? "Like" : "Liked"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => setDisliked(!disliked)}
                >
                  <Ionicons
                    name={disliked ? "thumbs-down" : "thumbs-down-outline"}
                    size={22}
                    color={disliked ? colors.primary : colors.iconBtn}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons name="share-outline" size={22} color={colors.iconBtn} />
                  <Text style={[styles.actionText, { color: colors.iconBtn }]}>
                    Share
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => setSaved(!saved)}
                >
                  <Ionicons
                    name={saved ? "bookmark" : "bookmark-outline"}
                    size={22}
                    color={saved ? colors.primary : colors.iconBtn}
                  />
                  <Text
                    style={[
                      styles.actionText,
                      { color: saved ? colors.primary : colors.iconBtn },
                    ]}
                  >
                    {saved ? "Saved" : "Save"}
                  </Text>
                </TouchableOpacity>
              </View>
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

            <View style={[styles.commentsHeader, { borderTopColor: colors.border }]}>
              <Text style={[styles.commentCount, { color: colors.textPrimary }]}>
                {comments.length} Comments
              </Text>
              <View style={styles.sortGroup}>
                <TouchableOpacity
                  style={[
                    styles.sortBtn,
                    sortMode === "latest" && { backgroundColor: colors.chipActiveBg },
                  ]}
                  onPress={() => setSortMode("latest")}
                >
                  <Text
                    style={[
                      styles.sortBtnText,
                      {
                        color:
                          sortMode === "latest"
                            ? colors.chipActiveText
                            : colors.chipText,
                      },
                    ]}
                  >
                    Latest
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.sortBtn,
                    sortMode === "timestamp" && { backgroundColor: colors.chipActiveBg },
                  ]}
                  onPress={() => setSortMode("timestamp")}
                >
                  <Text
                    style={[
                      styles.sortBtnText,
                      {
                        color:
                          sortMode === "timestamp"
                            ? colors.chipActiveText
                            : colors.chipText,
                      },
                    ]}
                  >
                    Timestamp
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <CommentComposer
              currentTime={liveCurrentTime}
              videoId={id}
              onSubmit={handlePostComment}
            />

            <CommentThread
              comments={visibleTree}
              videoId={id}
              onLike={handleLike}
              onSeek={seekTo}
              onReply={handleReply}
            />

            {commentsError ? (
              <View style={styles.empty}>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  Could not load comments
                </Text>
                <TouchableOpacity
                  style={[styles.retryBtn, { backgroundColor: colors.primary }]}
                  onPress={() => {
                    setCommentsError(null);
                    loadComments();
                  }}
                >
                  <Text style={styles.retryBtnText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              tree.length === 0 && (
                <View style={styles.empty}>
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    No comments yet. Be the first!
                  </Text>
                </View>
              )
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
  videoInfo: { paddingHorizontal: 12, paddingVertical: 12 },
  videoTitle: { fontSize: 17, fontWeight: "500", lineHeight: 22 },
  channelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 12,
  },
  channelText: { flex: 1 },
  channelName: { fontSize: 14, fontWeight: "600" },
  channelSub: { fontSize: 12 },
  subscribeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 18,
  },
  subscribeText: { fontSize: 14, fontWeight: "600" },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  actionText: { fontSize: 13, fontWeight: "500" },
  markersRow: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  markersLabel: { fontSize: 12, fontWeight: "500" },
  commentsHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  commentCount: { fontSize: 15, fontWeight: "600", flex: 1 },
  sortGroup: { flexDirection: "row", gap: 6 },
  sortBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  sortBtnText: { fontSize: 13, fontWeight: "500" },
  empty: { padding: 40, alignItems: "center" },
  emptyText: { fontSize: 14 },
  errorTitle: { fontSize: 18, fontWeight: "600" },
  errorText: { fontSize: 14, textAlign: "center", paddingHorizontal: 40 },
  retryBtn: {
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryBtnText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  footer: { padding: 16, alignItems: "center" },
  footerText: { fontSize: 13, fontWeight: "500" },
});
