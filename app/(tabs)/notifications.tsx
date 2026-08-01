import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import {
  getNotificationPermissionStatus,
  requestNotificationPermission,
  openNotificationSettings,
} from "../../lib/notifications";

interface Notification {
  id: string;
  title: string;
  body: string;
  videoId?: string;
  createdAt: string;
  read: boolean;
}

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [permStatus, setPermStatus] = useState<string | null>(null);

  const checkPermission = useCallback(async () => {
    const status = await getNotificationPermissionStatus();
    setPermStatus(status);
  }, []);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      // In a real app, fetch from Supabase device_tokens / notifications table
      // For now, show empty state
      setNotifications([]);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    if (user) checkPermission();
  }, [loadNotifications, checkPermission, user]);

  const handleEnableNotifications = async () => {
    if (permStatus === "undetermined") {
      const status = await requestNotificationPermission();
      setPermStatus(status);
    } else {
      await openNotificationSettings();
    }
  };

  if (!user) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Ionicons name="notifications-outline" size={64} color={colors.secondary} />
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Notifications
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Sign in to see your notifications
        </Text>
        <TouchableOpacity
          style={[styles.loginBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/auth/login")}
        >
          <Text style={styles.loginBtnText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const showPermBanner =
    permStatus === "denied" || permStatus === "undetermined";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {showPermBanner && (
        <View style={[styles.permBanner, { borderBottomColor: colors.border }]}>
          <Ionicons
            name="notifications-off-outline"
            size={18}
            color={colors.textSecondary}
          />
          <Text style={[styles.permText, { color: colors.textSecondary }]}>
            Notifications are off. Enable them to get notified about replies and
            likes.
          </Text>
          <TouchableOpacity
            style={[styles.permBtn, { backgroundColor: colors.primary }]}
            onPress={handleEnableNotifications}
          >
            <Text style={styles.permBtnText}>
              {permStatus === "undetermined" ? "Enable" : "Settings"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <View style={[styles.center, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : notifications.length === 0 ? (
        <View style={[styles.center, { backgroundColor: colors.background }]}>
          <Ionicons
            name="notifications-off-outline"
            size={64}
            color={colors.secondary}
          />
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            No notifications
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            You'll see replies and likes here
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.item,
                { borderBottomColor: colors.border },
                !item.read && { backgroundColor: colors.primary + "10" },
              ]}
              onPress={() => {
                if (item.videoId) router.push(`/watch/${item.videoId}`);
              }}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="chatbubble" size={20} color={colors.primary} />
              </View>
              <View style={styles.itemContent}>
                <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>
                  {item.title}
                </Text>
                <Text style={[styles.itemBody, { color: colors.textSecondary }]}>
                  {item.body}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12, padding: 24 },
  title: { fontSize: 22, fontWeight: "600" },
  subtitle: { fontSize: 14, textAlign: "center" },
  loginBtn: {
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  permBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  permText: { flex: 1, fontSize: 12 },
  permBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  permBtnText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  item: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(59,130,246,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  itemContent: { flex: 1, gap: 4 },
  itemTitle: { fontSize: 14, fontWeight: "600" },
  itemBody: { fontSize: 13 },
});
