import { Alert, Platform, ToastAndroid } from "react-native";

// رسالة خفيفة: Toast على أندرويد، وتنبيه عادي على iOS
export const toast = (message) => {
  if (Platform.OS === "android") ToastAndroid.show(message, ToastAndroid.SHORT);
  else Alert.alert("", message);
};
