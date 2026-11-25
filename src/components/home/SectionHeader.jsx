import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../../assets/styles/home.styles";

// "عرض الكل" على اليمين (بيتداس) والعنوان على الشمال (كلام بس)
// لو عاوز تعكسهم: بدّل ترتيب العنصرين تحت
export default function SectionHeader({ title, actionText, onActionPress }) {
  return (
    <View style={styles.sectionHeader}>
      <TouchableOpacity onPress={onActionPress} activeOpacity={0.7}>
        <Text style={styles.sectionAction}>{actionText}</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}
