import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

/**
 * BharatWire Reader — mobile app (Android + iOS)
 *
 * IMPORTANT: set API_BASE to where your backend runs.
 *  - Android emulator:  http://10.0.2.2:3000
 *  - Phone on same WiFi: http://<your-laptop-IP>:3000  (e.g. http://192.168.1.5:3000)
 *  - After deploy:       https://your-site.vercel.app
 */
const API_BASE = "http://10.0.2.2:3000";

type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  coverImage: string | null;
  imageIsAi: boolean;
  category: string;
  categorySlug: string;
  language: string;
  verified: boolean;
  publishedAt: string | null;
};
type Meta = { name: string; slug?: string; code?: string };

export default function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Meta[]>([]);
  const [languages, setLanguages] = useState<Meta[]>([]);
  const [lang, setLang] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [selected, setSelected] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (lang) params.set("lang", lang);
      if (category) params.set("category", category);
      const res = await fetch(`${API_BASE}/api/public/feed?${params}`);
      const data = await res.json();
      setArticles(data.articles ?? []);
      setCategories(data.categories ?? []);
      setLanguages(data.languages ?? []);
    } catch {
      setError("Server se connect nahi ho paya. API_BASE check karein.");
    } finally {
      setLoading(false);
    }
  }, [lang, category]);

  useEffect(() => {
    load();
  }, [load]);

  // ---------- Article detail view ----------
  if (selected) {
    return (
      <View style={styles.safe}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <Pressable onPress={() => setSelected(null)}>
            <Text style={styles.back}>‹ Back</Text>
          </Pressable>
          <Logo />
          <View style={{ width: 50 }} />
        </View>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View style={styles.rowWrap}>
            <Text style={styles.chipStatic}>{selected.category}</Text>
            {selected.verified && <Text style={styles.verified}>✓ Verified</Text>}
          </View>
          <Text style={styles.h1}>{selected.title}</Text>
          {selected.coverImage && (
            <>
              <Image source={{ uri: selected.coverImage }} style={styles.cover} />
              {selected.imageIsAi && <Text style={styles.aiNote}>🖼 AI-generated image</Text>}
            </>
          )}
          {selected.body && <Text style={styles.body}>{selected.body}</Text>}
        </ScrollView>
      </View>
    );
  }

  // ---------- Feed ----------
  return (
    <View style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Logo />
      </View>

      {/* Language filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        <Chip label="All" active={!lang} onPress={() => setLang(null)} />
        {languages.map((l) => (
          <Chip
            key={l.code}
            label={l.name}
            active={lang === l.code}
            onPress={() => setLang(l.code!)}
          />
        ))}
      </ScrollView>

      {/* Category filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        <Chip label="Sab" active={!category} onPress={() => setCategory(null)} />
        {categories.map((c) => (
          <Chip
            key={c.slug}
            label={c.name}
            active={category === c.slug}
            onPress={() => setCategory(c.slug!)}
          />
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#ea580c" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(a) => a.id}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          ListEmptyComponent={<Text style={styles.error}>Koi khabar nahi mili.</Text>}
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => setSelected(item)}>
              {item.coverImage && (
                <Image source={{ uri: item.coverImage }} style={styles.cardImage} />
              )}
              <View style={{ padding: 12 }}>
                <View style={styles.rowWrap}>
                  <Text style={styles.chipStatic}>{item.category}</Text>
                  {item.verified && <Text style={styles.verified}>✓</Text>}
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                {item.excerpt && (
                  <Text style={styles.cardExcerpt} numberOfLines={2}>
                    {item.excerpt}
                  </Text>
                )}
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

function Logo() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View style={[styles.bar, { backgroundColor: "#f97316" }]} />
      <View style={[styles.bar, { backgroundColor: "#059669" }]} />
      <Text style={styles.logo}>
        Bharat<Text style={{ color: "#ea580c" }}>Wire</Text>
      </Text>
    </View>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff", paddingTop: 48 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
  },
  bar: { width: 5, height: 22, borderRadius: 3, marginRight: 3 },
  logo: { fontSize: 20, fontWeight: "800", marginLeft: 4, color: "#18181b" },
  back: { fontSize: 16, color: "#ea580c", fontWeight: "600", width: 50 },
  chipRow: { flexGrow: 0, paddingHorizontal: 12, paddingTop: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#f4f4f5",
    marginRight: 8,
  },
  chipActive: { backgroundColor: "#18181b" },
  chipText: { fontSize: 13, color: "#52525b", fontWeight: "600" },
  chipTextActive: { color: "#fff" },
  card: {
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  cardImage: { width: "100%", height: 160 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#18181b", marginTop: 6 },
  cardExcerpt: { fontSize: 13, color: "#52525b", marginTop: 4 },
  rowWrap: { flexDirection: "row", alignItems: "center", gap: 8 },
  chipStatic: {
    backgroundColor: "#fff7ed",
    color: "#c2410c",
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: "hidden",
  },
  verified: { color: "#059669", fontSize: 12, fontWeight: "700" },
  h1: { fontSize: 24, fontWeight: "800", color: "#18181b", marginTop: 8 },
  cover: { width: "100%", height: 200, borderRadius: 12, marginTop: 12 },
  aiNote: { fontSize: 11, color: "#a1a1aa", marginTop: 4 },
  body: { fontSize: 16, lineHeight: 26, color: "#27272a", marginTop: 12 },
  error: { textAlign: "center", marginTop: 40, color: "#71717a", paddingHorizontal: 24 },
});
