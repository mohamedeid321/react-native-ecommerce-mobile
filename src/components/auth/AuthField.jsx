import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import styles from "../../assets/styles/auth.styles";

// حقل إدخال (أيقونة على اليمين) + رسالة خطأ تحت الحقل
// secure: بيضيف زرار إظهار/إخفاء كلمة المرور على الشمال
export default function AuthField({
  label,
  icon,
  value,
  onChangeText,
  onBlur,
  error,
  placeholder,
  secure,
  keyboardType,
  autoCapitalize = "none",
  autoComplete,
  onSubmitEditing,
  returnKeyType,
}) {
  const [show, setShow] = useState(false);

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, !!error && styles.inputError]}>
        <Ionicons name={icon} size={20} color={COLORS.primary} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholderText}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          secureTextEntry={secure && !show}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          autoCorrect={false}
          textAlign="right"
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
        />
        {secure && (
          <TouchableOpacity onPress={() => setShow((s) => !s)} style={styles.eyeIcon}>
            <Ionicons name={show ? "eye-outline" : "eye-off-outline"} size={20} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}
