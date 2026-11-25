import React from "react";
import { Text, Image, TouchableOpacity } from "react-native";
import styles from "../../assets/styles/categories.styles";

// كارت قسم واحد: الصورة + الاسم بالعربي + بالإنجليزي
// لو القسم مش مفعّل (enabled = false) بيبان باهت ومبيتداسش
export default function CategoryCard({ category, onPress }) {
  const { ar, en, image, enabled } = category;

  return (
    <TouchableOpacity
      style={[styles.card, !enabled && styles.cardDisabled]}
      activeOpacity={0.85}
      disabled={!enabled}
      onPress={onPress}
    >
      <Image source={image} style={styles.cardImage} />
      <Text style={styles.cardTitle} numberOfLines={1}>
        {ar}
      </Text>
      <Text style={styles.cardSubtitle} numberOfLines={1}>
        {en}
      </Text>
    </TouchableOpacity>
  );
}
