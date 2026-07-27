import { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { fetchVideos } from "../../lib/api";
import { Video } from "../../types";
import VideoCard from "../../components/VideoCard";

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadVideos = async () => {
    try {
      const data = await fetchVideos();
      setVideos(data);
    } catch {
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
    loadVideos();
  };

  if (loading) {
    return (
      <View
        style={[styles.center, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <VideoCard
            video={item}
            onPress={() => router.push(`/watch/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  row: { paddingHorizontal: 12, gap: 12 },
  list: { paddingVertical: 12, gap: 12 },
});
