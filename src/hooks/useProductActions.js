import { Alert } from "react-native";
import useRequireLogin from "./useRequireLogin";
import useCartStore from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";
import { toast } from "../utils/toast";

// أزرار "أضف للسلة" و "القلب": للزائر بتطلع رسالة تسجيل دخول، وللعميل بتتخزن في الباك
export default function useProductActions() {
  const requireLogin = useRequireLogin();
  const addToCartStore = useCartStore((s) => s.add);
  const toggleLikeStore = useWishlistStore((s) => s.toggle);

  const addToCart = (product, quantity = 1) =>
    requireLogin(async () => {
      const result = await addToCartStore(product._id, quantity);
      if (result.ok) toast("تمت الإضافة إلى السلة");
      else Alert.alert("تنبيه", result.message);
    });

  const toggleLike = (product) =>
    requireLogin(async () => {
      const result = await toggleLikeStore(product);
      if (!result.ok) Alert.alert("تنبيه", result.message);
    });

  return { addToCart, toggleLike };
}
