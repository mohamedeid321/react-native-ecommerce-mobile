import React from "react";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "../../assets/styles/home.styles";
import HomeHeader from "./HomeHeader";
import SearchBar from "./SearchBar";

// ====== نص الخصم (غيّره من هنا) ======
const DISCOUNT_TEXT = "خصم لحد";
const DISCOUNT_VALUE = "70%";

// الجزء الأخضر فوق: القايمة + الاسم + الإشعارات، البحث، نص الخصم
export default function HomeHero() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.hero, { paddingTop: insets.top + 8 }]}>
      <View style={[styles.heroCircle, { width: 170, height: 170, top: -60, left: -50 }]} />
      <View style={[styles.heroCircle, { width: 120, height: 120, bottom: -40, right: -30 }]} />

      <HomeHeader light />
      <SearchBar />
      <Text style={styles.heroTitle}>
        {DISCOUNT_TEXT} <Text style={styles.heroTitleHighlight}>{DISCOUNT_VALUE}</Text>
      </Text>
    </View>
  );
}
