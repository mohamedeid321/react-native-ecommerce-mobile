import { useRouter } from "expo-router";

const round2 = (n) => Math.round(n * 100) / 100;

// بيرجّع دالة بتفتح صفحة تفاصيل المنتج وبتبعتلها بياناته
// (الـ params لازم تكون نصوص)
export default function useGoToProduct() {
  const router = useRouter();

  return (item) => {
    const price = Number(item.price) || 0;
    const discount = Number(item.discount) || 0;
    const finalPrice =
      item.finalPrice != null
        ? Number(item.finalPrice)
        : round2(price * (1 - discount / 100));

    router.push({
      pathname: "/product/[id]",
      params: {
        id: item._id,
        name: item.name ?? "",
        category: item.category ?? "",
        price: String(price),
        finalPrice: String(finalPrice),
        discount: String(discount),
        // صورة الكارت وصورة التفاصيل (لو مفيش تفاصيل بنستخدم صورة الكارت)
        image: item.image?.url || item.image || "",
        detailImage: item.detailImage || "",
        description: item.description ?? "",
        unit: item.unit ?? "",
        rating: String(item.rating ?? ""),
        reviewsCount: String(item.reviewsCount ?? ""),
      },
    });
  };
}
