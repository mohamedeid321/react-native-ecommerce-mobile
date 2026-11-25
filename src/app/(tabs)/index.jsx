import React, { useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "expo-router";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import COLORS from "../../constants/colors";
import styles from "../../assets/styles/home.styles";
import useProducts from "../../store/useProducts";
import useGoToProduct from "../../hooks/useGoToProduct";
import HomeHero from "../../components/home/HomeHero";
import BannerSlider from "../../components/home/BannerSlider";
import CategoryGrid from "../../components/home/CategoryGrid";
import SectionHeader from "../../components/home/SectionHeader";
import ProductCard from "../../components/home/ProductCard";
// ====== إعدادات تتحكم فيها ======
const BANNER_INTERVAL_MS = 3000; // الوقت بين كل بانر والتاني (بالملي ثانية)

export default function HomeScreen() {
  const { products, loading, refreshing, loadMore, refresh } = useProducts();

  // بيفتح صفحة تفاصيل المنتج وبيبعتلها بياناته
  const goToProduct = useGoToProduct();
  // الشاشة مفتوحة قدام المستخدم دلوقتي؟ (عشان لون أيقونات النوتش)
  const [isFocused, setIsFocused] = useState(true);
  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, []),
  );

  // كل اللي فوق المنتجات (بيتحرك مع السكرول)
  const listHeader = (
    <View>
      <HomeHero />
      <CategoryGrid />
      <BannerSlider interval={BANNER_INTERVAL_MS} />
      <SectionHeader
        title="عروض اليوم"
        actionText="عرض الكل"
        onActionPress={() => {
          // TODO: الانتقال لشاشة كل المنتجات (هنعملها بعدين)
        }}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* أيقونات النوتش بيضا فوق الأخضر (في الرئيسية بس) */}
      {isFocused && <StatusBar style="light" />}
      <FlatList
        data={products}
        keyExtractor={(item, index) => item._id || String(index)}
        numColumns={2}
        columnWrapperStyle={styles.productsRow}
        renderItem={({ item }) => (
          <ProductCard item={item} onPress={() => goToProduct(item)} />
        )}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          !loading && !refreshing ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>لا توجد منتجات حالياً</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          loading && !refreshing ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
          ) : null
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}
