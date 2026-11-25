import { StyleSheet, Dimensions } from "react-native";
import COLORS from "../../constants/colors.js";
import { ROW, SCREEN_PADDING } from "../../constants/layout.js";

const { width } = Dimensions.get("window");
const CARD_GAP = 12;
const cardWidth = (width - SCREEN_PADDING * 2 - CARD_GAP) / 2; // كارتين جنب بعض

const softShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 6,
  elevation: 2,
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.homeBackground,
  },
  scrollContent: {
    paddingHorizontal: SCREEN_PADDING,
    paddingBottom: 110, // مساحة عشان الـ Tab Bar السفلي
  },

  // ---------- الهيدر ----------
  headerRow: {
    flexDirection: ROW,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 8,
  },
  headerIconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  appName: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 90,
    height: 90,
    objectFit: "contain",
  },

  // ---------- البحث ----------
  searchContainer: {
    flexDirection: ROW,
    alignItems: "center",
    height: 52,
    backgroundColor: COLORS.white,
    borderRadius: 26,
    paddingHorizontal: 18,
    marginTop: 6,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: COLORS.textDark,
    textAlign: "right",
  },
  searchButton: {
    padding: 6,
    marginRight: 6,
  },

  // ---------- البانر ----------
  bannerSlide: {
    height: 170,
    borderRadius: 24,
    overflow: "hidden",
  },
  // المكان الأفقي والعرض بييجوا من BannerSlide حسب الـ align
  bannerImage: {
    position: "absolute",
    bottom: 0,
    height: "100%",
    resizeMode: "cover",
  },
  bannerTextBox: {
    position: "absolute",
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 32,
  },
  bannerSubtitle: {
    fontSize: 13,
    marginTop: 4,
    opacity: 0.8,
  },
  bannerButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderRadius: 20,
  },
  bannerButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 13,
  },
  dotsRow: {
    flexDirection: ROW,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 18,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#d6ccb4",
    marginHorizontal: 3,
  },
  dotActive: {
    width: 20,
    backgroundColor: COLORS.primary,
  },

  // ---------- الجزء الأخضر فوق (هيدر + بحث + خصم) ----------
  hero: {
    backgroundColor: COLORS.primary,
    marginHorizontal: -SCREEN_PADDING,
    paddingHorizontal: SCREEN_PADDING,
    paddingBottom: 30,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: "hidden",
  },
  heroCircle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  heroTitle: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "900",
    color: COLORS.white,
    marginTop: 22,
  },
  heroTitleHighlight: { color: COLORS.highlight },

  // ---------- الأقسام ----------
  categoriesScroll: {
    marginHorizontal: -SCREEN_PADDING,
    marginTop: 22,
    marginBottom: 22,
  },
  categoriesContent: { paddingHorizontal: SCREEN_PADDING, gap: 12 },
  categoryItem: { width: 84, alignItems: "center" },
  categoryTile: {
    width: 84,
    height: 84,
    borderRadius: 20,
    backgroundColor: COLORS.tileBackground,
    borderWidth: 1,
    borderColor: "#e1e8e4",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    // من غير ظل/elevation: في الأندرويد الظل بيظهر من ورا الكارت الباهت وبيعمل مربع أبيض (زي شاشة الأقسام)
  },
  categoryImage: { width: 76, height: 76, resizeMode: "contain" },
  categoryLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textDark,
    textAlign: "center",
  },

  // ---------- عنوان القسم ----------
  sectionHeader: {
    flexDirection: ROW,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  sectionAction: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },

  // ---------- المنتجات ----------
  productsRow: {
    flexDirection: ROW,
    justifyContent: "space-between",
  },
  productCard: {
    width: cardWidth,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
    marginBottom: CARD_GAP,
    ...softShadow,
  },
  wishlistButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 1,
    backgroundColor: "rgba(255,255,255,0.85)",
    padding: 6,
    borderRadius: 50,
  },
  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
    resizeMode: "cover",
  },
  productImagePlaceholder: {
    backgroundColor: COLORS.primaryLight,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.textDark,
    textAlign: "right",
  },
  productCategory: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 6,
    textAlign: "right",
  },
  cardFooter: {
    flexDirection: ROW,
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
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
});
