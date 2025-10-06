import { colorPalette } from "@/constants/color-pallette";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const PageLoader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color={colorPalette.secondary}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    </View>
  );
};

export default PageLoader;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 60,
    backgroundColor: colorPalette.background,
  },
});
