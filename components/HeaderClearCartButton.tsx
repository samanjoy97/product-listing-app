// components/HeaderClearCartButton.tsx
import { colorPalette } from "@/constants/color-pallette";
import { useCart } from "@/context/CartContext";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const HeaderClearCartButton: React.FC = () => {
  const { cartItems, clearCart } = useCart();

  // Only show the button when there are items in the cart
  if (cartItems.length === 0) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.clearButton} onPress={clearCart}>
      <Text style={styles.clearButtonText}>Clear All</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
});

export default HeaderClearCartButton;
