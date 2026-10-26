import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import COLORS from "../../constants/colors";
import styles from "../../assets/styles/home.styles";
import { API_URL } from "../../constants/api";
import { useAuthStore } from "../../store/authStore";

const CATEGORIES = [
  { id: "all", name: "Popular", icon: "flash" },
  { id: "Sweatshirts", name: "Sweatshirts", icon: "tshirt-crew-outline" },
  { id: "T-Shirts", name: "T-Shirts", icon: "tshirt-crew" },
  { id: "Shoes", name: "Shoes", icon: "shoe-sneaker" },
  { id: "Glasses", name: "Glasses", icon: "sunglasses" },
  { id: "Jackets", name: "Jackets", icon: "hanger" },
  { id: "Suits", name: "Suits", icon: "account-tie" },
  { id: "Bags", name: "Bags", icon: "bag-personal" },
];

export default function HomeScreen() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // جلب المنتجات مع الـ Pagination
  const fetchProducts = async (
    pageNumber = 1,
    category = "all",
    append = false,
    isRefresh = false,
  ) => {
    // لو التوكن لسه مش موجود، متعملش طلب وتتجنب خطأ 401
    if (!token) return;

    if (loading && !isRefresh) return;
    if (!hasMore && append && !isRefresh) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      let url = `${API_URL}/products?page=${pageNumber}&limit=6`;
      if (category !== "all") {
        url += `&category=${category}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data.products || response.data;

      if (data.length === 0) {
        setHasMore(false);
        if (!append) setProducts([]);
      } else {
        setProducts((prev) => (append ? [...prev, ...data] : data));
      }
    } catch (error) {
      // لو الخطأ 401 ومتأكدين إن المستخدم مسجل دخول، ده غالباً طلب قديم تم إلغاؤه
      if (error.response?.status !== 401) {
        console.error("Error fetching products:", error);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    if (token) {
      setPage(1);
      setHasMore(true);
      fetchProducts(1, selectedCategory, false, false);
    }
  }, [selectedCategory, token]);

  // دالة الـ Pull-to-Refresh
  const onRefresh = () => {
    setPage(1);
    setHasMore(true);
    fetchProducts(1, selectedCategory, false, true);
  };

  // التحميل عند الوصول لنهاية الـ Scroll
  const handleLoadMore = () => {
    if (!loading && hasMore && !refreshing) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage, selectedCategory, true, false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        onScroll={({ nativeEvent }) => {
          const paddingToBottom = 20;
          if (
            nativeEvent.layoutMeasurement.height +
              nativeEvent.contentOffset.y >=
            nativeEvent.contentSize.height - paddingToBottom
          ) {
            handleLoadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        {/* Header Options */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.menuButton}>
            <Feather name="menu" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>
        </View>

        {/* Banner Section */}
        <View style={styles.bannerContainer}>
          <View>
            <Text style={styles.bannerTitle}>Online Shopping Store</Text>
            <Text style={styles.bannerSubtitle}>
              Explore Performance Shopping Store
            </Text>
          </View>
          <TouchableOpacity style={styles.shopNowButton}>
            <Text style={styles.shopNowText}>Shop Now</Text>
          </TouchableOpacity>
          <Image
            source={require("../../assets/images/preview.png")}
            style={styles.bannerImage}
          />
        </View>

        {/* Categories Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryItem,
                  isSelected && styles.activeCategoryItem,
                ]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <MaterialCommunityIcons
                  name={cat.icon}
                  size={20}
                  color={isSelected ? COLORS.white : COLORS.primary}
                />
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.activeCategoryText,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Picks</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Products Grid */}
        {products.length === 0 && !loading ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: 40,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: COLORS.textSecondary,
                fontWeight: "600",
              }}
            >
              No Data
            </Text>
          </View>
        ) : (
          <View style={styles.productsGrid}>
            {products.map((item, index) => (
              <TouchableOpacity
                key={item._id || index}
                style={styles.productCard}
                onPress={() => router.push(`/product/${item._id}`)}
              >
                <TouchableOpacity style={styles.wishlistButton}>
                  <Ionicons
                    name="heart-outline"
                    size={16}
                    color={COLORS.textPrimary}
                  />
                </TouchableOpacity>

                <Image
                  source={{ uri: item.image?.url || item.image }}
                  style={[styles.productImage, { resizeMode: "cover" }]}
                />
                <Text style={styles.productName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.productCategory} numberOfLines={1}>
                  {item.category}
                </Text>

                <View style={styles.cardFooter}>
                  <Text style={styles.productPrice}>${item.price}</Text>
                  <View style={styles.addButton}>
                    <Ionicons name="add" size={16} color={COLORS.white} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
