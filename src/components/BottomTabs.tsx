import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {TAB_ITEMS} from '../constants/data';
import {useAppSettings} from '../context/AppSettingsContext';
import {AppTab} from '../types/medication';

type Props = {
  activeTab: AppTab;
  onPress: (tab: AppTab) => void;
};

export function BottomTabs({activeTab, onPress}: Props) {
  const {styles: appStyles} = useAppSettings();
  return (
    <View style={appStyles.tabBar}>
      {TAB_ITEMS.map(tab => (
        <TouchableOpacity
          key={tab.id}
          style={[
            appStyles.tabButton,
            tab.id === 'add' ? appStyles.tabButtonAdd : null,
            activeTab === tab.id && appStyles.tabButtonActive,
          ]}
          onPress={() => onPress(tab.id)}>
          <Text
            style={[
              appStyles.tabIcon,
              tab.id === 'add' ? appStyles.tabIconAdd : null,
              activeTab === tab.id ? appStyles.tabIconActive : null,
            ]}>
            {tab.icon}
          </Text>
          <Text
            style={[
              appStyles.tabLabel,
              activeTab === tab.id ? appStyles.tabLabelActive : null,
            ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
