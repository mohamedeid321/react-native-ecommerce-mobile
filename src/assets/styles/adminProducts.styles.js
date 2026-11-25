import { StyleSheet } from "react-native";
import COLORS from "../../constants/colors";
import { ROW, SCREEN_PADDING } from "../../constants/layout";

// عرض أعمدة الجدول (الاسم بياخد الباقي)
const PRICE_W = 62;
const CATEGORY_W = 66;
const ACTION_W = 40;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SCREEN_PADDING,
  },
  editContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ---------- العنوان ----------
  titleRow: {
    flexDirection: ROW,
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  countBadge: {
    minWidth: 28,
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  countText: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.primary,
  },

  // ---------- فلتر الأقسام ----------
  filterScroll: {
    flexGrow: 0,
    marginBottom: 12,
  },
  filterContent: {
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  chipTextActive: {
    color: COLORS.white,
  },

  // ---------- الجدول ----------
  table: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: ROW,
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  headText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
  },
  row: {
    flexDirection: ROW,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  rowAlt: {
    backgroundColor: "#f8f4ea",
  },
  listContent: {
    flexGrow: 1,
  },

  // الخلايا (نفس العرض في الهيدر والصف)
  nameCell: {
    flex: 1,
    flexDirection: ROW,
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
    paddingHorizontal: 2,
  },
  priceCell: {
    width: PRICE_W,
    alignItems: "center",
  },
  categoryCell: {
    width: CATEGORY_W,
    alignItems: "center",
  },
  actionCell: {
    width: ACTION_W,
    alignItems: "center",
  },

  thumb: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    resizeMode: "contain",
  },
  thumbPlaceholder: {
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  nameTextBox: {
    flex: 1,
    alignItems: "flex-end",
  },
  nameText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
    textAlign: "right",
  },
  starButton: {
    marginTop: 3,
  },
  priceText: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.primary,
  },
  oldPriceText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textDecorationLine: "line-through",
    marginTop: 1,
  },
  categoryChip: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "center",
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: COLORS.primaryLight,
  },
  deleteButton: {
    backgroundColor: "#fde1dd",
  },

  // ---------- حالات فاضية وتحميل ----------
  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  loaderContainer: {
    paddingVertical: 16,
  },
  retryButton: {
    marginTop: 14,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 12,
  },
  retryText: {
    color: COLORS.white,
    fontWeight: "700",
  },
});
