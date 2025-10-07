// app/index.tsx
import { colorPalette } from "@/constants/color-pallette";
import { Product } from "@/models/product.model";
import { productService } from "@/services/product.service";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Filter products based on search query
    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  useEffect(() => {
    getAllProducts();
  }, []);

  const getAllProducts = async () => {
    try {
      if (error) {
        setError(null);
      }
      setLoading(true);
      const response = await productService.getAllProducts();
      setProducts(response);
    } catch (error) {
      Alert.alert(error instanceof Error ? error.message : "An error occurred");
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await productService.getAllProducts();
      setProducts(response);
      // Clear any existing errors on successful refresh
      setError(null);
    } catch (error) {
      Alert.alert(error instanceof Error ? error.message : "An error occurred");
      setError("Failed to refresh products");
    } finally {
      setRefreshing(false);
    }
  };

  const navigateToProduct = (product: Product) => {
    router.push({
      pathname: "/product/[id]",
      params: {
        id: product.id.toString(),
        product: JSON.stringify(product),
      },
    });
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigateToProduct(item)}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>⭐ {item.rating.rate}</Text>
          <Text style={styles.ratingCount}>({item.rating.count})</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No products found</Text>
      <Text style={styles.emptyStateText}>
        {searchQuery
          ? `No results for "${searchQuery}"`
          : "No products available"}
      </Text>
      {searchQuery ? (
        <TouchableOpacity
          style={styles.clearSearchButton}
          onPress={clearSearch}
        >
          <Text style={styles.clearSearchButtonText}>Clear Search</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.retryButton} onPress={getAllProducts}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colorPalette.foregroundDark} />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={getAllProducts}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor={colorPalette.foregroundLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search Results Info */}
        {searchQuery && (
          <View style={styles.searchInfoContainer}>
            <Text style={styles.searchInfoText}>
              {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""} found
              {searchQuery && ` for "${searchQuery}"`}
            </Text>
          </View>
        )}
      </View>

      {/* Products List with Refresh Control */}
      <FlatList
        data={searchQuery.trim() === "" ? products : filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          filteredProducts.length === 0 && styles.emptyListContent,
        ]}
        numColumns={2}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colorPalette.foregroundDark]}
            tintColor={colorPalette.foregroundDark}
            title="Pull to refresh"
            titleColor={colorPalette.foregroundDark}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorPalette.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colorPalette.background,
    padding: 20,
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
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colorPalette.textDark,
  },
  cartButton: {
    backgroundColor: colorPalette.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cartButtonText: {
    color: colorPalette.textDark,
    fontWeight: "600",
  },
  searchContainer: {
    padding: 16,
    backgroundColor: colorPalette.background,
    borderBottomWidth: 1,
    borderBottomColor: colorPalette.foregroundLight,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colorPalette.background,
    borderWidth: 2,
    borderColor: colorPalette.foregroundLight,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: colorPalette.textDark,
    paddingVertical: 12,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 16,
    color: colorPalette.foregroundLight,
    fontWeight: "bold",
  },
  searchInfoContainer: {
    marginTop: 8,
  },
  searchInfoText: {
    fontSize: 14,
    color: colorPalette.foregroundDark,
    fontStyle: "italic",
  },
  listContent: {
    padding: 8,
    flexGrow: 1,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: colorPalette.background,
    borderRadius: 12,
    padding: 12,
    shadowColor: colorPalette.secondary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productImage: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
    marginBottom: 8,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colorPalette.textDark,
    marginBottom: 4,
    flex: 1,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: colorPalette.textDark,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    color: colorPalette.foregroundDark,
    marginRight: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: colorPalette.foregroundLight,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colorPalette.textDark,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: colorPalette.foregroundLight,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  clearSearchButton: {
    backgroundColor: colorPalette.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  clearSearchButtonText: {
    color: colorPalette.textDark,
    fontWeight: "600",
    fontSize: 16,
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
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colorPalette.foregroundDark,
    textAlign: "center",
  },
});

export default HomeScreen;
