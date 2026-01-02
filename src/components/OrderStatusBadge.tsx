import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import type { OrderStatus } from '@/types/order';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; emoji: string }> = {
  PLACED: { label: 'Placed', color: colors.orderPlaced, emoji: '📝' },
  CONFIRMED: { label: 'Confirmed', color: colors.orderConfirmed, emoji: '✅' },
  READY: { label: 'Ready', color: colors.orderReady, emoji: '📦' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', color: colors.orderDelivering, emoji: '🚚' },
  DELIVERED: { label: 'Delivered', color: colors.orderDelivered, emoji: '✓' },
  CANCELLED: { label: 'Cancelled', color: colors.orderCancelled, emoji: '✗' },
};

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PLACED;

  return (
    <View style={[styles.badge, { backgroundColor: config.color }]}>
      <Text style={styles.emoji}>{config.emoji}</Text>
      <Text style={styles.label}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    gap: spacing.xs,
  },
  emoji: {
    fontSize: 16,
  },
  label: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
