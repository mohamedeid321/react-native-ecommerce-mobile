import React, { useRef } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import CATEGORIES from "../../constants/categories";
import styles from "../../assets/styles/adminProducts.styles";

// شرائح الأقسام: "الكل" على اليمين وبعدها الأقسام
// الترتيب بيتعكس والسكرول بيبدأ من آخر الشمال عشان يبان "الكل" على اليمين
const ITEMS = [{ id: null, ar: "الكل" }, ...CATEGORIES].reverse();

export default function CategoryFilter({ selected, onSelect }) {
  const ref = useRef(null);

  return (
    <ScrollView
      ref={ref}
      horizontal
      showsHorizontalScrollIndicator={false}
      onContentSizeChange={() => ref.current?.scrollToEnd({ animated: false })}
      style={styles.filterScroll}
      contentContainerStyle={styles.filterContent}
    >
      {ITEMS.map((c) => {
        const active = selected === c.id;
        return (
          <TouchableOpacity
            key={c.id ?? "all"}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onSelect(c.id)}
            activeOpacity={0.8}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {c.ar}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
