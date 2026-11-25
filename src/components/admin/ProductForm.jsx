import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import styles from "../../assets/styles/create.styles";
import COLORS from "../../constants/colors";
import CATEGORIES from "../../constants/categories";
import UNITS from "../../constants/units";
import { toNumber } from "../../utils/productForm";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // نفس حد الباك (2MB لكل صورة)

const EMPTY = {
  name: "",
  description: "",
  price: "",
  discount: "",
  unit: UNITS[0],
  stock: "",
  category: "",
  imageUrl: null, // صورة الكارت الحالية (في التعديل)
  detailImageUrl: null, // صورة التفاصيل الحالية (في التعديل)
};

// فورم المنتج المشترك بين "إضافة منتج" و "تعديل منتج"
// initial: القيم الابتدائية (فاضية في الإضافة، وبيانات المنتج في التعديل)
// onSubmit(values): بيتنده بعد ما القيم تعدي التحقق، والصور null لو متغيرتش
export default function ProductForm({
  title,
  submitLabel,
  submitIcon = "cloud-upload-outline",
  initial,
  submitting,
  onSubmit,
}) {
  const start = { ...EMPTY, ...initial };
  const isEdit = !!(start.imageUrl || start.detailImageUrl);

  const [form, setForm] = useState({
    name: start.name,
    description: start.description,
    price: start.price,
    discount: start.discount,
    unit: start.unit,
    stock: start.stock,
    category: start.category,
  });
  const [image, setImage] = useState(null); // صورة كارت جديدة
  const [detailImage, setDetailImage] = useState(null); // صورة تفاصيل جديدة

  const units = UNITS.includes(form.unit) ? UNITS : [form.unit, ...UNITS];
  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  // السعر بعد الخصم (معاينة بس، الباك هو اللي بيحسبه فعلياً)
  const priceNum = toNumber(form.price);
  const discountNum = form.discount === "" ? 0 : toNumber(form.discount);
  const finalPreview =
    priceNum > 0 && discountNum >= 0 && discountNum <= 100
      ? Math.round(priceNum * (1 - discountNum / 100) * 100) / 100
      : null;

  // صورة الكارت: من غير قص ولا ضغط عشان الشفافية (PNG) متضيعش
  const pickCardImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: false,
        quality: 1,
      });
      if (result.canceled) return;

      const asset = result.assets[0];
      if (asset.fileSize && asset.fileSize > MAX_IMAGE_BYTES) {
        Alert.alert("تنبيه", "حجم الصورة كبير، الحد الأقصى 2MB");
        return;
      }
      if (asset.mimeType !== "image/png") {
        Alert.alert(
          "تنبيه",
          "الصورة مش PNG، فالخلفية مش هتبقى شفافة. الأفضل تختار صورة PNG من غير خلفية.",
        );
      }
      setImage(asset);
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("خطأ", "حصلت مشكلة في اختيار الصورة");
    }
  };

  // صورة التفاصيل: صورة عادية (مقصوصة بنسبة صفحة المنتج)
  const pickDetailImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [5, 4],
        quality: 0.7,
      });
      if (!result.canceled) setDetailImage(result.assets[0]);
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("خطأ", "حصلت مشكلة في اختيار الصورة");
    }
  };

  const handleSubmit = () => {
    const stockNum = form.stock === "" ? 0 : toNumber(form.stock);

    if (!form.name.trim() || !form.description.trim()) {
      Alert.alert("خطأ", "اكتب اسم المنتج ووصفه");
      return;
    }
    if (!(priceNum > 0)) {
      Alert.alert("خطأ", "اكتب سعر صحيح أكبر من صفر");
      return;
    }
    if (!(discountNum >= 0 && discountNum <= 100)) {
      Alert.alert("خطأ", "نسبة الخصم لازم تكون من 0 إلى 100");
      return;
    }
    if (!Number.isInteger(stockNum) || stockNum < 0) {
      Alert.alert("خطأ", "المخزون لازم يكون رقم صحيح");
      return;
    }
    if (!form.category) {
      Alert.alert("خطأ", "اختار القسم");
      return;
    }
    // في الإضافة الصورتين مطلوبتين، وفي التعديل الصور القديمة بتفضل لو متغيرتش
    if (!(image || start.imageUrl) || !(detailImage || start.detailImageUrl)) {
      Alert.alert("خطأ", "اختار صورة الكارت وصورة التفاصيل");
      return;
    }

    onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      price: priceNum,
      discount: discountNum,
      unit: form.unit,
      stock: stockNum,
      category: form.category,
      image,
      detailImage,
    });
  };

  const cardUri = image?.uri || start.imageUrl;
  const detailUri = detailImage?.uri || start.detailImageUrl;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={styles.scrollViewStyle}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
        </View>

        {/* اسم المنتج */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>اسم المنتج</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="cube-outline"
              size={20}
              color={COLORS.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="اكتب اسم المنتج"
              placeholderTextColor={COLORS.placeholderText}
              value={form.name}
              onChangeText={(v) => setField("name", v)}
            />
          </View>
        </View>

        {/* الوصف */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>الوصف</Text>
          <View style={[styles.inputContainer, { alignItems: "flex-start" }]}>
            <Ionicons
              name="document-text-outline"
              size={20}
              color={COLORS.textSecondary}
              style={[styles.inputIcon, { marginTop: 12 }]}
            />
            <TextInput
              style={styles.textArea}
              placeholder="اكتب وصف المنتج"
              placeholderTextColor={COLORS.placeholderText}
              value={form.description}
              onChangeText={(v) => setField("description", v)}
              multiline
            />
          </View>
        </View>

        {/* السعر والخصم */}
        <View style={[styles.formGroup, styles.rowGroup]}>
          <View style={styles.half}>
            <Text style={styles.label}>السعر (ج.م)</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="pricetag-outline"
                size={20}
                color={COLORS.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor={COLORS.placeholderText}
                value={form.price}
                onChangeText={(v) => setField("price", v)}
                keyboardType="decimal-pad"
              />
            </View>
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>الخصم (%)</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="trending-down-outline"
                size={20}
                color={COLORS.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor={COLORS.placeholderText}
                value={form.discount}
                onChangeText={(v) => setField("discount", v)}
                keyboardType="decimal-pad"
              />
            </View>
          </View>
        </View>

        {finalPreview !== null && (
          <View style={styles.previewBox}>
            <Text style={styles.previewLabel}>السعر بعد الخصم</Text>
            <Text style={styles.previewValue}>{finalPreview.toFixed(2)} ج.م</Text>
          </View>
        )}

        {/* الوحدة والمخزون */}
        <View style={[styles.formGroup, styles.rowGroup]}>
          <View style={styles.half}>
            <Text style={styles.label}>وحدة البيع</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={form.unit}
                onValueChange={(v) => setField("unit", v)}
                dropdownIconColor={COLORS.primary}
                style={styles.picker}
              >
                {units.map((u) => (
                  <Picker.Item key={u} label={u} value={u} />
                ))}
              </Picker>
            </View>
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>المخزون</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="layers-outline"
                size={20}
                color={COLORS.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor={COLORS.placeholderText}
                value={form.stock}
                onChangeText={(v) => setField("stock", v)}
                keyboardType="number-pad"
              />
            </View>
          </View>
        </View>

        {/* القسم */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>القسم</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={form.category}
              onValueChange={(v) => setField("category", v)}
              dropdownIconColor={COLORS.primary}
              style={styles.picker}
            >
              <Picker.Item label="اختار القسم" value="" enabled={false} />
              {CATEGORIES.map((cat) => (
                <Picker.Item key={cat.id} label={cat.ar} value={cat.id} />
              ))}
            </Picker>
          </View>
        </View>

        {/* صورة الكارت */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>صورة الكارت (PNG من غير خلفية)</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={pickCardImage}>
            {cardUri ? (
              <Image
                source={{ uri: cardUri }}
                style={[styles.previewImage, { resizeMode: "contain" }]}
              />
            ) : (
              <View style={styles.placeholderContainer}>
                <Ionicons name="image-outline" size={40} color={COLORS.textSecondary} />
                <Text style={styles.placeholderText}>اضغط لاختيار الصورة</Text>
              </View>
            )}
          </TouchableOpacity>
          {isEdit && (
            <Text style={styles.hint}>اضغط على الصورة لو عاوز تغيّرها</Text>
          )}
        </View>

        {/* صورة التفاصيل */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>صورة صفحة التفاصيل</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={pickDetailImage}>
            {detailUri ? (
              <Image
                source={{ uri: detailUri }}
                style={[styles.previewImage, { resizeMode: "cover" }]}
              />
            ) : (
              <View style={styles.placeholderContainer}>
                <Ionicons name="images-outline" size={40} color={COLORS.textSecondary} />
                <Text style={styles.placeholderText}>اضغط لاختيار الصورة</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* زرار الإرسال */}
        <TouchableOpacity
          style={[styles.button, submitting && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Text style={styles.buttonText}>{submitLabel}</Text>
              <Ionicons
                name={submitIcon}
                size={20}
                color={COLORS.white}
                style={styles.buttonIcon}
              />
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
