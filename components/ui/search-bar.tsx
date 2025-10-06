import { colorPalette } from "@/constants/color-pallette";
import { MARGIN_PADDING } from "@/constants/sizes";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { productListingUrlGenerator } from "../screen-components/shop/product-listing/utils";

interface SearchBarProps extends TextInputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  containerStyle?: ViewStyle;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Search...",
  onClear,
  containerStyle,
  ...rest
}) => {
  const [searchValue, setSearchValue] = useState<string>("");

  const router = useRouter();
  const handleSearch = () => {
    if (!searchValue.trim()) {
      return;
    }
    const url = productListingUrlGenerator({
      search: searchValue,
    });
    router.navigate(url);
  };

  useEffect(() => {
    setSearchValue(value ?? "");
  }, [value]);

  return (
    <View style={[styles.searchFilterContainer, containerStyle]}>
      <View style={styles.searchContainer}>
        <View style={styles.container}>
          <Ionicons
            name="search"
            size={17}
            color="#C0C0C0"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            value={searchValue}
            onChangeText={(text) => {
              setSearchValue(text);
              onChangeText?.(text);
            }}
            placeholderTextColor="#C0C0C0"
            cursorColor={"#ffffff"}
            {...rest}
          />
          {searchValue.length > 0 && (
            <Pressable
              style={styles.rightContainer}
              onPress={() => {
                setSearchValue("");
                onChangeText?.("");
                onClear?.();
              }}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color="#C0C0C0"
                style={styles.icon}
              />
            </Pressable>
          )}
        </View>
        <Pressable onPress={handleSearch} style={[styles.button]}>
          <AntDesign name="search" size={16} color="#C0C0C0" />
          <Text style={{ color: "#C0C0C0", fontSize: 14 }}>Search</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchFilterContainer: {
    flexDirection: "row",
    backgroundColor: colorPalette.secondary,
    alignItems: "center",
    justifyContent: "space-between",
    padding: MARGIN_PADDING.lg,
    gap: MARGIN_PADDING.default,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
    width: "100%",
    gap: 8,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#404040",
    borderRadius: 8,
    flex: 1,
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    fontSize: 12,
    fontWeight: 400,
    color: "#ffffff",
    paddingHorizontal: 8,
    height: 40,
  },
  rightContainer: {
    marginRight: 8,
  },
  icon: {
    marginLeft: 4,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#404040",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    height: 40,
    gap: 4,
  },
});
