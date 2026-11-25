import COLORS from "./colors";

// مراحل الطلب بالترتيب (اللي بتظهر في شاشة التتبع)
export const STAGES = [
  {
    key: "placed",
    title: "تم الطلب",
    desc: "تم استلام طلبك بنجاح",
    icon: "checkmark",
  },
  {
    key: "preparing",
    title: "جاري التجهيز",
    desc: "جاري تجهيز طلبك من المخزن",
    icon: "cube-outline",
  },
  {
    key: "out_for_delivery",
    title: "الخروج للتوصيل",
    desc: "طلبك في الطريق إليك",
    icon: "bicycle-outline",
  },
  {
    key: "delivered",
    title: "تم التسليم بنجاح",
    desc: "نتمنى أن ينال إعجابك",
    icon: "flag-outline",
  },
];

// اسم الحالة ولونها (للتيكت والجدول)
export const STATUS_META = {
  placed: { label: "تم الطلب", color: COLORS.orange, bg: "#fdebd7" },
  preparing: { label: "جاري التجهيز", color: COLORS.orange, bg: "#fdebd7" },
  out_for_delivery: { label: "خرج للتوصيل", color: COLORS.primary, bg: COLORS.primaryLight },
  delivered: { label: "تم التسليم", color: COLORS.primary, bg: COLORS.primaryLight },
  cancelled: { label: "ملغي", color: COLORS.danger, bg: "#fde1dd" },
};

// الحالة اللي بعدها (للـ admin)
export const NEXT_STATUS = {
  placed: "preparing",
  preparing: "out_for_delivery",
  out_for_delivery: "delivered",
};
export const NEXT_STATUS_LABEL = {
  placed: "بدء التجهيز",
  preparing: "خرج للتوصيل",
  out_for_delivery: "تم التسليم بنجاح",
};

export const STAGE_INDEX = { placed: 0, preparing: 1, out_for_delivery: 2, delivered: 3 };

export const CAN_CUSTOMER_CANCEL = ["placed", "preparing"];
export const CAN_ADMIN_CANCEL = ["placed", "preparing"];
