import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { ROW } from "../../constants/layout";
import { formatDate } from "../../utils/format";

// الأفاتار (يمين) + الاسم والإيميل وتاريخ التسجيل
export default function ProfileHeader({ user }) {
  return (
    <View style={styles.row}>
      {user?.profileImage ? (
        <Image source={{ uri: user.profileImage }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarFallback]}>
          <Ionicons name="person" size={36} color={COLORS.primary} />
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {user?.username}
        </Text>
        <Text style={styles.email} numberOfLines={1}>
          {user?.email}
        </Text>
        {!!user?.createdAt && (
          <Text style={styles.since}>عضو منذ {formatDate(user.createdAt)}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: ROW,
    alignItems: "center",
    gap: 14,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.primaryLight },
  avatarFallback: { justifyContent: "center", alignItems: "center" },
  info: { flex: 1 },
  name: { fontSize: 20, fontWeight: "800", color: COLORS.textDark, textAlign: "right" },
  email: { fontSize: 13, color: COLORS.textSecondary, textAlign: "right", marginTop: 2 },
  since: { fontSize: 12, color: COLORS.textSecondary, textAlign: "right", marginTop: 4 },
});
