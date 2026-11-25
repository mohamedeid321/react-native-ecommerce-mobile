import React, { useRef } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import styles from "../../assets/styles/home.styles";
import CATEGORIES from "../../constants/categories";

// الأقسام نفسها اللي في شاشة الأقسام (نفس الصور من assets/categories)
// بتتسحب بالعرض، وفواكه بس اللي شغال (enabled) والباقي باهت
// بنعكس الترتيب ونبدأ من آخر السكرول عشان أول قسم (فواكه) يظهر على اليمين
const ITEMS = [...CATEGORIES].reverse();

export default function CategoryGrid() {
  const router = useRouter();
  const scrolled = useRef(false);
  const scrollRef = useRef(null);

  const open = (cat) => {
    if (!cat.enabled) return;
    router.push({ pathname: "/category/[id]", params: { id: cat.id } });
  };

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoriesScroll}
      contentContainerStyle={styles.categoriesContent}
      onContentSizeChange={() => {
        if (!scrolled.current) {
          scrolled.current = true;
          scrollRef.current?.scrollToEnd({ animated: false });
        }
      }}
    >
      {ITEMS.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={[styles.categoryItem, !cat.enabled && { opacity: 0.45 }]}
          activeOpacity={0.8}
          disabled={!cat.enabled}
          onPress={() => open(cat)}
        >
          <View style={styles.categoryTile}>
            <Image source={cat.image} style={styles.categoryImage} />
          </View>
          <Text style={styles.categoryLabel} numberOfLines={2}>
            {cat.ar}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
