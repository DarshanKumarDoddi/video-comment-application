import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { fetchVideos } from "../../lib/api";
import { Video } from "../../types";
import AppHeader from "../../components/AppHeader";
import SearchResultCard from "../../components/SearchResultCard";

export default function SearchScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchVideos = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    setError(null);
    try {
      const all = await fetchVideos();
      const filtered = all.filter((v) =>
        v.title.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } catch (err: any) {
      setError(err.message || "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        searchMode
        showBack
        onBack={() => router.back()}
        searchValue={query}
        onSearchChange={setQuery}
        onSubmitSearch={searchVideos}
        searchPlaceholder="Search VidTalk"
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <SearchResultCard
              video={item}
              onPress={() => router.push(`/watch/${item.id}`)}
            />
          )}
          ListEmptyComponent={
            error ? (
              <View style={styles.empty}>
                <Ionicons name="cloud-offline-outline" size={48} color={colors.secondary} />
                <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                  Search failed
                </Text>
                <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
                  {error}
                </Text>
                <TouchableOpacity
                  style={[styles.retryBtn, { backgroundColor: colors.primary }]}
                  onPress={searchVideos}
                >
                  <Text style={styles.retryBtnText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : searched ? (
              <View style={styles.empty}>
                <Ionicons name="search-outline" size={48} color={colors.secondary} />
                <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                  No results found
                </Text>
                <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
                  Try a different search term
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { alignItems: "center", gap: 8, paddingTop: 60 },
  emptyTitle: { fontSize: 16, fontWeight: "600" },
  emptySub: { fontSize: 13 },
  list: { paddingVertical: 4 },
  retryBtn: {
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryBtnText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});
