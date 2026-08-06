import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { signOut, setDisplayName } from "../../lib/auth";
import { useAuth } from "../../context/AuthContext";
import AppHeader from "../../components/AppHeader";
import ChannelAvatar from "../../components/ChannelAvatar";
import DisplayNamePrompt from "../../components/DisplayNamePrompt";

type IoniconName = keyof typeof Ionicons.glyphMap;

interface ProfileOption {
  icon: IoniconName;
  label: string;
  color: string;
  onPress: () => void;
}

export default function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [showNamePrompt, setShowNamePrompt] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      Alert.alert("Signed out", "You have been signed out.");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handleSetName = async (name: string) => {
    await setDisplayName(name);
    if (user) setUser({ ...user, username: name });
    setShowNamePrompt(false);
  };

  const options: ProfileOption[] = [
    user
      ? {
          icon: "create-outline",
          label: user.username ? "Change Display Name" : "Set Display Name",
          color: colors.primary,
          onPress: () => setShowNamePrompt(true),
        }
      : {
          icon: "log-in-outline",
          label: "Sign In",
          color: colors.primary,
          onPress: () => router.push("/auth/login"),
        },
    {
      icon: isDark ? "sunny-outline" : "moon-outline",
      label: isDark ? "Light Mode" : "Dark Mode",
      color: colors.primary,
      onPress: toggleTheme,
    },
    {
      icon: "help-circle-outline",
      label: "Help & Feedback",
      color: colors.secondary,
      onPress: () => {},
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="You" />

      <View style={[styles.headerCard, { borderBottomColor: colors.border }]}>
        <ChannelAvatar name={user?.username || user?.email || "U"} size={64} />
        <View style={styles.headerInfo}>
          <Text style={[styles.name, { color: colors.textPrimary }]}>
            {user?.username || user?.email || "Guest"}
          </Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>
            {user?.email ?? "Not signed in"}
          </Text>
        </View>
      </View>

      <View style={styles.options}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.option, { borderBottomColor: colors.border }]}
            onPress={option.onPress}
          >
            <View style={[styles.iconCircle, { backgroundColor: colors.surface }]}>
              <Ionicons name={option.icon} size={20} color={option.color} />
            </View>
            <Text style={[styles.optionText, { color: colors.textPrimary }]}>
              {option.label}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.secondary} />
          </TouchableOpacity>
        ))}

        {user && (
          <TouchableOpacity
            style={[styles.option, { borderBottomColor: colors.border }]}
            onPress={handleSignOut}
          >
            <View style={[styles.iconCircle, { backgroundColor: colors.surface }]}>
              <Ionicons name="log-out-outline" size={20} color={colors.accent} />
            </View>
            <Text style={[styles.optionText, { color: colors.accent }]}>
              Sign Out
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.secondary} />
          </TouchableOpacity>
        )}
      </View>

      <DisplayNamePrompt
        visible={showNamePrompt}
        onSubmit={handleSetName}
        onSkip={() => setShowNamePrompt(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerInfo: { flex: 1, gap: 2 },
  name: { fontSize: 18, fontWeight: "700" },
  email: { fontSize: 13 },
  options: { paddingHorizontal: 16 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: { flex: 1, fontSize: 15, fontWeight: "500" },
});
