import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../utils/theme';

interface StatusBadgeProps {
  status: 'pending' | 'taken' | 'missed';
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getColor = () => {
    switch (status) {
      case 'pending':
        return theme.colors.pending;
      case 'taken':
        return theme.colors.success;
      case 'missed':
        return theme.colors.danger;
      default:
        return theme.colors.border;
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'taken':
        return 'Tomado';
      case 'missed':
        return 'No tomado';
      default:
        return '';
    }
  };

  const sizeStyles = {
    sm: {
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      fontSize: theme.fontSize.xs,
    },
    md: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      fontSize: theme.fontSize.sm,
    },
    lg: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      fontSize: theme.fontSize.base,
    },
  };

  const styles = StyleSheet.create({
    badge: {
      backgroundColor: getColor(),
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      ...sizeStyles[size],
    },
    text: {
      color: theme.colors.white,
      fontWeight: theme.fontWeight.semibold,
    },
  });

  return (
    <View style={styles.badge}>
      <Text style={[styles.text, { fontSize: sizeStyles[size].fontSize }]}>
        {getLabel()}
      </Text>
    </View>
  );
};
