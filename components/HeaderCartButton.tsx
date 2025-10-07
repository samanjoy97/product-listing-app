// components/HeaderCartButton.tsx
import { colorPalette } from "@/constants/color-pallette";
import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const HeaderCartButton: React.FC = () => {
  const router = useRouter();
  const { getTotalItems } = useCart();

  return (
    <TouchableOpacity
      style={styles.cartButton}
      onPress={() => router.push("/cart")}
    >
      <Text style={styles.cartButtonText}>Cart ({getTotalItems()})</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cartButton: {
    backgroundColor: colorPalette.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cartButtonText: {
    color: colorPalette.textDark,
    fontWeight: "600",
    fontSize: 14,
  },
});

export default HeaderCartButton;
