// app/_layout.tsx
import HeaderCartButton from "@/components/HeaderCartButton";
import HeaderClearCartButton from "@/components/HeaderClearCartButton";
import { colorPalette } from "@/constants/color-pallette";
import { MARGIN_PADDING } from "@/constants/sizes";
import { CartProvider } from "@/context/CartContext";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import "react-native-reanimated";

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <CartProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerTitle: "Products",

              headerTitleStyle: styles.headerTitle,
              headerRight: () => <HeaderCartButton />,
            }}
          />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
          <Stack.Screen
            name="product/[id]"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="cart"
            options={{
              headerTitle: "Shopping Cart",
              headerTitleAlign: "center",
              headerTitleStyle: styles.headerTitle,
              headerRight: () => <HeaderClearCartButton />,
            }}
          />
          <Stack.Screen
            name="checkout"
            options={{
              headerTitle: "Checkout",
              headerTitleAlign: "center",
              headerTitleStyle: styles.headerTitle,
            }}
          />
        </Stack>
        <StatusBar style="dark" />
      </CartProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colorPalette.textDark,
    textAlign: "center",
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
});
