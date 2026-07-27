import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { formatTimestamp } from "../lib/utils";

interface TimestampMarkerProps {
  seconds: number;
  onPress: (seconds: number) => void;
}

export default function TimestampMarker({ seconds, onPress }: TimestampMarkerProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.marker, { backgroundColor: colors.primary }]}
      onPress={() => onPress(seconds)}
    >
      <Text style={styles.text}>{formatTimestamp(seconds)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  marker: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  text: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
});
