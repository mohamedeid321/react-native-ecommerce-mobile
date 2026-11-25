import React from "react";
import { View, Text } from "react-native";
import styles from "../../assets/styles/adminProducts.styles";

// عناوين أعمدة الجدول (نفس عرض خلايا الصف)
export default function ProductsTableHeader() {
  return (
    <View style={styles.tableHeader}>
      <View style={styles.nameCell}>
        <Text style={styles.headText}>المنتج</Text>
      </View>
      <View style={styles.priceCell}>
        <Text style={styles.headText}>السعر</Text>
      </View>
      <View style={styles.categoryCell}>
        <Text style={styles.headText}>الفئة</Text>
      </View>
      <View style={styles.actionCell}>
        <Text style={styles.headText}>تعديل</Text>
      </View>
      <View style={styles.actionCell}>
        <Text style={styles.headText}>حذف</Text>
      </View>
    </View>
  );
}
