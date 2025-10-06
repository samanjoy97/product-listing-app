// import { Image } from 'expo-image';
// import { Platform, StyleSheet } from 'react-native';

// import { HelloWave } from '@/components/hello-wave';
// import ParallaxScrollView from '@/components/parallax-scroll-view';
// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';
// import { Link } from 'expo-router';

// export default function HomeScreen() {
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
//       headerImage={
//         <Image
//           source={require('@/assets/images/partial-react-logo.png')}
//           style={styles.reactLogo}
//         />
//       }>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//         <HelloWave />
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 1: Try it</ThemedText>
//         <ThemedText>
//           Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
//           Press{' '}
//           <ThemedText type="defaultSemiBold">
//             {Platform.select({
//               ios: 'cmd + d',
//               android: 'cmd + m',
//               web: 'F12',
//             })}
//           </ThemedText>{' '}
//           to open developer tools.
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <Link href="/modal">
//           <Link.Trigger>
//             <ThemedText type="subtitle">Step 2: Explore</ThemedText>
//           </Link.Trigger>
//           <Link.Preview />
//           <Link.Menu>
//             <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
//             <Link.MenuAction
//               title="Share"
//               icon="square.and.arrow.up"
//               onPress={() => alert('Share pressed')}
//             />
//             <Link.Menu title="More" icon="ellipsis">
//               <Link.MenuAction
//                 title="Delete"
//                 icon="trash"
//                 destructive
//                 onPress={() => alert('Delete pressed')}
//               />
//             </Link.Menu>
//           </Link.Menu>
//         </Link>

//         <ThemedText>
//           {`Tap the Explore tab to learn more about what's included in this starter app.`}
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
//         <ThemedText>
//           {`When you're ready, run `}
//           <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
//           <ThemedText type="defaultSemiBold">app-example</ThemedText>.
//         </ThemedText>
//       </ThemedView>
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
// });

import PageLoader from "@/components/ui/page-loader";
import SearchBar from "@/components/ui/search-bar";
import { colorPalette } from "@/constants/color-pallette";
import { MARGIN_PADDING } from "@/constants/sizes";

import { ProductResponse } from "@/models/product-response.model";
import { productService } from "@/services/product.service";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const [products, setProducts] = useState<ProductResponse[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const getAllProducts = async () => {
    try {
      const response = await productService.getAllProducts();
      setProducts(response);
    } catch (error) {
      Alert.alert(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  console.log(products);

  return (
    <ScrollView
      style={{
        backgroundColor: colorPalette.background,
      }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <SearchBar placeholder="Search Products..." />

      {/* {!loading && products?.length > 0 && (
        <FeaturedProducts
          products={featureProducts}
          containerStyle={{
            paddingHorizontal: MARGIN_PADDING.default,
          }}
        />
      )} */}
    </ScrollView>
  );
}

const headerText: TextStyle = {
  fontWeight: "700" as const,
  fontSize: 16,
  marginBottom: 10,
};
const headerLayout: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 90,
    backgroundColor: colorPalette.background,
  },
  image: {
    width,
    aspectRatio: 1.5,
  },
  productContainer: {
    flex: 1,
    height: 764,
    backgroundColor: colorPalette.foregroundDark,
    paddingHorizontal: MARGIN_PADDING.lg,
    paddingVertical: MARGIN_PADDING.lg,
  },
  productHeader: {
    ...headerText,
    color: colorPalette.primary,
  },
  featuredProductContainer: {
    flex: 1,
    height: 764,
    backgroundColor: colorPalette.textLight,
    paddingHorizontal: 27,
    paddingVertical: 20,
  },
  featureProductHeader: {
    ...headerLayout,
  },
  featureProductHeaderText: {
    ...headerText,
    color: colorPalette.secondary,
  },
  viewAll: {
    fontWeight: 500,
    fontSize: 11,
    color: colorPalette.secondary,
    marginBottom: 10,
  },
  brandContainer: {
    height: 200,
    backgroundColor: colorPalette.secondary,
    paddingVertical: 20,
  },
  brandHeader: {
    ...headerLayout,
    marginBottom: 15,
    marginHorizontal: 27,
  },
  bestSellingProductContainer: {
    flex: 1,
    height: 764,
    backgroundColor: colorPalette.textLight,
    paddingHorizontal: 27,
    paddingVertical: 20,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  bestSellingProductHeader: {
    ...headerLayout,
  },
  bestSellingProductHeaderText: {
    ...headerText,
    color: colorPalette.secondary,
  },
});
