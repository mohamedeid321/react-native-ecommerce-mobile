import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "../../assets/styles/home.styles";

// مكان الكلام (align) في كل بانر:
//  right  = الكلام يمين والصورة شمال
//  left   = الكلام شمال والصورة يمين
//  center = الكلام في النص والصورة الكبيرة وراه
const ALIGN = {
  right: {
    box: { right: 20, width: "54%", alignItems: "flex-end" },
    textAlign: "right",
    image: { left: 6, width: "46%" },
  },
  left: {
    box: { left: 20, width: "54%", alignItems: "flex-start" },
    textAlign: "left",
    image: { right: 6, width: "46%" },
  },
  center: {
    box: { left: 0, right: 0, paddingHorizontal: 24, alignItems: "center" },
    textAlign: "center",
    image: { left: 0, right: 0, width: "100%" },
  },
};

// شكل مرسوم بالكود: دايرة أو ورقة
function Shape({ type, size, color, rotate, ...position }) {
  const base = {
    position: "absolute",
    width: size,
    height: size,
    backgroundColor: color,
    ...position,
  };

  if (type === "leaf") {
    return (
      <View
        style={[
          base,
          {
            borderTopLeftRadius: size,
            borderBottomRightRadius: size,
            borderTopRightRadius: size * 0.12,
            borderBottomLeftRadius: size * 0.12,
            transform: [{ rotate: rotate || "0deg" }],
          },
        ]}
      />
    );
  }

  return <View style={[base, { borderRadius: size / 2 }]} />;
}

// بانر واحد
export default function BannerSlide({ banner, width }) {
  const layout = ALIGN[banner.align] || ALIGN.right;
  const textStyle = { color: banner.textColor, textAlign: layout.textAlign };

  return (
    <View
      style={[
        styles.bannerSlide,
        { width, backgroundColor: banner.background },
      ]}
    >
      {banner.shapes.map((shape, index) => (
        <Shape key={index} {...shape} />
      ))}

      {/* الصورة (وراها الكلام لو الـ align = center) */}
      <Image source={banner.image} style={[styles.bannerImage, layout.image]} />

      <View style={[styles.bannerTextBox, layout.box]}>
        <Text style={[styles.bannerTitle, textStyle]}>{banner.title}</Text>
        <Text style={[styles.bannerSubtitle, textStyle]}>{banner.subtitle}</Text>
        <TouchableOpacity
          style={[styles.bannerButton, { backgroundColor: banner.buttonColor }]}
          activeOpacity={0.85}
        >
          <Text style={[styles.bannerButtonText, banner.buttonTextColor && { color: banner.buttonTextColor }]}>{banner.buttonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
