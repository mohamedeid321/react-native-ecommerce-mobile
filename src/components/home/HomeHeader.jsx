import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFonts, ArefRuqaa_700Bold } from "@expo-google-fonts/aref-ruqaa";
import COLORS from "../../constants/colors";
import styles from "../../assets/styles/home.styles";
import SideMenu from "./SideMenu";
import useRequireLogin from "../../hooks/useRequireLogin";
import useNotificationsStore from "../../store/notificationsStore";

// على الخلفية الخضرا: أزرار شفافة وأيقونات بيضا
const lightBtn = {
  backgroundColor: "rgba(255,255,255,0.18)",
  borderColor: "transparent",
};

// الهيدر: القايمة على اليمين، اسم التطبيق في النص، الجرس على الشمال
export default function HomeHeader({ light = false }) {
  const [fontsLoaded] = useFonts({ ArefRuqaa_700Bold });
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const requireLogin = useRequireLogin();
  const unread = useNotificationsStore((s) => s.unreadCount);

  return (
    <View style={styles.headerRow}>
      <TouchableOpacity
        style={[styles.headerIconButton, light && lightBtn]}
        activeOpacity={0.7}
        onPress={() => setMenuOpen(true)}
      >
        <Feather
          name="menu"
          size={22}
          color={light ? COLORS.white : COLORS.textDark}
        />
      </TouchableOpacity>
      <Image
        source={require("../../assets/images/home-icon.png")}
        style={styles.appName}
      />

      {/* <Text
        style={[
          styles.appName,
          light && { color: COLORS.white },
          fontsLoaded && { fontFamily: "ArefRuqaa_700Bold" },
        ]}
      >
        لقطة
      </Text> */}

      <TouchableOpacity
        style={[styles.headerIconButton, light && lightBtn]}
        activeOpacity={0.7}
        onPress={() => requireLogin(() => router.push("/notifications"))}
      >
        <Ionicons
          name="notifications-outline"
          size={22}
          color={light ? COLORS.white : COLORS.textDark}
        />
        {unread > 0 && (
          <View
            style={{
              position: "absolute",
              top: 2,
              right: 2,
              minWidth: 18,
              height: 18,
              borderRadius: 9,
              paddingHorizontal: 4,
              backgroundColor: COLORS.danger,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{ color: COLORS.white, fontSize: 10, fontWeight: "800" }}
            >
              {unread > 9 ? "9+" : unread}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <SideMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}
