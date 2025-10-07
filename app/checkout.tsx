// app/checkout.tsx
import CustomButton from "@/components/ui/custom-button";
import { colorPalette } from "@/constants/color-pallette";
import { MARGIN_PADDING } from "@/constants/sizes";
import { CheckoutFormData } from "@/models/product.model";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../context/CartContext";

const CheckoutScreen = () => {
  const router = useRouter();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof CheckoutFormData)[] = [
      "fullName",
      "email",
      "address",
      "city",
      "zipCode",
      "cardNumber",
      "expiryDate",
      "cvv",
    ];

    for (const field of requiredFields) {
      if (!formData[field].trim()) {
        Alert.alert(
          "Error",
          `Please fill in the ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`
        );
        return false;
      }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleCheckout = async () => {
    if (!validateForm()) return;

    setLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert(
        "Order Successful!",
        "Your order has been placed successfully. Thank you for your purchase!",
        [
          {
            text: "OK",
            onPress: () => {
              clearCart();
              router.replace("/");
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to process your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getTotalPrice();
  const shipping = 5.99;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.scrollView}>
        {/* Shipping Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Information</Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={colorPalette.foregroundLight}
            value={formData.fullName}
            onChangeText={(value) => handleInputChange("fullName", value)}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colorPalette.foregroundLight}
            value={formData.email}
            onChangeText={(value) => handleInputChange("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Address"
            placeholderTextColor={colorPalette.foregroundLight}
            value={formData.address}
            onChangeText={(value) => handleInputChange("address", value)}
          />

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="City"
              placeholderTextColor={colorPalette.foregroundLight}
              value={formData.city}
              onChangeText={(value) => handleInputChange("city", value)}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="ZIP Code"
              placeholderTextColor={colorPalette.foregroundLight}
              value={formData.zipCode}
              onChangeText={(value) => handleInputChange("zipCode", value)}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Payment Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Information</Text>

          <TextInput
            style={styles.input}
            placeholder="Card Number"
            placeholderTextColor={colorPalette.foregroundLight}
            value={formData.cardNumber}
            onChangeText={(value) => handleInputChange("cardNumber", value)}
            keyboardType="numeric"
            maxLength={16}
          />

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="MM/YY"
              placeholderTextColor={colorPalette.foregroundLight}
              value={formData.expiryDate}
              onChangeText={(value) => handleInputChange("expiryDate", value)}
              maxLength={5}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="CVV"
              placeholderTextColor={colorPalette.foregroundLight}
              value={formData.cvv}
              onChangeText={(value) => handleInputChange("cvv", value)}
              keyboardType="numeric"
              maxLength={3}
              secureTextEntry
            />
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          {cartItems.map((item) => (
            <View key={item.product.id} style={styles.orderItem}>
              <Text style={styles.orderItemName} numberOfLines={1}>
                {item.product.title}
              </Text>
              <Text style={styles.orderItemQuantity}>x{item.quantity}</Text>
              <Text style={styles.orderItemPrice}>
                ${(item.product.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping:</Text>
            <Text style={styles.summaryValue}>${shipping.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax:</Text>
            <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.finalSummaryRow]}>
            <Text style={styles.finalTotalLabel}>Total:</Text>
            <Text style={styles.finalTotalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.footer}>
        <CustomButton
          title={`Place Order - $${total.toFixed(2)}`}
          onPress={handleCheckout}
          variant="primary"
          size="large"
          fullWidth
          loading={loading}
          disabled={cartItems.length === 0}
          style={styles.checkoutButton}
        />

        <CustomButton
          title="Back to Cart"
          onPress={() => router.back()}
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
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
  backBtn: {
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
    textAlign: "center",
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colorPalette.foregroundLight,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colorPalette.textDark,
    marginBottom: 16,
  },
  input: {
    backgroundColor: colorPalette.background,
    borderWidth: 1,
    borderColor: colorPalette.foregroundLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colorPalette.textDark,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderItemName: {
    flex: 1,
    fontSize: 14,
    color: colorPalette.textDark,
    marginRight: 8,
  },
  orderItemQuantity: {
    fontSize: 14,
    color: colorPalette.foregroundLight,
    marginRight: 12,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: colorPalette.textDark,
  },
  divider: {
    height: 1,
    backgroundColor: colorPalette.foregroundLight,
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  finalSummaryRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colorPalette.foregroundLight,
  },
  summaryLabel: {
    fontSize: 14,
    color: colorPalette.foregroundDark,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colorPalette.textDark,
  },
  finalTotalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: colorPalette.textDark,
  },
  finalTotalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: colorPalette.primary,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colorPalette.foregroundLight,
    backgroundColor: colorPalette.background,
  },
  checkoutButton: {
    backgroundColor: colorPalette.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  checkoutButtonDisabled: {
    opacity: 0.6,
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colorPalette.textDark,
  },
  backButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: colorPalette.primary,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colorPalette.textDark,
  },
});

export default CheckoutScreen;
