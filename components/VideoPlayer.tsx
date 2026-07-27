import React from "react";
import { View, StyleSheet } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

interface VideoPlayerProps {
  youtubeVideoId: string;
  playerRef: React.RefObject<any>;
  onReady: () => void;
  onChangeState: (state: string) => void;
}

export default function VideoPlayer({
  youtubeVideoId,
  playerRef,
  onReady,
  onChangeState,
}: VideoPlayerProps) {
  if (!youtubeVideoId) return null;

  return (
    <View style={styles.container}>
      <YoutubePlayer
        ref={playerRef}
        height={220}
        videoId={youtubeVideoId}
        onReady={onReady}
        onChangeState={onChangeState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
  },
});
