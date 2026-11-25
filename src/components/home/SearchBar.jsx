import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import COLORS from "../../constants/colors";
import styles from "../../assets/styles/home.styles";

// شريط البحث في الرئيسية: بيفتح شاشة البحث
export default function SearchBar() {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.searchContainer}
      activeOpacity={0.8}
      onPress={() => router.push("/search-products")}
    >
      <Text style={[styles.searchInput, { color: COLORS.placeholderText, textAlignVertical: "center", lineHeight: 50 }]}>
        ابحث عن منتجك هنا
      </Text>
      <Ionicons name="search-outline" size={22} color={COLORS.primary} />
    </TouchableOpacity>
  );
}
