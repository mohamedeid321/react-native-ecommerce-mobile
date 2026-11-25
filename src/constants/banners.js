import COLORS from "./colors";

// ====== صور البانرات (صور من غير خلفية) ======
// حط الصور في src/assets/images بنفس الأسماء دي، أو غيّر المسارات هنا
// banner2 (الكلام في النص): صورة كبيرة فاضية من النص، بتتعرض ورا الكلام بمقاس البانر كله
import banner1 from "../assets/images/banner1.png";
import banner2 from "../assets/images/banner2.png";
import banner3 from "../assets/images/banner3.png";
import banner4 from "../assets/images/banner4.png";

// align: مكان الكلام -> "right" | "left" | "center"
// الأشكال (shapes) بتترسم بالكود: circle أو leaf، مواقعها بالـ top / bottom / left / right
const BANNERS = [
  {
    id: "fresh-farm",
    align: "right", // الكلام يمين والصورة شمال
    title: "خصوماتنا لحد 70%! 🎉",
    subtitle: "من المزرعة لبيتك",
    buttonText: "تسوق العروض",
    image: banner1,
    background: COLORS.primary,
    textColor: COLORS.white,
    buttonColor: COLORS.highlight,
    buttonTextColor: COLORS.textDark,
    shapes: [
      {
        type: "circle",
        size: 210,
        color: COLORS.primaryDark,
        left: -70,
        bottom: -90,
      },
      {
        type: "circle",
        size: 80,
        color: COLORS.primaryMid,
        top: -28,
        right: 120,
      },
      {
        type: "leaf",
        size: 34,
        color: COLORS.highlight,
        top: 14,
        left: 130,
        rotate: "20deg",
      },
      {
        type: "leaf",
        size: 22,
        color: COLORS.white,
        bottom: 20,
        left: 165,
        rotate: "-35deg",
      },
      {
        type: "circle",
        size: 12,
        color: COLORS.primaryMid,
        top: 62,
        left: 112,
      },
    ],
  },
  {
    id: "daily-deals",
    align: "center", // الكلام في النص والصورة وراه
    title: "الهدية الأحلى ! 🎁",
    subtitle: "بوكسات فاكهة متحضّرة تهادي الأحباب.",
    buttonText: "اكتشف قريبًا",
    image: banner2,
    background: COLORS.primary,
    textColor: COLORS.white,
    buttonColor: COLORS.highlight,
    buttonTextColor: COLORS.textDark,
    shapes: [
      {
        type: "circle",
        size: 190,
        color: COLORS.primaryDark,
        left: -60,
        top: -80,
      },
      {
        type: "circle",
        size: 150,
        color: COLORS.primaryDark,
        right: -50,
        bottom: -70,
      },
      {
        type: "circle",
        size: 60,
        color: COLORS.primaryMid,
        top: -20,
        right: 90,
      },
      {
        type: "leaf",
        size: 30,
        color: COLORS.highlight,
        bottom: 14,
        left: 24,
        rotate: "-20deg",
      },
      {
        type: "leaf",
        size: 22,
        color: COLORS.highlight,
        top: 16,
        right: 28,
        rotate: "40deg",
      },
    ],
  },
  {
    id: "free-delivery",
    align: "left", // الكلام شمال والصورة يمين
    title: "أول طلب علينا! 🚚",
    subtitle: "أول طلب توصيله مجاني",
    buttonText: "اطلب دلوقتي",
    image: banner3,
    background: COLORS.primary,
    textColor: COLORS.white,
    buttonColor: COLORS.highlight,
    buttonTextColor: COLORS.textDark,
    shapes: [
      {
        type: "circle",
        size: 190,
        color: COLORS.primaryDark,
        right: -50,
        bottom: -80,
      },
      {
        type: "circle",
        size: 70,
        color: COLORS.primaryMid,
        top: -22,
        left: 100,
      },
      {
        type: "leaf",
        size: 32,
        color: COLORS.highlight,
        top: 16,
        right: 135,
        rotate: "-25deg",
      },
      {
        type: "leaf",
        size: 22,
        color: COLORS.white,
        bottom: 22,
        right: 160,
        rotate: "30deg",
      },
    ],
  },
  {
    id: "weekly-offers",
    align: "right",
    title: "صواني فاكهة تفتح النفس.. قريبًا! 🍓",
    subtitle: "تشكيلة من أطعم الفواكه",
    buttonText: "ترقّبوا الجديد",
    image: banner4, // TODO: بدّلها بصورة banner4 لما تجهز (وزوّد import فوق)
    background: COLORS.primary,
    textColor: COLORS.white,
    buttonColor: COLORS.highlight,
    buttonTextColor: COLORS.textDark,
    shapes: [
      {
        type: "circle",
        size: 200,
        color: COLORS.primaryDark,
        left: -60,
        bottom: -90,
      },
      {
        type: "circle",
        size: 70,
        color: COLORS.primaryMid,
        top: -22,
        right: 130,
      },
      {
        type: "leaf",
        size: 30,
        color: COLORS.highlight,
        top: 18,
        left: 140,
        rotate: "25deg",
      },
      {
        type: "leaf",
        size: 20,
        color: COLORS.white,
        bottom: 22,
        left: 170,
        rotate: "-30deg",
      },
    ],
  },
];

export default BANNERS;
