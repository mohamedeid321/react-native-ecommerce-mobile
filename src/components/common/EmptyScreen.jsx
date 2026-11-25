import React from "react";
import { View, Text } from "react-native";
import COLORS from "../../constants/colors";

// شاشة مؤقتة: hello + اسم الشاشة (لحد ما نبنيها)
export default function EmptyScreen({ title }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.background,
      }}
    >
      <Text style={{ fontSize: 24, color: COLORS.textDark }}>hello</Text>
      <Text
        style={{
          fontSize: 20,
          marginTop: 8,
          fontWeight: "700",
          color: COLORS.primary,
        }}
      >
        {title}
      </Text>
    </View>
  );
}
