import React from 'react';
import {TouchableOpacity} from 'react-native';
import {faCog} from '@fortawesome/free-solid-svg-icons';
import {AppIcon} from './AppIcon';
import {useAppSettings} from '../context/AppSettingsContext';

type Props = {
  onPress: () => void;
  accessibilityLabel?: string;
};

export function SettingsHeaderButton({
  onPress,
  accessibilityLabel = 'Abrir ajustes',
}: Props) {
  const {palette, styles} = useAppSettings();
  return (
    <TouchableOpacity
      style={styles.settingsHeaderButton}
      activeOpacity={0.75}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}>
      <AppIcon icon={faCog} color={palette.primaryDark} size={18} />
    </TouchableOpacity>
  );
}
