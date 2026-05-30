import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {
  faCalendarAlt,
  faChartPie,
  faHome,
  faPlus,
  faTablets,
} from '@fortawesome/free-solid-svg-icons';
import {AppIcon} from './AppIcon';
import {TAB_ITEMS} from '../constants/data';
import {useAppSettings} from '../context/AppSettingsContext';
import {AppTab} from '../types/medication';

type Props = {
  activeTab: AppTab;
  onPress: (tab: AppTab) => void;
};

const TAB_ICONS = {
  home: faHome,
  medicines: faTablets,
  add: faPlus,
  schedules: faCalendarAlt,
  tracking: faChartPie,
};

export function BottomTabs({activeTab, onPress}: Props) {
  const {palette, styles: appStyles} = useAppSettings();
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
          <View
            style={[
              appStyles.tabIcon,
              tab.id === 'add' ? appStyles.tabIconAdd : null,
            ]}>
            <AppIcon
              icon={TAB_ICONS[tab.id]}
              color={
                tab.id === 'add'
                  ? '#FFFFFF'
                  : activeTab === tab.id
                    ? palette.primary
                    : palette.textSoft
              }
              size={tab.id === 'add' ? 18 : 17}
            />
          </View>
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
