// app/product/[id].tsx
import CustomButton from "@/components/ui/custom-button";
import { colorPalette } from "@/constants/color-pallette";
import { MARGIN_PADDING } from "@/constants/sizes";
import { useCart } from "@/context/CartContext";
import { Product } from "@/models/product.model";
import { AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProductDetailScreen = () => {
  const { id, product: productString } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  // Parse the product data from navigation params
  const product: Product | null = productString
    ? JSON.parse(productString as string)
    : null;

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      Alert.alert("Item added to cart");
    }
  };

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Product not found</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button */}
      <View style={[styles.headerContainer]}>
        <SafeAreaView style={styles.headerContent} edges={["top"]}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <AntDesign name="left" size={24} color={colorPalette.textDark} />
            <Text>Back</Text>
          </Pressable>
        </SafeAreaView>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.priceRatingContainer}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>⭐ {product.rating.rate}</Text>
              <Text style={styles.ratingCount}>
                ({product.rating.count} reviews)
              </Text>
            </View>
          </View>

          <View style={styles.categoryContainer}>
            <Text style={styles.categoryLabel}>Category:</Text>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>Description:</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <CustomButton
          title="Add to Cart"
          onPress={handleAddToCart}
          variant="primary"
          size="large"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorPalette.background,
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 1000,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: MARGIN_PADDING.sm,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colorPalette.background,
  },
  scrollView: {
    // flex: 1,
    flexGrow: 1,
    backgroundColor: colorPalette.background,
    paddingBottom: 50,
  },
  imageContainer: {
    backgroundColor: colorPalette.background,
    padding: 20,
    alignItems: "center",
  },
  productImage: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  detailsContainer: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colorPalette.textDark,
    marginBottom: 16,
    lineHeight: 24,
  },
  priceRatingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: colorPalette.textDark,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 16,
    color: colorPalette.foregroundDark,
    marginRight: 4,
  },
  ratingCount: {
    fontSize: 14,
    color: colorPalette.foregroundLight,
  },
  categoryContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colorPalette.textDark,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 16,
    color: colorPalette.foregroundDark,
    textTransform: "capitalize",
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colorPalette.textDark,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: colorPalette.foregroundDark,
    lineHeight: 22,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colorPalette.foregroundLight,
    backgroundColor: colorPalette.background,
  },
  addToCartButton: {
    backgroundColor: colorPalette.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  addToCartButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colorPalette.textDark,
  },
  errorText: {
    fontSize: 16,
    color: colorPalette.danger,
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: colorPalette.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colorPalette.textDark,
    fontWeight: "600",
  },
});

export default ProductDetailScreen;
