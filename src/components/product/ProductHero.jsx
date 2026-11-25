import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import COLORS from "../../constants/colors";
import styles from "../../assets/styles/product.styles";

// صورة المنتج من فوق + زرار الرجوع (شمال) وزرار القلب (يمين)
export default function ProductHero({ image, liked, onToggleLike }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const top = insets.top + 8;

  return (
    <View style={styles.hero}>
      {image ? (
        <Image source={{ uri: image }} style={styles.heroImage} />
      ) : (
        <View style={[styles.heroImage, styles.heroImagePlaceholder]} />
      )}

      <TouchableOpacity
        style={[styles.heroButton, { top, left: 16 }]}
        onPress={() => router.back()}
        activeOpacity={0.8}
      >
        <Ionicons name="chevron-back" size={22} color={COLORS.textDark} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.heroButton, { top, right: 16 }]}
        activeOpacity={0.8}
        onPress={onToggleLike}
      >
        <Ionicons
          name={liked ? "heart" : "heart-outline"}
          size={21}
          color={liked ? COLORS.danger : COLORS.textDark}
        />
      </TouchableOpacity>
    </View>
  );
}
