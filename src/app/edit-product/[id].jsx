import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import COLORS from "../../constants/colors";
import styles from "../../assets/styles/adminProducts.styles";
import ScreenHeader from "../../components/common/ScreenHeader";
import ProductForm from "../../components/admin/ProductForm";
import { buildProductFormData } from "../../utils/productForm";
import { useAuthStore } from "../../store/authStore";
import useAdminProducts from "../../store/adminProductsStore";
import { API_URL } from "../../constants/api";

const str = (v) => (Array.isArray(v) ? v[0] : v) ?? "";

// شاشة تعديل منتج: نفس فورم الإضافة بس مليان ببيانات المنتج وزرار "تحديث"
export default function EditProductScreen() {
  const id = str(useLocalSearchParams().id);
  const router = useRouter();
  const { token } = useAuthStore();
  const upsertProduct = useAdminProducts((s) => s.upsertProduct);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadProduct = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      setProduct(response.data.product);
    } catch (error) {
      setLoadError(
        error.response?.data?.message || error.message || "تعذر تحميل المنتج",
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleSubmit = async (values) => {
    try {
      setSaving(true);

      const response = await axios.put(
        `${API_URL}/products/${id}`,
        buildProductFormData(values),
        { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } },
      );

      // الجدول يتحدث فوراً
      upsertProduct(response.data.product);

      Alert.alert("تم", "تم تحديث المنتج بنجاح", [
        { text: "حسناً", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert(
        "خطأ",
        error.response?.data?.message || error.message || "تعذر تحديث المنتج",
      );
    } finally {
      setSaving(false);
    }
  };

  const initial = product && {
    name: product.name || "",
    description: product.description || "",
    price: String(product.price ?? ""),
    discount: product.discount ? String(product.discount) : "",
    unit: product.unit || undefined,
    stock: String(product.stock ?? 0),
    category: product.category || "",
    imageUrl: product.image || null,
    detailImageUrl: product.detailImage || null,
  };

  return (
    <View style={styles.editContainer}>
      <ScreenHeader title="تعديل منتج" onBackPress={() => router.back()} />

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : loadError ? (
        <View style={styles.centerBox}>
          <Text style={styles.emptyText}>{loadError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadProduct}>
            <Text style={styles.retryText}>إعادة المحاولة</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ProductForm
          title="تعديل بيانات المنتج"
          submitLabel="تحديث"
          submitIcon="checkmark-circle-outline"
          initial={initial}
          submitting={saving}
          onSubmit={handleSubmit}
        />
      )}
    </View>
  );
}
