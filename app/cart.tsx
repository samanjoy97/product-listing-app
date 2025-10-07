// app/cart.tsx
import CustomButton from "@/components/ui/custom-button";
import { colorPalette } from "@/constants/color-pallette";
import { MARGIN_PADDING } from "@/constants/sizes";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../context/CartContext";

const CartScreen = () => {
  const router = useRouter();
  const { cartItems, removeFromCart, getTotalPrice, updateQuantity } =
    useCart();

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: item.product.image }}
        style={styles.cartItemImage}
      />
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemTitle} numberOfLines={2}>
          {item.product.title}
        </Text>
        <Text style={styles.cartItemPrice}>
          ${item.product.price.toFixed(2)}
        </Text>

        {/* Quantity Controls */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() =>
              handleQuantityChange(item.product.id, item.quantity - 1)
            }
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.quantityText}>{item.quantity}</Text>

          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() =>
              handleQuantityChange(item.product.id, item.quantity + 1)
            }
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.itemTotal}>
          Total: ${(item.product.price * item.quantity).toFixed(2)}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromCart(item.product.id)}
      >
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>
            Add some products to get started!
          </Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => router.push("/")}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.product.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.footer}>
        <View style={styles.summaryContainer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalPrice}>${getTotalPrice().toFixed(2)}</Text>
          </View>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Shipping:</Text>
            <Text style={styles.totalPrice}>$5.99</Text>
          </View>
          <View style={styles.totalContainer}>
            <Text style={styles.finalTotalLabel}>Total:</Text>
            <Text style={styles.finalTotalPrice}>
              ${(getTotalPrice() + 5.99).toFixed(2)}
            </Text>
          </View>
        </View>

        <CustomButton
          title="Proceed to Checkout"
          onPress={() => router.push("/checkout")}
          variant="primary"
          size="large"
          fullWidth
          style={styles.checkoutButton}
        />

        <CustomButton
          title="Continue Shopping"
          onPress={() => {
            router.dismissAll();
            router.replace("/");
          }}
          variant="secondary"
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colorPalette.background,
    borderBottomWidth: 1,
    borderBottomColor: colorPalette.foregroundLight,
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
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colorPalette.textDark,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colorPalette.danger,
    borderRadius: 8,
  },
  clearButtonText: {
    color: colorPalette.textLight,
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    padding: 16,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: colorPalette.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: colorPalette.secondary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginRight: 12,
  },
  cartItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  cartItemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colorPalette.textDark,
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: colorPalette.primary,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    backgroundColor: colorPalette.primary,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colorPalette.textDark,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: colorPalette.textDark,
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: "center",
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: "600",
    color: colorPalette.foregroundDark,
  },
  removeButton: {
    width: 32,
    height: 32,
    backgroundColor: colorPalette.danger,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  removeButtonText: {
    color: colorPalette.textLight,
    fontSize: 14,
    fontWeight: "bold",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colorPalette.foregroundLight,
    backgroundColor: colorPalette.background,
  },
  summaryContainer: {
    marginBottom: 16,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: colorPalette.foregroundDark,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: colorPalette.textDark,
  },
  finalTotalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: colorPalette.textDark,
  },
  finalTotalPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: colorPalette.primary,
  },
  checkoutButton: {
    backgroundColor: colorPalette.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colorPalette.textDark,
  },
  continueShoppingButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: colorPalette.primary,
  },
  continueShoppingButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colorPalette.textDark,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colorPalette.textDark,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colorPalette.foregroundLight,
    textAlign: "center",
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: colorPalette.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colorPalette.textDark,
  },
});

export default CartScreen;
