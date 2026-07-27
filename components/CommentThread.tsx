import React from "react";
import { View } from "react-native";
import { CommentWithReplies } from "../types";
import CommentItem from "./CommentItem";

interface CommentThreadProps {
  comments: CommentWithReplies[];
  onLike: (commentId: string) => void;
  onSeek?: (seconds: number) => void;
}

export default function CommentThread({
  comments,
  onLike,
  onSeek,
}: CommentThreadProps) {
  return (
    <View style={{ paddingHorizontal: 16 }}>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onLike={onLike}
          onSeek={onSeek}
        />
      ))}
    </View>
  );
}
