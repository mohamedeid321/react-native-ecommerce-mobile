import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import COLORS from "../../constants/colors";
import styles from "../../assets/styles/categories.styles";
import CATEGORIES from "../../constants/categories";
import useProducts from "../../hooks/useProducts";
import useGoToProduct from "../../hooks/useGoToProduct";
import ScreenHeader from "../../components/common/ScreenHeader";
import ProductCard from "../../components/home/ProductCard";

// شاشة منتجات قسم واحد (6 منتجات في كل تحميل)
export default function CategoryProductsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const goToProduct = useGoToProduct();

  const category = CATEGORIES.find((c) => c.id === id);
  const { products, loading, refreshing, loadMore, refresh } = useProducts({
    category: category?.apiCategory ?? category?.id,
    skip: !category?.enabled,
  });

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={category?.ar ?? ""}
        onBackPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)"))}
      />

      <FlatList
        data={products}
        keyExtractor={(item, index) => item._id || String(index)}
        numColumns={2}
        columnWrapperStyle={styles.productsRow}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProductCard item={item} onPress={() => goToProduct(item)} />
        )}
        ListEmptyComponent={
          !loading && !refreshing ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>لا توجد منتجات</Text>
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
      />
    </View>
  );
}
