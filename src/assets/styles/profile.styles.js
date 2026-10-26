import { StyleSheet } from "react-native";
import COLORS from "../../constants/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 20,
    marginTop: 10,
  },
  // كارت أفقي زي اللي في الصورة
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row", // عناصر بجانب بعضها (صورة + بيانات)
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
  },
  placeholderAvatar: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: "#f3f4f6", // خلفية فاتحة للأفاتار زي الصورة
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary, // لون أخضر داكن زي التصميم
    marginBottom: 2,
  },
  email: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  // زر الخروج الأخضر العريض زي الصورة
  logoutButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary, // لون أخضر داكن
    borderRadius: 14,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.white,
    marginLeft: 8,
  },
});
