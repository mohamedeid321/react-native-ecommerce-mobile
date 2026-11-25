import { StyleSheet, Dimensions } from "react-native";
import COLORS from "../../constants/colors.js";
import { ROW, SCREEN_PADDING } from "../../constants/layout.js";

const { width } = Dimensions.get("window");
const HERO_HEIGHT = Math.round(width * 0.8);

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 280, // مساحة عشان شريط الإضافة للسلة اللي تحت (فيه السعر الإجمالي)
  },

  // ---------- صورة المنتج ----------
  hero: {
    width: "100%",
    height: HERO_HEIGHT,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heroImagePlaceholder: {
    backgroundColor: COLORS.primaryLight,
  },
  heroButton: {
    position: "absolute",
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.92)",
    justifyContent: "center",
    alignItems: "center",
  },

  // ---------- الكارت اللي فيه المعلومات ----------
  sheet: {
    marginTop: -28,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: SCREEN_PADDING + 4,
    paddingTop: 22,
  },
  name: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.textDark,
    textAlign: "right",
  },
  category: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "right",
    marginTop: 2,
  },
  metaRow: {
    flexDirection: ROW,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },
  freshChip: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  freshChipText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingValue: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textDark,
    marginHorizontal: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  // ---------- السعر ----------
  priceRow: {
    flexDirection: ROW,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
  },
  price: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.textDark,
    textAlign: "right",
  },
  oldPrice: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textDecorationLine: "line-through",
    textAlign: "right",
    marginTop: 2,
  },
  discountBadge: {
    backgroundColor: "#fde1dd",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  discountText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: "800",
  },
  description: {
    fontSize: 14,
    lineHeight: 24,
    color: COLORS.textPrimary,
    textAlign: "right",
    marginTop: 18,
  },

  // ---------- شريط الإضافة للسلة ----------
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.background,
    //borderTopWidth: 1,
    //borderTopColor: COLORS.border,
    paddingHorizontal: SCREEN_PADDING + 4,
    paddingTop: 14,
  },
  actionRow: {
    flexDirection: ROW,
    alignItems: "center",
    gap: 12,
  },
  addButton: {
    flex: 1,
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "800",
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: 6,
  },
  stepperButton: {
    width: 34,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  stepperValue: {
    minWidth: 62, // مساحة للرقم + الوحدة (مثلاً: 12 كجم)
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  // السعر الإجمالي فوق زرار الإضافة (في النص)
  totalBox: {
    alignItems: "center",
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 30,
    fontWeight: "900",
    color: COLORS.primary,
    marginTop: 2,
  },
  featuresRow: {
    flexDirection: ROW,
    justifyContent: "space-between",
    marginTop: 14,
  },
  feature: {
    flexDirection: ROW,
    alignItems: "center",
    gap: 6,
  },
  featureText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
});
