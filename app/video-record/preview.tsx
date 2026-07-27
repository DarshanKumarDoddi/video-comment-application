import { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { uploadToCloudinary } from "../../lib/cloudinary";

export default function VideoPreviewScreen() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const { colors } = useTheme();
  const router = useRouter();
  const videoRef = useRef<Video>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");

  const handlePost = async () => {
    if (!uri) return;
    setUploading(true);
    setUploadProgress("Compressing...");
    try {
      setUploadProgress("Uploading...");
      const result = await uploadToCloudinary(uri, `comment-${Date.now()}.mp4`);
      setUploadProgress("Done!");
      router.dismiss();
      router.push({
        pathname: "/watch/[id]",
        params: {
          id: "mock-1",
          videoUrl: result.url,
        },
      });
    } catch (err: any) {
      Alert.alert("Upload failed", err.message || "Please try again", [
        { text: "Retry", onPress: handlePost },
        { text: "Cancel", style: "cancel" },
      ]);
    } finally {
      setUploading(false);
      setUploadProgress("");
    }
  };

  if (!uri) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textPrimary }}>No video recorded</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Video
        ref={videoRef}
        source={{ uri }}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        isLooping
        useNativeControls
      />

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.retakeBtn, { borderColor: colors.border }]}
          onPress={() => router.back()}
          disabled={uploading}
        >
          <Ionicons name="refresh" size={20} color={colors.textPrimary} />
          <Text style={[styles.retakeText, { color: colors.textPrimary }]}>
            Retake
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.postBtn, { backgroundColor: colors.primary }]}
          onPress={handlePost}
          disabled={uploading}
        >
          {uploading ? (
            <View style={styles.progressRow}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.postText}>{uploadProgress}</Text>
            </View>
          ) : (
            <Text style={styles.postText}>Post as Comment</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  video: { flex: 1, backgroundColor: "#000" },
  bottomBar: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  retakeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  retakeText: { fontSize: 16, fontWeight: "500" },
  postBtn: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
  },
  postText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  progressRow: { flexDirection: "row", alignItems: "center", gap: 8 },
});
