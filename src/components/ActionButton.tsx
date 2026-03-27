import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { theme } from '../utils/theme';

interface ActionButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  fullWidth = false,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return theme.colors.border;
    switch (variant) {
      case 'primary':
        return theme.colors.primary;
      case 'secondary':
        return theme.colors.secondary;
      case 'success':
        return theme.colors.success;
      case 'danger':
        return theme.colors.danger;
      default:
        return theme.colors.primary;
    }
  };

  const sizeStyles = {
    sm: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      fontSize: theme.fontSize.sm,
    },
    md: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      fontSize: theme.fontSize.base,
    },
    lg: {
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.xl,
      fontSize: theme.fontSize.lg,
    },
  };

  const styles = StyleSheet.create({
    button: {
      backgroundColor: getBackgroundColor(),
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      ...sizeStyles[size],
      width: fullWidth ? '100%' : 'auto',
    },
    text: {
      color: theme.colors.white,
      fontWeight: theme.fontWeight.bold,
      fontSize: sizeStyles[size].fontSize as number,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.white} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
