import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

export default function VideoRecordScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Ionicons name="videocam-outline" size={64} color={colors.secondary} />
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Video Recording
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Coming in Phase 3
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  title: { fontSize: 22, fontWeight: "600" },
  subtitle: { fontSize: 14 },
});
