import React, { useEffect, useRef, useState } from "react";
import { View, FlatList, useWindowDimensions } from "react-native";
import BannerSlide from "./BannerSlide";
import BANNERS from "../../constants/banners";
import { SCREEN_PADDING } from "../../constants/layout";
import styles from "../../assets/styles/home.styles";

// سلايدر البانرات: بيتحرك لوحده كل `interval` ملي ثانية + نقط من تحت
export default function BannerSlider({ banners = BANNERS, interval = 2000 }) {
  const { width } = useWindowDimensions();
  const slideWidth = width - SCREEN_PADDING * 2;

  const listRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  // الحركة التلقائية (بتقف لما المستخدم يمسك السلايدر)
  useEffect(() => {
    if (isDragging || banners.length < 2) return;

    const timer = setTimeout(() => {
      const next = (activeIndex + 1) % banners.length;
      listRef.current?.scrollToIndex({ index: next, animated: true });
    }, interval);

    return () => clearTimeout(timer);
  }, [activeIndex, isDragging, interval, banners.length]);

  return (
    <View>
      <FlatList
        ref={listRef}
        data={banners}
        horizontal
        pagingEnabled
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        style={{ width: slideWidth, borderRadius: 24 }}
        renderItem={({ item }) => (
          <BannerSlide banner={item} width={slideWidth} />
        )}
        getItemLayout={(_, index) => ({
          length: slideWidth,
          offset: slideWidth * index,
          index,
        })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScrollBeginDrag={() => setIsDragging(true)}
        onScrollEndDrag={() => setIsDragging(false)}
        onScrollToIndexFailed={() => {}}
      />

      <View style={styles.dotsRow}>
        {banners.map((banner, index) => (
          <View
            key={banner.id}
            style={[styles.dot, index === activeIndex && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}
