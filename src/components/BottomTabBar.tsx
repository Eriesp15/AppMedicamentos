import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../styles/colors';

interface BottomTabBarProps {
  activeTab: 'home' | 'medicines' | 'history' | 'tips';
  onTabPress: (tab: 'home' | 'medicines' | 'history' | 'tips') => void;
}

const TABS = [
  { id: 'home', label: 'Inicio', icon: '🏠' },
  { id: 'medicines', label: 'Medicinas', icon: '💊' },
  { id: 'history', label: 'Historial', icon: '📋' },
  { id: 'tips', label: 'Consejos', icon: '💬' },
];

export default function BottomTabBar({ activeTab, onTabPress }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tab,
            activeTab === tab.id && styles.tabActive,
          ]}
          onPress={() => onTabPress(tab.id as any)}
          activeOpacity={0.7}
        >
          <Text style={styles.icon}>{tab.icon}</Text>
          <Text
            style={[
              styles.label,
              activeTab === tab.id && styles.labelActive,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    paddingBottom: 0,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 3,
    borderTopColor: 'transparent',
  },
  tabActive: {
    borderTopColor: Colors.primary,
  },
  icon: {
    fontSize: 20,
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  labelActive: {
    color: Colors.primary,
  },
});
