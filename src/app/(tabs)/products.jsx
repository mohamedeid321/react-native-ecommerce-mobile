import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import COLORS from "../../constants/colors";
import styles from "../../assets/styles/adminProducts.styles";
import useAdminProducts from "../../store/adminProductsStore";
import CategoryFilter from "../../components/admin/CategoryFilter";
import ProductsTableHeader from "../../components/admin/ProductsTableHeader";
import ProductRow from "../../components/admin/ProductRow";

// شاشة المنتجات للـ admin: جدول بكل المنتجات (تعديل / حذف / تمييز) وفلتر بالأقسام
export default function ProductsScreen() {
  const router = useRouter();
  const products = useAdminProducts((s) => s.products);
  const category = useAdminProducts((s) => s.category);
  const loading = useAdminProducts((s) => s.loading);
  const refreshing = useAdminProducts((s) => s.refreshing);
  const error = useAdminProducts((s) => s.error);
  const { load, refresh, loadMore, setCategory, removeProduct, toggleFeatured } =
    useAdminProducts.getState();

  useEffect(() => {
    load();
  }, []);

  const handleEdit = useCallback(
    (item) => router.push({ pathname: "/edit-product/[id]", params: { id: item._id } }),
    [router],
  );

  // تأكيد → الصف يختفي فوراً → طلب الحذف → رسالة نجاح (أو خطأ ويرجع الصف)
  const handleDelete = useCallback((item) => {
    Alert.alert("حذف المنتج", "هل أنت متأكد من حذف المنتج نهائياً؟", [
      { text: "إلغاء", style: "cancel" },
      {
        text: "حذف",
        style: "destructive",
        onPress: async () => {
          const result = await removeProduct(item._id);
          if (result.ok) Alert.alert("تم", "تم حذف المنتج بنجاح");
          else Alert.alert("خطأ", result.message);
        },
      },
    ]);
  }, []);

  const handleToggleFeatured = useCallback(async (item) => {
    const result = await toggleFeatured(item._id);
    if (!result.ok && result.message) Alert.alert("خطأ", result.message);
  }, []);

  const renderItem = useCallback(
    ({ item, index }) => (
      <ProductRow
        item={item}
        index={index}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleFeatured={handleToggleFeatured}
      />
    ),
    [handleEdit, handleDelete, handleToggleFeatured],
  );

  const showEmpty = !loading && !refreshing;

  return (
    <View style={styles.container}>
      {/* العنوان */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>المنتجات</Text>
      </View>

      <CategoryFilter selected={category} onSelect={setCategory} />

      <View style={styles.table}>
        <ProductsTableHeader />
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
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
          ListEmptyComponent={
            showEmpty ? (
              <View style={styles.centerBox}>
                <Text style={styles.emptyText}>
                  {error || "لا توجد منتجات في هذا القسم"}
                </Text>
                {!!error && (
                  <TouchableOpacity style={styles.retryButton} onPress={load}>
                    <Text style={styles.retryText}>إعادة المحاولة</Text>
                  </TouchableOpacity>
                )}
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
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </View>
  );
}
