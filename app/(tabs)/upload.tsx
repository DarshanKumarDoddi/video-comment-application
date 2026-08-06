import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { addVideo } from "../../lib/api";
import { extractVideoId } from "../../lib/youtube";
import { hapticSuccess, hapticError } from "../../lib/haptics";
import AppHeader from "../../components/AppHeader";

export default function UploadScreen() {
  const { colors } = useTheme();
  const router = useRouter();
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
      <AppHeader title="Upload" showBack onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.heading, { color: colors.textPrimary }]}>
          Add a video
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Paste a YouTube URL to share it on VidTalk
        </Text>

        <View style={[styles.form, { backgroundColor: colors.surface }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            YouTube URL
          </Text>
          <View
            style={[
              styles.inputWrap,
              { borderColor: colors.border, backgroundColor: colors.background },
            ]}
          >
            <Ionicons name="link-outline" size={18} color={colors.secondary} />
            <TextInput
              style={[styles.input, { color: colors.textPrimary }]}
              placeholder="https://www.youtube.com/watch?v=..."
              placeholderTextColor={colors.secondary}
              value={url}
              onChangeText={setUrl}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>

          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Title
          </Text>
          <View
            style={[
              styles.inputWrap,
              { borderColor: colors.border, backgroundColor: colors.background },
            ]}
          >
            <Ionicons name="text-outline" size={18} color={colors.secondary} />
            <TextInput
              style={[styles.input, { color: colors.textPrimary }]}
              placeholder="Video title"
              placeholderTextColor={colors.secondary}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleAddVideo}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Upload</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  heading: { fontSize: 22, fontWeight: "700", marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 20 },
  form: { borderRadius: 12, padding: 16, gap: 8 },
  label: { fontSize: 13, fontWeight: "500", marginTop: 4 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  input: { flex: 1, paddingVertical: 12, fontSize: 15 },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
