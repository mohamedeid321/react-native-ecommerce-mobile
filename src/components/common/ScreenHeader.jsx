import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import styles from "../../assets/styles/categories.styles";

// هيدر الشاشات الفرعية: رجوع (شمال) + العنوان في النص + أيقونة اختيارية (يمين)
export default function ScreenHeader({ title, onBackPress, actionIcon, onActionPress }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={onBackPress}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={26} color={COLORS.textDark} />
      </TouchableOpacity>

      <Text style={styles.headerTitle} numberOfLines={1}>
        {title}
      </Text>

      {actionIcon ? (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={onActionPress}
          activeOpacity={0.7}
        >
          <Ionicons name={actionIcon} size={23} color={COLORS.textDark} />
        </TouchableOpacity>
      ) : (
        <View style={styles.headerButton} />
      )}
    </View>
  );
}
