import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { getYouTubeThumbnail } from "../lib/utils";
import { Video } from "../types";

interface VideoCardProps {
  video: Video;
  onPress: () => void;
}

export default function VideoCard({ video, onPress }: VideoCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: getYouTubeThumbnail(video.youtube_video_id) }}
        style={styles.thumbnail}
      />
      <View style={styles.info}>
        <Text
          style={[styles.title, { color: colors.textPrimary }]}
          numberOfLines={2}
        >
          {video.title}
        </Text>
        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          {video.created_at
            ? new Date(video.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : "Recently added"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  thumbnail: {
    width: "100%",
    aspectRatio: 16 / 9,
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  meta: {
    fontSize: 11,
  },
});
