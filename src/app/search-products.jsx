import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import COLORS from "../constants/colors";
import { ROW, SCREEN_PADDING } from "../constants/layout";
import useSearch from "../hooks/useSearch";
import useRecentSearches from "../hooks/useRecentSearches";
import useGoToProduct from "../hooks/useGoToProduct";
import ProductCard from "../components/home/ProductCard";

// شاشة البحث: بحث بالاسم والوصف (بيتجاهل الفرق بين أ/ا وة/ه وى/ي) + آخر عمليات البحث
export default function SearchScreen() {
  const router = useRouter();
  const goToProduct = useGoToProduct();
  const [query, setQuery] = useState("");
  const { results, loading, error, loadMore, searched } = useSearch(query);
  const recent = useRecentSearches();

  const openProduct = (item) => {
    recent.add(query);
    goToProduct(item);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.inputWrap}>
          <Ionicons name="search-outline" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.input}
            placeholder="ابحث عن منتجك هنا"
            placeholderTextColor={COLORS.placeholderText}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => recent.add(query)}
            returnKeyType="search"
            autoFocus
            textAlign="right"
          />
          {!!query && (
            <TouchableOpacity onPress={() => setQuery("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
      </View>

      {!searched ? (
        <View style={styles.recentBox}>
          {recent.items.length > 0 && (
            <>
              <View style={styles.recentHead}>
                <Text style={styles.recentTitle}>آخر عمليات البحث</Text>
                <TouchableOpacity onPress={recent.clear}>
                  <Text style={styles.clear}>مسح الكل</Text>
                </TouchableOpacity>
              </View>
              {recent.items.map((term) => (
                <TouchableOpacity key={term} style={styles.recentRow} onPress={() => setQuery(term)}>
                  <Ionicons name="time-outline" size={18} color={COLORS.textSecondary} />
                  <Text style={styles.recentText}>{term}</Text>
                  <TouchableOpacity onPress={() => recent.remove(term)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="close" size={18} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </>
          )}
          {recent.items.length === 0 && (
            <View style={styles.center}>
              <Ionicons name="search" size={54} color={COLORS.border} />
              <Text style={styles.muted}>اكتب اسم المنتج اللي بتدور عليه</Text>
            </View>
          )}
        </View>
      ) : (
        <FlatList
          data={results}
          numColumns={2}
          keyExtractor={(p) => p._id}
          columnWrapperStyle={{ justifyContent: "space-between", flexDirection: "row-reverse" }}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          renderItem={({ item }) => <ProductCard item={item} onPress={() => openProduct(item)} />}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.center}>
                <Ionicons name="sad-outline" size={54} color={COLORS.border} />
                <Text style={styles.muted}>{error || `لا توجد نتائج لـ "${query.trim()}"`}</Text>
              </View>
            ) : null
          }
          ListFooterComponent={
            loading ? <ActivityIndicator style={{ paddingVertical: 20 }} color={COLORS.primary} /> : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  topRow: { flexDirection: ROW, alignItems: "center", gap: 10, paddingHorizontal: SCREEN_PADDING, paddingTop: 10, paddingBottom: 12 },
  backButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: COLORS.cardBackground, borderWidth: 1, borderColor: COLORS.border, justifyContent: "center", alignItems: "center" },
  inputWrap: { flex: 1, flexDirection: ROW, alignItems: "center", gap: 8, height: 48, backgroundColor: COLORS.inputBackground, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 14 },
  input: { flex: 1, height: "100%", fontSize: 15, color: COLORS.textDark, textAlign: "right" },
  list: { paddingHorizontal: SCREEN_PADDING, paddingBottom: 30, flexGrow: 1 },
  recentBox: { paddingHorizontal: SCREEN_PADDING, flex: 1 },
  recentHead: { flexDirection: ROW, justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  recentTitle: { fontSize: 16, fontWeight: "800", color: COLORS.textDark },
  clear: { fontSize: 13, color: COLORS.danger, fontWeight: "700" },
  recentRow: { flexDirection: ROW, alignItems: "center", gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  recentText: { flex: 1, fontSize: 15, color: COLORS.textDark, textAlign: "right" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 80, gap: 10 },
  muted: { fontSize: 15, color: COLORS.textSecondary, textAlign: "center" },
});
