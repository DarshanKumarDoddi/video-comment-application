import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { fetchVideos } from "../../lib/api";
import { Video } from "../../types";
import VideoCard from "../../components/VideoCard";
import AppHeader from "../../components/AppHeader";
import CategoryChips, { DEFAULT_CATEGORIES } from "../../components/CategoryChips";

const PAGE_SIZE = 10;

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0]);

  const loadVideos = async () => {
    try {
      const data = await fetchVideos();
      setVideos(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Could not load videos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setVisibleCount(PAGE_SIZE);
    loadVideos();
  };

  const filteredVideos =
    category === "All"
      ? videos
      : videos.filter((v) =>
          v.title.toLowerCase().includes(category.toLowerCase())
        );

  const visibleVideos = filteredVideos.slice(0, visibleCount);
  const hasMoreVideos = visibleCount < filteredVideos.length;

  const handleEndReached = () => {
    if (loadingMore || visibleCount >= filteredVideos.length) return;
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((c) => Math.min(c + PAGE_SIZE, filteredVideos.length));
      setLoadingMore(false);
    }, 400);
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error && videos.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Ionicons name="cloud-offline-outline" size={64} color={colors.secondary} />
        <Text style={[styles.errorTitle, { color: colors.textPrimary }]}>
          Could not load videos
        </Text>
        <Text style={[styles.errorText, { color: colors.textSecondary }]}>
          {error}
        </Text>
        <TouchableOpacity
          style={[styles.retryBtn, { backgroundColor: colors.primary }]}
          onPress={() => {
            setLoading(true);
            setError(null);
            loadVideos();
          }}
        >
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        showLogo
        title="VidTalk"
        showSearch
        onSearch={() => router.push("/search")}
        showCreate
        onCreate={() => router.push("/upload")}
        showNotifications
        onNotifications={() => router.push("/notifications")}
        showAvatar
        onAvatar={() => router.push("/profile")}
      />

      <CategoryChips active={category} onSelect={setCategory} />

      <FlatList
        data={visibleVideos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <VideoCard
            video={item}
            onPress={() => router.push(`/watch/${item.id}`)}
          />
        )}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : hasMoreVideos ? (
            <TouchableOpacity style={styles.footer} onPress={handleEndReached}>
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                Load more videos
              </Text>
            </TouchableOpacity>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No videos in this category yet.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { paddingBottom: 16 },
  footer: { padding: 16, alignItems: "center" },
  footerText: { fontSize: 13, fontWeight: "500" },
  emptyText: { fontSize: 15, padding: 40, textAlign: "center" },
  errorTitle: { fontSize: 18, fontWeight: "600" },
  errorText: { fontSize: 14, textAlign: "center", paddingHorizontal: 40 },
  retryBtn: {
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryBtnText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});
