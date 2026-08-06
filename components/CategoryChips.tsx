import React from "react";
import { ScrollView, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export const DEFAULT_CATEGORIES = [
  "All",
  "Music",
  "Gaming",
  "News",
  "Sports",
  "Learning",
  "Entertainment",
  "Live",
  "Technology",
  "Cooking",
];

interface CategoryChipsProps {
  categories?: string[];
  active: string;
  onSelect: (category: string) => void;
}

export default function CategoryChips({
  categories = DEFAULT_CATEGORIES,
  active,
  onSelect,
}: CategoryChipsProps) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => {
        const isActive = category === active;
        return (
          <TouchableOpacity
            key={category}
            style={[
              styles.chip,
              {
                backgroundColor: isActive
                  ? colors.chipActiveBg
                  : colors.chipBg,
              },
            ]}
            onPress={() => onSelect(category)}
          >
            <Text
              style={[
                styles.chipText,
                {
                  color: isActive ? colors.chipActiveText : colors.chipText,
                },
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
