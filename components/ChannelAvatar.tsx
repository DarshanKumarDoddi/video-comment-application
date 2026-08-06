import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface ChannelAvatarProps {
  name?: string;
  size?: number;
}

export default function ChannelAvatar({ name, size = 40 }: ChannelAvatarProps) {
  const { colors } = useTheme();
  const initial = (name || "V")[0].toUpperCase();
  const radius = size / 2;

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: colors.avatarBg,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: colors.avatarText, fontSize: size * 0.42 },
        ]}
      >
        {initial}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "700",
  },
});
