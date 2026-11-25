import React from "react";
import { View, FlatList } from "react-native";
import { useRouter } from "expo-router";
import styles from "../../assets/styles/categories.styles";
import CATEGORIES from "../../constants/categories";
import ScreenHeader from "../../components/common/ScreenHeader";
import CategoryCard from "../../components/categories/CategoryCard";

export default function CategoriesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="الأقسام"
        onBackPress={() => router.navigate("/(tabs)")}
        actionIcon="search-outline"
        onActionPress={() => router.push("/search-products")}
      />

      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CategoryCard
            category={item}
            onPress={() =>
              router.push({
                pathname: "/category/[id]",
                params: { id: item.id },
              })
            }
          />
        )}
      />
    </View>
  );
}
