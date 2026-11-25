import { StyleSheet, Dimensions } from "react-native";
import COLORS from "../../constants/colors.js";
import { ROW, SCREEN_PADDING } from "../../constants/layout.js";

const { width } = Dimensions.get("window");
const GAP = 12;
const cardWidth = (width - SCREEN_PADDING * 2 - GAP) / 2;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ---------- الهيدر ----------
  header: {
    flexDirection: "row", // الرجوع شمال والإجراء يمين (زي التصميم)
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SCREEN_PADDING,
    paddingVertical: 10,
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textDark,
  },

  // ---------- شبكة الأقسام ----------
  listContent: {
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: 8,
    paddingBottom: 24,
  },
  row: {
    flexDirection: ROW, // أول قسم على اليمين
    justifyContent: "space-between",
  },
  card: {
    width: cardWidth,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: GAP,
    paddingTop: 12,
    paddingBottom: 12,
    alignItems: "center",
  },
  cardDisabled: {
    opacity: 0.4, // باهت = مش مفعّل
  },
  cardImage: {
    width: "88%",
    height: cardWidth * 0.58,
    resizeMode: "contain",
  },
  cardTitle: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textDark,
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 1,
  },

  // ---------- شاشة منتجات القسم ----------
  productsRow: {
    flexDirection: ROW,
    justifyContent: "space-between",
  },
  loaderContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
});
