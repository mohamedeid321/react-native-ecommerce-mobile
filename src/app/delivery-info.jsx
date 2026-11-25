import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import COLORS from "../constants/colors";
import styles from "../assets/styles/create.styles";
import ScreenHeader from "../components/common/ScreenHeader";
import useDeliveryStore from "../store/deliveryStore";

const CITIES = ["15 مايو", "حلوان"];
const GOVERNORATE = "القاهرة";
// مجاورة من 36 لحد 1
const NEIGHBORHOODS = Array.from({ length: 36 }, (_, i) => String(36 - i));

// حقل نصي بأيقونة (نفس شكل فورم المنتج)
function Field({ label, required, icon, value, onChangeText, placeholder, keyboardType, style }) {
  return (
    <View style={style}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={{ color: COLORS.danger }}> *</Text> : null}
      </Text>
      <View style={styles.inputContainer}>
        <Ionicons name={icon} size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholderText}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );
}

// شاشة معلومات التوصيل: بتتحفظ في حساب العميل وبتتبعت مع كل طلب
export default function DeliveryInfoScreen() {
  const router = useRouter();
  const { info, save } = useDeliveryStore();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    city: info?.city || "",
    neighborhood: info?.neighborhood ? String(info.neighborhood) : "",
    building: info?.building || "",
    apartment: info?.apartment || "",
    floor: info?.floor || "",
    street: info?.street || "",
    landmark: info?.landmark || "",
    phone1: info?.phone1 || "",
    phone2: info?.phone2 || "",
  });
  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!form.city) return Alert.alert("خطأ", "اختار المدينة");
    if (!form.neighborhood) return Alert.alert("خطأ", "اختار المجاورة");
    if (!form.building.trim() || !form.apartment.trim() || !form.floor.trim()) {
      return Alert.alert("خطأ", "اكتب رقم العمارة والشقة والدور");
    }
    if (!form.phone1.trim()) return Alert.alert("خطأ", "اكتب رقم الهاتف 1");

    setSaving(true);
    const result = await save({ ...form, governorate: GOVERNORATE });
    setSaving(false);

    if (result.ok) {
      Alert.alert("تم", "تم تحديث معلومات التوصيل بنجاح", [
        { text: "حسناً", onPress: () => router.back() },
      ]);
    } else {
      Alert.alert("خطأ", result.message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScreenHeader title="معلومات التوصيل" onBackPress={() => router.back()} />

      <ScrollView
        contentContainerStyle={styles.container}
        style={styles.scrollViewStyle}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          {/* المدينة: اختيار من اتنين */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              المدينة <Text style={{ color: COLORS.danger }}>*</Text>
            </Text>
            <View style={styles.rowGroup}>
              {CITIES.map((c) => {
                const active = form.city === c;
                return (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.half,
                      {
                        height: 48,
                        borderRadius: 12,
                        borderWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        borderColor: active ? COLORS.primary : COLORS.border,
                        backgroundColor: active ? COLORS.primary : COLORS.inputBackground,
                      },
                    ]}
                    onPress={() => set("city")(c)}
                    activeOpacity={0.85}
                  >
                    <Text
                      style={{
                        fontWeight: "800",
                        color: active ? COLORS.white : COLORS.textDark,
                      }}
                    >
                      {c}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* المحافظة: ثابتة */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>المحافظة</Text>
            <View style={[styles.inputContainer, { backgroundColor: COLORS.primaryLight }]}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput style={styles.input} value={GOVERNORATE} editable={false} />
            </View>
          </View>

          {/* المجاورة: 36 → 1 */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              مجاورة <Text style={{ color: COLORS.danger }}>*</Text>
            </Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={form.neighborhood}
                onValueChange={set("neighborhood")}
                dropdownIconColor={COLORS.primary}
                style={styles.picker}
              >
                <Picker.Item label="اختار المجاورة" value="" enabled={false} />
                {NEIGHBORHOODS.map((n) => (
                  <Picker.Item key={n} label={n} value={n} />
                ))}
              </Picker>
            </View>
          </View>

          {/* عمارة / شقة / الدور */}
          <View style={[styles.formGroup, styles.rowGroup]}>
            <Field style={styles.half} label="عمارة" required icon="business-outline"
              value={form.building} onChangeText={set("building")} placeholder="رقم" />
            <Field style={styles.half} label="شقة" required icon="home-outline"
              value={form.apartment} onChangeText={set("apartment")} placeholder="رقم" />
            <Field style={styles.half} label="الدور" required icon="layers-outline"
              value={form.floor} onChangeText={set("floor")} placeholder="رقم" />
          </View>

          <Field style={styles.formGroup} label="اسم الشارع (اختياري)" icon="trail-sign-outline"
            value={form.street} onChangeText={set("street")} placeholder="اسم الشارع" />
          <Field style={styles.formGroup} label="أقرب علامة مميزة (اختياري)" icon="flag-outline"
            value={form.landmark} onChangeText={set("landmark")} placeholder="مثال: بجوار المسجد" />
          <Field style={styles.formGroup} label="رقم هاتف 1" required icon="call-outline"
            value={form.phone1} onChangeText={set("phone1")} placeholder="01XXXXXXXXX" keyboardType="phone-pad" />
          <Field style={styles.formGroup} label="رقم هاتف 2 (اختياري)" icon="call-outline"
            value={form.phone2} onChangeText={set("phone2")} placeholder="01XXXXXXXXX" keyboardType="phone-pad" />

          <TouchableOpacity
            style={[styles.button, saving && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>تحديث معلوماتك</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
