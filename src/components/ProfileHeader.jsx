import { View, Text } from "react-native";
import { useAuthStore } from "../store/authStore";
import { Image } from "expo-image";
import styles from "../assets/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";

export default function ProfileHeader() {
  const { user } = useAuthStore();

  if (!user) return null;

  // تنسيق التاريخ ليطابق الشكل في الصورة (مثلاً: Member since 3/9/2025 أو بالشهر)
  const formatDate = (dateString) => {
    if (!dateString) return "3/9/2025";
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  // استخدام أفاتار افتراضي جذاب بناءً على اسم المستخدم لو مفيش صورة
  const avatarUri =
    user.avatar ||
    user.profileImage ||
    `https://avatar.iran.liara.run/public/boy?username=${user.username}`;

  return (
    <View style={styles.card}>
      {/* الأفاتار على اليسار */}
      <View style={styles.avatarContainer}>
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
      </View>

      {/* بيانات المستخدم على اليمين */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{user.username || "John Doe"}</Text>
        <Text style={styles.email}>{user.email || "john@gmail.com"}</Text>
        <Text style={styles.dateText}>
          Member since {formatDate(user.createdAt)}
        </Text>
      </View>
    </View>
  );
}
