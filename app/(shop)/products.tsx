import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { useAddToCart } from '@/hooks/useCart';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState } from '@/components/EmptyState';
import { colors } from '@/constants/colors';
import { spacing, fontSize, borderRadius } from '@/constants/spacing';
import type { ProductVariant } from '@/types/product';

export default function ProductsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  const { data: categoriesData } = useCategories();
  const { data: productsData, isLoading, refetch } = useProducts({
    category_id: selectedCategory,
    search: searchQuery,
  });

  const addToCartMutation = useAddToCart();

  const handleAddToCart = (variant: ProductVariant, productName: string) => {
    addToCartMutation.mutate(
      {
        variant_id: variant.id,
        quantity: 1,
      },
      {
        onSuccess: () => {
          Alert.alert('Success', `${productName} added to cart`);
        },
        onError: (error: any) => {
          Alert.alert('Error', error.response?.data?.message || 'Failed to add to cart');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const products = productsData?.data?.products || [];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {categoriesData?.data && categoriesData.data.length > 0 && (
        <View style={styles.categoriesContainer}>
          <FlatList
            horizontal
            data={[{ id: 'all', name: 'All' }, ...categoriesData.data]}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  selectedCategory === (item.id === 'all' ? undefined : item.id) &&
                    styles.categoryChipActive,
                ]}
                onPress={() =>
                  setSelectedCategory(item.id === 'all' ? undefined : item.id)
                }
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === (item.id === 'all' ? undefined : item.id) &&
                      styles.categoryChipTextActive,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>
      )}

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => {}}
            onAddToCart={(variant) => handleAddToCart(variant, item.name)}
          />
        )}
        contentContainerStyle={styles.productsList}
        onRefresh={refetch}
        refreshing={isLoading}
        ListEmptyComponent={
          <EmptyState
            emoji="🔍"
            title="No products found"
            description="Try adjusting your search or filters"
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchInput: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoriesContainer: {
    marginBottom: spacing.sm,
  },
  categoriesList: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
  categoryChipTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  productsList: {
    padding: spacing.md,
  },
});
