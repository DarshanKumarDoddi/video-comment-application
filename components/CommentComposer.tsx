import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { hapticMedium } from "../lib/haptics";

interface CommentComposerProps {
  currentTime?: number | null;
  videoId: string;
  placeholder?: string;
  compact?: boolean;
  onSubmit: (
    text: string,
    videoUrl: string | null,
    timestampSeconds: number | null
  ) => void;
}

export default function CommentComposer({
  currentTime,
  videoId,
  placeholder = "Add a comment...",
  compact = false,
  onSubmit,
}: CommentComposerProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const [text, setText] = useState("");
  const [pinTimestamp, setPinTimestamp] = useState(false);

  const getTimestamp = (): number | null => {
    if (!pinTimestamp || currentTime == null) return null;
    return Math.floor(currentTime);
  };

  const handleSubmit = () => {
    if (!text.trim()) {
      Alert.alert("Error", "Comment cannot be empty");
      return;
    }
    onSubmit(text.trim(), null, getTimestamp());
    hapticMedium();
    setText("");
    setPinTimestamp(false);
  };

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (compact) {
    return (
      <View style={[styles.compactContainer, { borderColor: colors.border }]}>
        <TextInput
          style={[
            styles.compactInput,
            { color: colors.textPrimary, backgroundColor: colors.background },
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.secondary}
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity
          style={[styles.compactSubmit, { backgroundColor: colors.primary }]}
          onPress={handleSubmit}
        >
          <Ionicons name="send" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <TextInput
        style={[
          styles.input,
          {
            color: colors.textPrimary,
            backgroundColor: colors.background,
            borderColor: colors.border,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.secondary}
        value={text}
        onChangeText={setText}
        multiline
        numberOfLines={3}
      />

      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <TouchableOpacity
            style={[
              styles.timestampBtn,
              pinTimestamp && { backgroundColor: colors.primary + "20" },
            ]}
            onPress={() => setPinTimestamp(!pinTimestamp)}
            disabled={currentTime == null}
          >
            <Ionicons
              name="time-outline"
              size={14}
              color={pinTimestamp ? colors.primary : colors.secondary}
            />
            <Text
              style={{
                color:
                  currentTime == null
                    ? colors.border
                    : pinTimestamp
                    ? colors.primary
                    : colors.secondary,
                fontSize: 12,
              }}
            >
              {pinTimestamp && currentTime != null
                ? `Pinned: ${formatTime(currentTime)}`
                : currentTime != null
                ? `Pin: ${formatTime(currentTime)}`
                : "No player time"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.recordBtn}
            onPress={() =>
              router.push({ pathname: "/video-record", params: { videoId } })
            }
          >
            <Ionicons name="videocam" size={14} color={colors.accent} />
            <Text style={{ color: colors.accent, fontSize: 12 }}>Record</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: colors.primary }]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>Comment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 12,
    borderRadius: 8,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: "top",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  leftActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timestampBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  recordBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  submitBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  submitText: { color: "#fff", fontSize: 14, fontWeight: "500" },
  compactContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  compactInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 13,
  },
  compactSubmit: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
