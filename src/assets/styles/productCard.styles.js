import { StyleSheet, Dimensions } from "react-native";
import COLORS from "../../constants/colors.js";
import { ROW, SCREEN_PADDING } from "../../constants/layout.js";

const { width } = Dimensions.get("window");
const CARD_GAP = 12;
export const CARD_WIDTH = (width - SCREEN_PADDING * 2 - CARD_GAP) / 2; // كارتين جنب بعض

export default StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
    marginBottom: CARD_GAP,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  // شارة الخصم (شمال) + القلب (يمين)
  topRow: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    zIndex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    backgroundColor: COLORS.danger,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 9,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "800",
  },
  heartButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: 118,
    marginTop: 30,
    marginBottom: 8,
    resizeMode: "contain",
  },
  imagePlaceholder: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
    textAlign: "right",
  },

  // السعر (يمين) + زرار الإضافة (شمال)
  priceRow: {
    flexDirection: ROW,
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 6,
  },
  priceBlock: {
    flexShrink: 1,
  },
  priceLine: {
    textAlign: "right",
    color: COLORS.textDark,
  },
  price: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  currency: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  oldPrice: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textDecorationLine: "line-through",
    textAlign: "right",
    marginTop: 1,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});
