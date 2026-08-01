import React from "react";
import { View } from "react-native";
import { CommentWithReplies } from "../types";
import CommentItem from "./CommentItem";

interface CommentThreadProps {
  comments: CommentWithReplies[];
  videoId: string;
  onLike: (commentId: string) => void;
  onSeek?: (seconds: number) => void;
  onReply: (parentId: string, text: string) => Promise<void>;
}

export default function CommentThread({
  comments,
  videoId,
  onLike,
  onSeek,
  onReply,
}: CommentThreadProps) {
  return (
    <View style={{ paddingHorizontal: 16 }}>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          videoId={videoId}
          onLike={onLike}
          onSeek={onSeek}
          onReply={onReply}
        />
      ))}
    </View>
  );
}
