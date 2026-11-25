import { StyleSheet } from "react-native";
import COLORS from "../../constants/colors";
import { ROW, SCREEN_PADDING } from "../../constants/layout";

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // ---------- الهيدر ----------
  header: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 10,
  },
  title: { fontSize: 22, fontWeight: "800", color: COLORS.textDark },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },

  listContent: { paddingHorizontal: SCREEN_PADDING, paddingTop: 6, paddingBottom: 16, flexGrow: 1 },

  // ---------- كارت منتج في السلة: الصورة يمين والتفاصيل شمالها ----------
  item: {
    flexDirection: ROW,
    alignItems: "center",
    backgroundColor: COLORS.cardBackground,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
    marginBottom: 12,
    gap: 12,
  },
  itemImage: {
    width: 84,
    height: 84,
    borderRadius: 14,
    backgroundColor: COLORS.primaryLight,
    resizeMode: "contain",
  },
  itemBody: { flex: 1 },
  itemTopRow: { flexDirection: ROW, justifyContent: "space-between", alignItems: "flex-start" },
  itemName: { flex: 1, fontSize: 16, fontWeight: "800", color: COLORS.textDark, textAlign: "right" },
  trashButton: { padding: 4, marginRight: -4 },
  unitPriceRow: { flexDirection: ROW, alignItems: "center", gap: 8, marginTop: 2 },
  unitPrice: { fontSize: 13, color: COLORS.textSecondary, textAlign: "right" },
  oldPrice: { fontSize: 12, color: COLORS.textSecondary, textDecorationLine: "line-through" },
  discountChip: {
    backgroundColor: "#fde1dd",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  discountChipText: { fontSize: 11, fontWeight: "800", color: COLORS.danger },
  itemBottomRow: {
    flexDirection: ROW,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  lineTotal: { fontSize: 16, fontWeight: "800", color: COLORS.primary },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  stepperButton: { width: 32, height: 36, justifyContent: "center", alignItems: "center" },
  stepperValue: {
    minWidth: 54,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
  },

  // ---------- الملخص الثابت تحت ----------
  footer: {
    backgroundColor: COLORS.cardBackground,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: SCREEN_PADDING + 4,
    paddingTop: 14,
    paddingBottom: 14,
  },
  summaryRow: {
    flexDirection: ROW,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  summaryLabel: { fontSize: 14, color: COLORS.textSecondary },
  summaryValue: { fontSize: 14, color: COLORS.textDark, fontWeight: "600" },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 8 },
  totalLabel: { fontSize: 17, fontWeight: "800", color: COLORS.textDark },
  totalValue: { fontSize: 22, fontWeight: "900", color: COLORS.textDark },
  orderButton: {
    height: 54,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  orderButtonText: { color: COLORS.white, fontSize: 17, fontWeight: "800" },

  // ---------- فاضية ----------
  emptyBox: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 60 },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textDark },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, marginTop: 6 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
});
