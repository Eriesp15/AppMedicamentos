import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {useAppSettings} from '../context/AppSettingsContext';

type Props = {
  onPress: () => void;
  accessibilityLabel?: string;
};

export function SettingsHeaderButton({
  onPress,
  accessibilityLabel = 'Abrir ajustes',
}: Props) {
  const {styles} = useAppSettings();
  return (
    <TouchableOpacity
      style={styles.settingsHeaderButton}
      activeOpacity={0.75}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}>
      <Text style={styles.settingsHeaderIcon} accessibilityElementsHidden>
        ⚙
      </Text>
    </TouchableOpacity>
  );
}
