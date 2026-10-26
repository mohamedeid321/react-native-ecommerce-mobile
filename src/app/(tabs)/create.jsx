import {
  View,
  Text,
  ScrollView,
  TextInput,
  Platform,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useState } from "react";
import styles from "../../assets/styles/create.styles";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import COLORS from "../../constants/colors";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "../../store/authStore";
import { API_URL } from "../../constants/api";
// available categories
const CATEGORIES = [
  "Sweatshirts",
  "T-Shirts",
  "Shoes",
  "Glasses",
  "Jackets",
  "Suits",
  "Bags",
];

//
export default function Create() {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();
  //handle image picker
  const pickImage = async () => {
    try {
      // launch image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5, // lower quality for smaller size
      });

      if (!result.canceled) {
        setNewProduct({ ...newProduct, image: result.assets[0] });
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "There was a problem selecting your image");
    }
  };
  //
  //handle submition to backend
  const handleSubmit = async () => {
    if (
      !newProduct.name.trim() ||
      !newProduct.price ||
      !newProduct.category ||
      !newProduct.image
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      // 2. create FormData object to send
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("price", newProduct.price);
      formData.append("category", newProduct.category);
      if (newProduct.image && newProduct.image.uri) {
        // 3 prepare image to send
        const imageUri = newProduct.image.uri;
        const filename = imageUri.split("/").pop(); // استخراج اسم الملف

        // identify type of the image
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append("image", {
          uri: imageUri,
          name: filename,
          type: type,
        });
      }
      // 4 send to backend
      const response = await axios.post(`${API_URL}/products`, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response?.data) {
        throw new Error(data.message || "Something went wrong during send");
      }

      Alert.alert("Success", "Your product has been created!");

      // cleanup the array state variable to the next submition
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        image: null,
      });
    } catch (error) {
      console.error("Submit error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Server error";

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };
  //
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={styles.scrollViewStyle}
    >
      {/* big card  */}
      <View style={styles.card}>
        {/* header title */}
        <View style={styles.header}>
          <Text style={styles.title}>Create New Product</Text>
        </View>
        {/* product name field */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Product Name</Text>
          <View style={styles.inputContainer}>
            <AntDesign
              name="product"
              size={20}
              color={COLORS.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your Product name"
              placeholderTextColor={COLORS.placeholderText}
              value={newProduct.name}
              onChangeText={(name) =>
                setNewProduct({ ...newProduct, name: name })
              }
            />
          </View>
        </View>
        {/* end */}
        {/* Description field */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <View style={[styles.inputContainer, { alignItems: "flex-start" }]}>
            <MaterialIcons
              name="description"
              size={20}
              color={COLORS.textSecondary}
              style={{ marginTop: 10 }}
            />

            <TextInput
              style={styles.textArea}
              placeholder="Type Description here"
              placeholderTextColor={COLORS.placeholderText}
              value={newProduct.description}
              onChangeText={(description) =>
                setNewProduct({ ...newProduct, description: description })
              }
              multiline={true}
              numberOfLines={4}
            />
          </View>
        </View>
        {/* end */}
        {/* Price field */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Price</Text>
          <View style={styles.inputContainer}>
            <FontAwesome6
              name="dollar-sign"
              size={20}
              color={COLORS.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your Price"
              placeholderTextColor={COLORS.placeholderText}
              value={newProduct.price}
              onChangeText={(price) =>
                setNewProduct({ ...newProduct, price: price })
              }
              keyboardType="decimal-pad"
              inputMode="decimal"
            />
          </View>
        </View>
        {/* end */}
        {/* Category field */}
        <View style={styles.formGroup}>
          <Picker
            selectedValue={newProduct.category}
            onValueChange={(category) =>
              setNewProduct({ ...newProduct, category })
            }
            style={[styles.inputContainer, { padding: 21, fontSize: 15 }]}
            dropdownIconColor={COLORS.primary}
          >
            <Picker.Item label="Select Category" value="" enabled={false} />
            {CATEGORIES.map((cat) => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
        </View>
        {/* end */}
        {/* upload image field */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Select Image</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {newProduct.image ? (
              <Image
                source={{ uri: newProduct.image.uri }}
                style={styles.previewImage}
              />
            ) : (
              <View style={styles.placeholderContainer}>
                <Ionicons
                  name="image-outline"
                  size={40}
                  color={COLORS.textSecondary}
                />
                <Text style={styles.placeholderText}>Tap to select image</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        {/* end */}
        {/* submit button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Ionicons
                name="cloud-upload-outline"
                size={20}
                color={COLORS.white}
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Create</Text>
            </>
          )}
        </TouchableOpacity>
        {/* end */}
      </View>
    </ScrollView>
  );
}
