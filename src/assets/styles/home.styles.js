import { StyleSheet, Dimensions } from "react-native";
import COLORS from "../../constants/colors.js";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2; // كارتين جنب بعض بمسافات متساوية

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // مساحة عشان الـ Tab Bar السفلي
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  menuButton: {
    padding: 8,
  },
  // البانر الترويجي العلوي
  bannerContainer: {
    height: 160,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 20,
    justifyContent: "space-between",
    marginBottom: 20,
    overflow: "hidden",
    position: "relative",
  },
  bannerTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "bold",
    width: "60%",
  },
  bannerSubtitle: {
    color: "#d1fae5",
    fontSize: 12,
    marginTop: 4,
  },
  shopNowButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  shopNowText: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 12,
  },
  bannerImage: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 140,
    height: 180,
    resizeMode: "contain",
  },
  // الفئات (Categories)
  categoriesContainer: {
    marginBottom: 20,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 16,
    backgroundColor: COLORS.cardBackground,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activeCategoryItem: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    marginTop: 6,
    fontWeight: "500",
  },
  activeCategoryText: {
    color: COLORS.white,
  },
  // قسم المنتجات
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  // شبكة المنتجات (Grid)
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  // تصميم الكارت (Product Card)
  productCard: {
    width: cardWidth,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  wishlistButton: {
    position: "absolute",
    top: 14,
    right: 14,
    zIndex: 1,
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 6,
    borderRadius: 50,
  },
  productImage: {
    width: "100%",
    height: 110,
    resizeMode: "contain",
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  productCategory: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
});
