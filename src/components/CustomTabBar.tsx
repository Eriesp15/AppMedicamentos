import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { theme } from '../utils/theme';

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export const CustomTabBar: React.FC<TabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const getTabIcon = (routeName: string, focused: boolean) => {
    const iconColor = focused ? theme.colors.primary : theme.colors.textLight;
    const size = 24;

    switch (routeName) {
      case 'Inicio':
        return <Text style={{ fontSize: size, color: iconColor }}>🏠</Text>;
      case 'Medicamentos':
        return <Text style={{ fontSize: size, color: iconColor }}>💊</Text>;
      case 'Horarios':
        return <Text style={{ fontSize: size, color: iconColor }}>📅</Text>;
      case 'Perfil':
        return <Text style={{ fontSize: size, color: iconColor }}>👤</Text>;
      default:
        return null;
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.white,
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    tab: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      borderTopWidth: 3,
      borderTopColor: 'transparent',
    },
    tabActive: {
      borderTopColor: theme.colors.primary,
    },
    tabLabel: {
      fontSize: theme.fontSize.xs,
      marginTop: theme.spacing.xs,
      fontWeight: theme.fontWeight.semibold,
    },
    tabLabelActive: {
      color: theme.colors.primary,
    },
    tabLabelInactive: {
      color: theme.colors.textLight,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            preventDefault: false,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={[styles.tab, isFocused && styles.tabActive]}
          >
            {getTabIcon(route.name, isFocused)}
            <Text
              style={[
                styles.tabLabel,
                isFocused
                  ? styles.tabLabelActive
                  : styles.tabLabelInactive,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </SafeAreaView>
  );
};
