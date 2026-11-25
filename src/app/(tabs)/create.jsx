import React, { useState } from "react";
import { Alert } from "react-native";
import axios from "axios";
import ProductForm from "../../components/admin/ProductForm";
import { buildProductFormData } from "../../utils/productForm";
import { useAuthStore } from "../../store/authStore";
import useAdminProducts from "../../store/adminProductsStore";
import { API_URL } from "../../constants/api";

// شاشة إضافة منتج (الفورم نفسه في components/admin/ProductForm)
export default function Create() {
  const [loading, setLoading] = useState(false);
  const [formKey, setFormKey] = useState(0); // بنغيّره عشان الفورم يفضى بعد النجاح
  const { token } = useAuthStore();
  const upsertProduct = useAdminProducts((s) => s.upsertProduct);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/products`,
        buildProductFormData(values),
        { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } },
      );
      if (!response?.data) throw new Error("حصلت مشكلة أثناء الإرسال");

      // يظهر في جدول المنتجات فوراً
      upsertProduct(response.data.product);

      Alert.alert("تم", "تم إضافة المنتج بنجاح");
      setFormKey((k) => k + 1);
    } catch (error) {
      console.error("Submit error:", error);
      Alert.alert(
        "خطأ",
        error.response?.data?.message || error.message || "خطأ في السيرفر",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductForm
      key={formKey}
      title="إضافة منتج جديد"
      submitLabel="إضافة المنتج"
      submitting={loading}
      onSubmit={handleSubmit}
    />
  );
}
