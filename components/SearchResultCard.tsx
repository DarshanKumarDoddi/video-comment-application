import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { getYouTubeThumbnail, getTimeAgo } from "../lib/utils";
import { Video } from "../types";

interface SearchResultCardProps {
  video: Video;
  onPress: () => void;
}

export default function SearchResultCard({
  video,
  onPress,
}: SearchResultCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
      <Image
        source={{ uri: getYouTubeThumbnail(video.youtube_video_id) }}
        style={[styles.thumbnail, { backgroundColor: colors.surface }]}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text
          style={[styles.title, { color: colors.textPrimary }]}
          numberOfLines={2}
        >
          {video.title}
        </Text>
        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          VidTalk
        </Text>
        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          {getTimeAgo(video.created_at)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 12,
  },
  thumbnail: {
    width: 160,
    aspectRatio: 16 / 9,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    justifyContent: "flex-start",
    gap: 4,
    paddingTop: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 19,
  },
  meta: {
    fontSize: 12,
  },
});
