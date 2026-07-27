import { useState, useEffect } from "react";
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
import { getCurrentUser, signOut, setDisplayName } from "../../lib/auth";
import { User } from "../../types";
import DisplayNamePrompt from "../../components/DisplayNamePrompt";

export default function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showNamePrompt, setShowNamePrompt] = useState(false);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      Alert.alert("Signed out", "You have been signed out.");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handleSetName = async (name: string) => {
    await setDisplayName(name);
    setUser((prev) => (prev ? { ...prev, username: name } : prev));
    setShowNamePrompt(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.avatarContainer}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>
            {user?.email?.[0]?.toUpperCase() ?? "U"}
          </Text>
        </View>
        <Text style={[styles.email, { color: colors.textPrimary }]}>
          {user?.email ?? "Not signed in"}
        </Text>
        {user?.username && (
          <Text style={[styles.username, { color: colors.textSecondary }]}>
            @{user.username}
          </Text>
        )}
      </View>

      <View style={styles.options}>
        <TouchableOpacity
          style={[styles.option, { borderBottomColor: colors.border }]}
          onPress={() => setShowNamePrompt(true)}
        >
          <Ionicons name="pencil" size={20} color={colors.primary} />
          <Text style={[styles.optionText, { color: colors.textPrimary }]}>
            {user?.username ? "Change Display Name" : "Set Display Name"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, { borderBottomColor: colors.border }]}
          onPress={toggleTheme}
        >
          <Ionicons
            name={isDark ? "sunny" : "moon"}
            size={20}
            color={colors.primary}
          />
          <Text style={[styles.optionText, { color: colors.textPrimary }]}>
            {isDark ? "Light Mode" : "Dark Mode"}
          </Text>
        </TouchableOpacity>

        {user ? (
          <TouchableOpacity
            style={[styles.option, { borderBottomColor: colors.border }]}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out" size={20} color={colors.accent} />
            <Text style={[styles.optionText, { color: colors.accent }]}>
              Sign Out
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.option, { borderBottomColor: colors.border }]}
            onPress={() => router.push("/auth/login")}
          >
            <Ionicons name="log-in" size={20} color={colors.primary} />
            <Text style={[styles.optionText, { color: colors.primary }]}>
              Sign In
            </Text>
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
  avatarContainer: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#fff", fontSize: 32, fontWeight: "700" },
  email: { fontSize: 16, fontWeight: "500" },
  username: { fontSize: 14 },
  options: { paddingHorizontal: 16 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  optionText: { fontSize: 16, fontWeight: "500" },
});
