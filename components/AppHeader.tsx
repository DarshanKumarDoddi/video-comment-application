import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

interface AppHeaderProps {
  title?: string;
  showLogo?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  showSearch?: boolean;
  onSearch?: () => void;
  showCreate?: boolean;
  onCreate?: () => void;
  showNotifications?: boolean;
  onNotifications?: () => void;
  showAvatar?: boolean;
  onAvatar?: () => void;
  searchMode?: boolean;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  onSubmitSearch?: () => void;
  searchPlaceholder?: string;
}

function IconButton({
  name,
  onPress,
  color,
}: {
  name: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  color: string;
}) {
  return (
    <TouchableOpacity
      style={styles.iconBtn}
      onPress={onPress}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Ionicons name={name} size={24} color={color} />
    </TouchableOpacity>
  );
}

export default function AppHeader({
  title,
  showLogo = false,
  showBack = false,
  onBack,
  showSearch = false,
  onSearch,
  showCreate = false,
  onCreate,
  showNotifications = false,
  onNotifications,
  showAvatar = false,
  onAvatar,
  searchMode = false,
  searchValue = "",
  onSearchChange,
  onSubmitSearch,
  searchPlaceholder = "Search",
}: AppHeaderProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: colors.background,
          borderBottomColor: colors.headerShadow,
        },
      ]}
    >
      <View style={styles.row}>
        {showBack ? (
          <IconButton
            name="arrow-back"
            onPress={onBack}
            color={colors.iconBtn}
          />
        ) : showLogo ? (
          <View style={styles.brand}>
            <View style={[styles.logoBox, { backgroundColor: colors.accent }]}>
              <Ionicons name="play" size={18} color="#fff" />
            </View>
            <Text style={[styles.brandText, { color: colors.textPrimary }]}>
              {title ?? "VidTalk"}
            </Text>
          </View>
        ) : (
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {title}
          </Text>
        )}

        {searchMode ? (
          <View
            style={[
              styles.searchBox,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name="search" size={18} color={colors.secondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.textPrimary }]}
              placeholder={searchPlaceholder}
              placeholderTextColor={colors.secondary}
              value={searchValue}
              onChangeText={onSearchChange}
              onSubmitEditing={onSubmitSearch}
              returnKeyType="search"
              autoFocus
            />
            {searchValue.length > 0 && (
              <TouchableOpacity
                onPress={() => onSearchChange?.("")}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close-circle" size={18} color={colors.secondary} />
              </TouchableOpacity>
            )}
          </View>
        ) : null}

        <View style={styles.actions}>
          {showSearch && (
            <IconButton name="search" onPress={onSearch} color={colors.iconBtn} />
          )}
          {showCreate && (
            <IconButton
              name="videocam-outline"
              onPress={onCreate}
              color={colors.iconBtn}
            />
          )}
          {showNotifications && (
            <IconButton
              name="notifications-outline"
              onPress={onNotifications}
              color={colors.iconBtn}
            />
          )}
          {showAvatar && (
            <TouchableOpacity
              style={[styles.avatarBtn, { backgroundColor: colors.avatarBg }]}
              onPress={onAvatar}
            >
              <Ionicons
                name="person"
                size={16}
                color={colors.avatarText}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    paddingHorizontal: 8,
    gap: 4,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  logoBox: {
    width: 32,
    height: 24,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  brandText: {
    fontSize: 19,
    fontWeight: "700",
  },
  title: {
    fontSize: 19,
    fontWeight: "600",
    flex: 1,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
});
