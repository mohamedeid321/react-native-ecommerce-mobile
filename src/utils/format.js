const MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

export const money = (n) => `${(Number(n) || 0).toFixed(2)} ج.م`;

// 24 أكتوبر 2026
export const formatDate = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

// 09:30 ص
export const formatTime = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const h = d.getHours();
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")} ${h < 12 ? "ص" : "م"}`;
};

// اليوم / أمس / تاريخ
export const formatDay = (value) => {
  const d = new Date(value);
  const now = new Date();
  const same = (a, b) => a.toDateString() === b.toDateString();
  if (same(d, now)) return "اليوم";
  const y = new Date(now);
  y.setDate(now.getDate() - 1);
  if (same(d, y)) return "أمس";
  return formatDate(value);
};

// عنوان التوصيل في سطر واحد
export const addressLine = (d = {}) =>
  [
    d.city,
    d.neighborhood ? `مجاورة ${d.neighborhood}` : "",
    d.building ? `عمارة ${d.building}` : "",
    d.floor ? `الدور ${d.floor}` : "",
    d.apartment ? `شقة ${d.apartment}` : "",
    d.street,
  ]
    .filter(Boolean)
    .join("، ");
