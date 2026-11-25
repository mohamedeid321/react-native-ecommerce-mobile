import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import COLORS from "../../constants/colors";
import { SCREEN_PADDING } from "../../constants/layout";

// عنوان + قايمة أفقية: أول عنصر على اليمين والسكرول بيكمل ناحية الشمال
export default function HorizontalSection({ title, data, renderItem, keyExtractor, emptyText }) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      {data.length === 0 ? (
        <Text style={styles.empty}>{emptyText}</Text>
      ) : (
        <FlatList
          data={data}
          horizontal
          inverted
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.content}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 22 },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textDark,
    textAlign: "right",
    marginBottom: 8,
  },
  empty: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "right",
    paddingVertical: 14,
  },
  content: { paddingHorizontal: 2, gap: 12 },
});
