// components/CustomButton.tsx (Recommended Version)
import { colorPalette } from "@/constants/color-pallette";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

export type ButtonVariant = "primary" | "secondary" | "danger";
export type ButtonSize = "small" | "medium" | "large";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  testID,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[size],
        styles[`${variant}Button`],
        fullWidth && styles.fullWidth,
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === "secondary"
              ? colorPalette.primary
              : colorPalette.textDark
          }
        />
      ) : (
        <Text
          style={[
            styles.buttonText,
            styles[`${size}Text`],
            styles[`${variant}ButtonText`],
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidth: {
    width: "100%",
  },
  // Size variants
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  // Color variants
  primaryButton: {
    backgroundColor: colorPalette.primary,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colorPalette.primary,
  },
  dangerButton: {
    backgroundColor: colorPalette.danger,
  },
  disabledButton: {
    opacity: 0.6,
  },
  // Text styles
  buttonText: {
    fontWeight: "600",
    textAlign: "center",
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  primaryButtonText: {
    color: colorPalette.textDark,
  },
  secondaryButtonText: {
    color: colorPalette.textDark,
  },
  dangerButtonText: {
    color: colorPalette.textLight,
  },
});

export default CustomButton;
