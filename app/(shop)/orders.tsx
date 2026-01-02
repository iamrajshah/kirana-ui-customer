import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useOrders } from '@/hooks/useOrders';
import { OrderStatusBadge } from '@/components/OrderStatusBadge';
import { EmptyState } from '@/components/EmptyState';
import { colors } from '@/constants/colors';
import { spacing, fontSize, borderRadius, fontWeight } from '@/constants/spacing';
import { formatPriceCompact } from '@/utils/money';
import { formatDateTime } from '@/utils/format';
import type { Order } from '@/types/order';

export default function OrdersScreen() {
  const router = useRouter();
  const { data: ordersData, isLoading, refetch } = useOrders();

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const orders = ordersData?.data?.orders || [];

  if (orders.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          emoji="📦"
          title="No orders yet"
          description="Your orders will appear here"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.orderCard}
            onPress={() => router.push(`/(shop)/order-detail?id=${item.id}`)}
          >
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderId}>Order #{item.id}</Text>
                <Text style={styles.orderDate}>{formatDateTime(item.created_at)}</Text>
              </View>
              <OrderStatusBadge status={item.status} />
            </View>

            <View style={styles.orderItems}>
              <Text style={styles.itemsLabel}>
                {item.items.length} item{item.items.length > 1 ? 's' : ''}
              </Text>
              {item.items.slice(0, 2).map((orderItem, index) => (
                <Text key={index} style={styles.itemText} numberOfLines={1}>
                  • {orderItem.product_name}
                  {orderItem.variant_name && ` (${orderItem.variant_name})`}
                </Text>
              ))}
              {item.items.length > 2 && (
                <Text style={styles.moreItems}>
                  +{item.items.length - 2} more item{item.items.length - 2 > 1 ? 's' : ''}
                </Text>
              )}
            </View>

            <View style={styles.orderFooter}>
              <Text style={styles.totalAmount}>
                {formatPriceCompact(item.total_amount)}
              </Text>
              <Text style={styles.viewDetails}>View Details →</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        onRefresh={refetch}
        refreshing={isLoading}
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
  list: {
    padding: spacing.md,
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  orderId: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  orderDate: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  orderItems: {
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.divider,
  },
  itemsLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  itemText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  moreItems: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalAmount: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  viewDetails: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
});
