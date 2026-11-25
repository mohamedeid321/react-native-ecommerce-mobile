// ====== الأقسام (الترتيب من اليمين للشمال، من فوق لتحت) ======
// الصور في src/assets/categories بنفس الأسماء دي (أو غيّر المسارات هنا)
// لازم الـ 10 صور كلهم يكونوا موجودين وإلا التطبيق مش هيبني (Metro بيدور على الملفات وقت البناء)
//
// enabled: true  => القسم شغال ويفتح شاشة منتجاته
// enabled: false => القسم باهت ومش بيتداس (لحد ما نفعّله)
// apiCategory: القيمة اللي في حقل category عند المنتج في الداتابيز (لازم تتطابق بالظبط)
const CATEGORIES = [
  {
    id: "fruits",
    ar: "فاكهة",
    en: "Fruits",
    image: require("../assets/categories/fruits.png"),
    enabled: true,
    apiCategory: "fruits",
  },
  {
    id: "vegetables",
    ar: "خضار",
    en: "Vegetables",
    image: require("../assets/categories/vegetables.png"),
    enabled: false,
  },
  {
    id: "dairy",
    ar: "منتجات ألبان وبيض",
    en: "Dairy & Eggs",
    image: require("../assets/categories/milk.png"),
    enabled: false,
  },
  {
    id: "meat",
    ar: "لحوم ودواجن",
    en: "Meat & Poultry",
    image: require("../assets/categories/meat.png"),
    enabled: false,
  },
  {
    id: "seafood",
    ar: "مأكولات بحرية",
    en: "Seafood",
    image: require("../assets/categories/seafood.png"),
    enabled: false,
  },
  {
    id: "bakery",
    ar: "مخبوزات",
    en: "Bakery",
    image: require("../assets/categories/bakery.png"),
    enabled: false,
  },
  {
    id: "home",
    ar: "مستلزمات منزلية",
    en: "Home & Kitchen",
    image: require("../assets/categories/Kitchen.png"),
    enabled: false,
  },
  {
    id: "fashion",
    ar: "أزياء",
    en: "Fashion",
    image: require("../assets/categories/Fashion.png"),
    enabled: false,
  },
  {
    id: "personal-care",
    ar: "عناية شخصية",
    en: "Personal Care",
    image: require("../assets/categories/Care.png"),
    enabled: false,
  },
  {
    id: "toys",
    ar: "ألعاب",
    en: "Toys",
    image: require("../assets/categories/Toys.png"),
    enabled: false,
  },
];

export default CATEGORIES;
