import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { CommentWithReplies } from "../types";
import { getTimeAgo, formatTimestamp } from "../lib/utils";
import { hapticLight, hapticMedium } from "../lib/haptics";

interface CommentItemProps {
  comment: CommentWithReplies;
  depth?: number;
  videoId: string;
  onLike: (commentId: string) => void;
  onSeek?: (seconds: number) => void;
  onReply: (parentId: string, text: string) => Promise<void>;
}

export default function CommentItem({
  comment,
  depth = 0,
  videoId,
  onLike,
  onSeek,
  onReply,
}: CommentItemProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes_count || 0);
  const initial = (comment.author_name || "U")[0].toUpperCase();
  const indent = Math.min(depth * 24, 120);

  const handleLike = () => {
    if (liked) return;
    hapticLight();
    setLiked(true);
    setLikeCount((c) => c + 1);
    onLike(comment.id);
  };

  const handleReply = async () => {
    if (!replyText.trim()) {
      Alert.alert("Error", "Reply cannot be empty");
      return;
    }
    setReplying(true);
    try {
      await onReply(comment.id, replyText.trim());
      hapticMedium();
      setReplyText("");
      setShowReply(false);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to post reply");
    } finally {
      setReplying(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        depth > 0 && {
          marginLeft: indent,
          borderLeftWidth: 2,
          borderLeftColor: colors.border,
          paddingLeft: 12,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <Text style={[styles.author, { color: colors.textPrimary }]}>
          {comment.author_name || "User"}
        </Text>
        <Text style={[styles.time, { color: colors.textSecondary }]}>
          {getTimeAgo(comment.created_at)}
        </Text>
        {comment.timestamp_seconds != null && (
          <TouchableOpacity
            style={[styles.timestamp, { backgroundColor: colors.primary }]}
            onPress={() => onSeek?.(comment.timestamp_seconds!)}
          >
            <Text style={styles.timestampText}>
              {formatTimestamp(comment.timestamp_seconds)}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {comment.video_url && (
        <Video
          source={{ uri: comment.video_url }}
          style={styles.videoContainer}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay={false}
          isMuted
        />
      )}

      {comment.text_content && (
        <Text style={[styles.body, { color: colors.textPrimary }]}>
          {comment.text_content}
        </Text>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={handleLike}
          disabled={liked}
        >
          <Ionicons
            name={liked ? "thumbs-up" : "thumbs-up-outline"}
            size={14}
            color={liked ? colors.primary : colors.secondary}
          />
          <Text
            style={[
              styles.actionText,
              { color: liked ? colors.primary : colors.secondary },
            ]}
          >
            {likeCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => setShowReply(!showReply)}
        >
          <Ionicons name="chatbubble-outline" size={14} color={colors.secondary} />
          <Text style={[styles.actionText, { color: colors.secondary }]}>
            Reply
          </Text>
        </TouchableOpacity>
      </View>

      {showReply && (
        <View style={styles.replyComposer}>
          <TextInput
            style={[
              styles.replyInput,
              {
                color: colors.textPrimary,
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
            placeholder="Write a reply..."
            placeholderTextColor={colors.secondary}
            value={replyText}
            onChangeText={setReplyText}
            multiline
          />
          <View style={styles.replyActions}>
            <TouchableOpacity
              style={styles.replyRecord}
              onPress={() =>
                router.push({
                  pathname: "/video-record",
                  params: { videoId, parentId: comment.id },
                })
              }
            >
              <Ionicons name="videocam" size={14} color={colors.accent} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.replyBtn, { backgroundColor: colors.primary }]}
              onPress={handleReply}
              disabled={replying}
            >
              {replying ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.replyBtnText}>Reply</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.replyCancel, { borderColor: colors.border }]}
              onPress={() => {
                setShowReply(false);
                setReplyText("");
              }}
            >
              <Text style={[styles.replyCancelText, { color: colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {comment.replies.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          depth={depth + 1}
          videoId={videoId}
          onLike={onLike}
          onSeek={onSeek}
          onReply={onReply}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  author: { fontSize: 13, fontWeight: "600" },
  time: { fontSize: 11 },
  timestamp: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  timestampText: { color: "#fff", fontSize: 11, fontWeight: "600" },
  videoContainer: {
    marginVertical: 8,
    height: 120,
    borderRadius: 8,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  videoPlaceholder: { fontSize: 12 },
  body: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
  actions: { flexDirection: "row", gap: 16 },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  actionText: { fontSize: 12 },
  replyComposer: {
    marginTop: 8,
    padding: 8,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
  },
  replyInput: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    fontSize: 13,
    minHeight: 60,
    textAlignVertical: "top",
  },
  replyActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    alignItems: "center",
  },
  replyRecord: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  replyBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  replyBtnText: { color: "#fff", fontSize: 13, fontWeight: "500" },
  replyCancel: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  replyCancelText: { fontSize: 13 },
});
