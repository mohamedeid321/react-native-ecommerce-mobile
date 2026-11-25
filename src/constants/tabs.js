// ====== إعدادات التابات لكل دور ======
// الترتيب هنا = الترتيب من اليمين للشمال (أول تاب بيبقى على اليمين)
// route = اسم الملف جوه app/(tabs) من غير .jsx
// icon.active / icon.inactive = أيقونات Ionicons (الأولى مليانة للتاب المختار)

// مسار شاشة تسجيل الدخول (عدّله لو شاشتك اسمها غير كده، مثلاً "/(auth)/login")
export const AUTH_ROUTE = "/(auth)";

const HOME = {
  route: "index",
  label: "الرئيسية",
  icon: { active: "home", inactive: "home-outline" },
};
const CATEGORIES = {
  route: "categories",
  label: "الأقسام",
  icon: { active: "grid", inactive: "grid-outline" },
};
const CART = {
  route: "cart",
  label: "السلة",
  icon: { active: "cart", inactive: "cart-outline" },
};
const ORDERS = {
  route: "orders",
  label: "الطلبات",
  icon: { active: "receipt", inactive: "receipt-outline" },
};
const PROFILE = {
  route: "profile",
  label: "الحساب",
  icon: { active: "person", inactive: "person-outline" },
};

// الزائر: آخر تاب "تسجيل الدخول" وبيفتح شاشة الدخول بدل شاشة الحساب
const LOGIN = {
  route: "profile",
  label: "تسجيل الدخول",
  icon: { active: "log-in", inactive: "log-in-outline" },
  opensAuth: true,
};

const ADD_PRODUCT = {
  route: "create",
  label: "أضف منتج",
  icon: { active: "add-circle", inactive: "add-circle-outline" },
};
const PRODUCTS = {
  route: "products",
  label: "المنتجات",
  icon: { active: "cube", inactive: "cube-outline" },
};
const STATS = {
  route: "stats",
  label: "الإحصائيات",
  icon: { active: "stats-chart", inactive: "stats-chart-outline" },
};

export const TABS_BY_ROLE = {
  guest: [HOME, CATEGORIES, CART, ORDERS, LOGIN],
  customer: [HOME, CATEGORIES, CART, ORDERS, PROFILE],
  admin: [ORDERS, ADD_PRODUCT, PRODUCTS, STATS, PROFILE],
};

// كل الشاشات اللي ظاهرة كتاب عند أي دور (بنستخدمها عشان نمنع دخول شاشة مش بتاعت دور المستخدم)
export const ROLE_ROUTES = new Set(
  Object.values(TABS_BY_ROLE).flatMap((tabs) => tabs.map((t) => t.route)),
);

// بيحدد الدور من حالة تسجيل الدخول
// مفيش توكن => guest | التوكن + role = admin => admin | غير كده => customer
export const getRole = ({ token, user }) => {
  if (!token) return "guest";
  return user?.role === "admin" ? "admin" : "customer";
};
