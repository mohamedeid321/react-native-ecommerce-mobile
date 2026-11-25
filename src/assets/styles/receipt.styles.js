import { Platform, StyleSheet } from "react-native";
import COLORS from "../../constants/colors";
import { ROW, SCREEN_PADDING } from "../../constants/layout";

// الفاتورة: ورقة بيضا وكتابة سودا زي ريسيت الكاشير
const MONO = Platform.select({ ios: "Courier", android: "monospace", default: "monospace" });
const INK = "#111111";

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SCREEN_PADDING, paddingBottom: 24 },

  paper: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 26,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  brand: { fontSize: 26, fontWeight: "900", color: INK, textAlign: "center" },
  subtitle: { fontSize: 13, color: INK, textAlign: "center", marginTop: 2, fontFamily: MONO },
  dashed: {
    borderBottomWidth: 1.5,
    borderStyle: "dashed",
    borderColor: INK,
    marginVertical: 12,
  },

  metaRow: { flexDirection: ROW, justifyContent: "space-between", marginBottom: 3 },
  metaLabel: { fontSize: 12, color: INK, fontFamily: MONO },
  metaValue: { fontSize: 12, color: INK, fontWeight: "700", flex: 1, marginRight: 14, textAlign: "left", fontFamily: MONO },

  headRow: { flexDirection: ROW, alignItems: "center", paddingBottom: 6 },
  headText: { fontSize: 12, fontWeight: "900", color: INK },
  row: { flexDirection: ROW, alignItems: "center", paddingVertical: 5 },
  colName: { flex: 1, textAlign: "right" },
  colQty: { width: 70, textAlign: "center" },
  colPrice: { width: 78, textAlign: "left" },
  cellText: { fontSize: 13, color: INK, fontFamily: MONO },
  cellName: { fontSize: 13, color: INK, fontWeight: "700" },
  cellSub: { fontSize: 11, color: "#555", fontFamily: MONO, marginTop: 1 },

  totalRow: { flexDirection: ROW, justifyContent: "space-between", paddingVertical: 3 },
  totalLabel: { fontSize: 14, color: INK, fontWeight: "700" },
  totalValue: { fontSize: 14, color: INK, fontFamily: MONO, fontWeight: "700" },
  grandLabel: { fontSize: 18, color: INK, fontWeight: "900" },
  grandValue: { fontSize: 18, color: INK, fontFamily: MONO, fontWeight: "900" },
  thanks: { fontSize: 13, color: INK, textAlign: "center", marginTop: 4, fontWeight: "700" },
  barcode: { fontSize: 22, color: INK, textAlign: "center", letterSpacing: 1, marginTop: 6 },

  // الحافة المسننة تحت الورقة
  zigzag: { flexDirection: "row", height: 10, overflow: "hidden", marginTop: -1 },
  zigzagTooth: {
    width: 14,
    height: 14,
    backgroundColor: "#ffffff",
    transform: [{ rotate: "45deg" }],
    marginTop: -7,
    marginHorizontal: 0,
  },

  // تنبيه نقص معلومات التوصيل
  warning: {
    flexDirection: ROW,
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fdebd7",
    borderRadius: 14,
    padding: 12,
    marginTop: 16,
  },
  warningText: { flex: 1, fontSize: 13, color: COLORS.textDark, textAlign: "right", fontWeight: "600" },
  warningButton: {
    backgroundColor: COLORS.orange,
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  warningButtonText: { color: COLORS.white, fontSize: 12, fontWeight: "800" },

  footer: {
    paddingHorizontal: SCREEN_PADDING + 4,
    paddingTop: 12,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  confirmButton: {
    height: 54,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmText: { color: COLORS.white, fontSize: 17, fontWeight: "800" },
});
