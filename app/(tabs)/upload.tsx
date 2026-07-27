import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { addVideo } from "../../lib/api";
import { extractVideoId } from "../../lib/youtube";
import { hapticSuccess, hapticError } from "../../lib/haptics";

export default function UploadScreen() {
  const { colors } = useTheme();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddVideo = async () => {
    if (!url.trim() || !title.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      Alert.alert("Error", "Invalid YouTube URL");
      return;
    }

    setLoading(true);
    try {
      await addVideo(url, title);
      hapticSuccess();
      Alert.alert("Success", "Video added!");
      setUrl("");
      setTitle("");
    } catch (err: any) {
      hapticError();
      Alert.alert("Error", err.message || "Failed to add video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.heading, { color: colors.textPrimary }]}>
          Add a Video
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Paste a YouTube URL to add it to the feed
        </Text>

        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            YouTube URL
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                color: colors.textPrimary,
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            placeholder="https://www.youtube.com/watch?v=..."
            placeholderTextColor={colors.secondary}
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            keyboardType="url"
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Title
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                color: colors.textPrimary,
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            placeholder="Video title"
            placeholderTextColor={colors.secondary}
            value={title}
            onChangeText={setTitle}
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleAddVideo}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Add Video</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  heading: { fontSize: 28, fontWeight: "700", marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 24 },
  form: { gap: 12 },
  label: { fontSize: 14, fontWeight: "500" },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
