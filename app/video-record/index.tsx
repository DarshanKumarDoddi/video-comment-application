import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

const MAX_DURATION = 60;

export default function VideoRecordScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { videoId, parentId } = useLocalSearchParams<{
    videoId?: string;
    parentId?: string;
  }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const cameraRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTimer = () => {
    setDuration(0);
    timerRef.current = setInterval(() => {
      setDuration((prev) => {
        if (prev >= MAX_DURATION - 1) {
          stopRecording();
          return MAX_DURATION;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startRecording = async () => {
    if (!cameraRef.current) return;
    setRecording(true);
    startTimer();
    try {
      const video = await cameraRef.current.recordAsync({
        maxDuration: MAX_DURATION,
      });
      stopTimer();
      setRecording(false);
      if (video?.uri) {
        router.push({
          pathname: "/video-record/preview",
          params: {
            uri: video.uri,
            videoId: videoId ?? "",
            parentId: parentId ?? "",
          },
        });
      }
    } catch (err: any) {
      stopTimer();
      setRecording(false);
      Alert.alert("Error", err.message || "Failed to record");
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && recording) {
      cameraRef.current.stopRecording();
    }
    stopTimer();
    setRecording(false);
  };

  if (!permission) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Ionicons name="videocam-outline" size={64} color={colors.secondary} />
        <Text style={[styles.permTitle, { color: colors.textPrimary }]}>
          Camera access needed
        </Text>
        <Text style={[styles.permSub, { color: colors.textSecondary }]}>
          Allow camera access to record video comments
        </Text>
        <TouchableOpacity
          style={[styles.permBtn, { backgroundColor: colors.primary }]}
          onPress={requestPermission}
        >
          <Text style={styles.permBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        mode="video"
      />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        {recording && (
          <View style={styles.timerRow}>
            <View style={styles.recDot} />
            <Text style={styles.timerText}>{formatTime(duration)}</Text>
          </View>
        )}
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.flipBtn}
          onPress={() =>
            setFacing((f) => (f === "back" ? "front" : "back"))
          }
        >
          <Ionicons name="camera-reverse" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.recordBtn,
            recording && styles.recordBtnActive,
          ]}
          onPress={recording ? stopRecording : startRecording}
        >
          <View
            style={[
              styles.recordInner,
              recording && styles.recordInnerActive,
            ]}
          />
        </TouchableOpacity>

        <View style={{ width: 48 }} />
      </View>

      {!recording && (
        <Text style={[styles.hint, { color: colors.textSecondary }]}>
          Tap to record · {MAX_DURATION}s max
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  camera: { flex: 1 },
  topBar: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timerRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  recDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#EF4444" },
  timerText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  bottomBar: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
  },
  flipBtn: { width: 48, height: 48, justifyContent: "center", alignItems: "center" },
  recordBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  recordBtnActive: { borderColor: "#EF4444" },
  recordInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
  },
  recordInnerActive: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#EF4444",
  },
  hint: {
    position: "absolute",
    bottom: 130,
    alignSelf: "center",
    fontSize: 13,
  },
  permTitle: { fontSize: 20, fontWeight: "600" },
  permSub: { fontSize: 14, textAlign: "center", paddingHorizontal: 40 },
  permBtn: {
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
