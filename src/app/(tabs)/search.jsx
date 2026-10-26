import { View, Text, StyleSheet } from "react-native";
import COLORS from "../../constants/colors";

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Search Screen - Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  text: { fontSize: 16, color: COLORS.textSecondary, fontWeight: "600" },
});
