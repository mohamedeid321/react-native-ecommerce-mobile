import { StyleSheet } from "react-native";
import COLORS from "../../constants/colors";
import { ROW } from "../../constants/layout";

// ستايل شاشات الدخول والتسجيل (RTL: الأيقونة على اليمين والكتابة من اليمين)
export default StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },

  // ---------- الهيدر فوق التدرج ----------
  header: { alignItems: "center", paddingHorizontal: 24, paddingBottom: 22 },

  backButton: {
    position: "absolute",
    left: 16,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
  illustration: { width: 190, height: 140, marginBottom: 6 },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.white,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.88)",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 22,
  },

  // ---------- الكارت الأبيض ----------
  card: {
    flex: 1,
    backgroundColor: COLORS.gradientBottom,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 32,
  },

  // ---------- الحقول ----------
  inputGroup: { marginBottom: 16 },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 8,
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: ROW,
    alignItems: "center",
    height: 52,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#dfe5e1",
    paddingHorizontal: 14,
  },
  inputError: { borderColor: COLORS.error },
  inputIcon: { marginLeft: 10 },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: COLORS.textDark,
    textAlign: "right",
  },
  eyeIcon: { paddingRight: 4, paddingLeft: 8 },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 6,
    textAlign: "right",
  },

  // ---------- الزرار والفوتر ----------
  button: {
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: COLORS.white, fontSize: 17, fontWeight: "800" },
  footer: {
    flexDirection: ROW,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 22,
  },
  footerText: { fontSize: 14, color: COLORS.textSecondary },
  link: { fontSize: 14, fontWeight: "800", color: COLORS.primary },
});
