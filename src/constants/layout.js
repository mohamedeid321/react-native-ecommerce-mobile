import { I18nManager } from "react-native";

// التطبيق بيتعرض من اليمين للشمال بشكل يدوي (من غير ما نقلب اتجاه النظام كله)
// عشان التاب بار المخصص وباقي الحسابات تفضل زي ما هي.
I18nManager.allowRTL(false);
I18nManager.forceRTL(false);

// استخدمها بدل "row": أول عنصر بيبقى على اليمين
export const ROW = "row-reverse";
export const TEXT_ALIGN = "right";

// مسافة جانبي الشاشة
export const SCREEN_PADDING = 16;
