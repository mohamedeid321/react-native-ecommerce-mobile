import React, { useState } from "react";
import { ScrollView, RefreshControl, Text } from "react-native";
import styles from "../../assets/styles/profile.styles";
import ProfileHeader from "../../components/ProfileHeader";
import LogoutButton from "../../components/LogoutButton";

export default function Profile() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // محاكاة التحديث أو جلب بيانات المستخدم المحدثة
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[styles.primaryColor || "#1b4d3e"]}
        />
      }
    >
      <Text style={styles.screenTitle}>My Profile</Text>

      {/* Profile Info Card */}
      <ProfileHeader />

      {/* Logout Action */}
      <LogoutButton />
    </ScrollView>
  );
}
