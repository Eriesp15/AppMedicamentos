import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {faCog} from '@fortawesome/free-solid-svg-icons';
import {AppIcon} from './AppIcon';
import {useAppSettings} from '../context/AppSettingsContext';

type Props = {
  title: string;
  subtitle?: string;
  profileName: string;
  photo?: string;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
};

export function ScreenHeader({
  title,
  subtitle,
  profileName,
  photo,
  onOpenProfile,
  onOpenSettings,
}: Props) {
  const {styles: appStyles, palette} = useAppSettings();
  const initials = (profileName || 'M').trim().charAt(0).toUpperCase();

  return (
    <>
      <View style={appStyles.headerRow}>
        <TouchableOpacity
          style={appStyles.avatarButton}
          activeOpacity={0.75}
          onPress={onOpenProfile}
          accessibilityRole="button"
          accessibilityLabel="Abrir perfil">
          {photo ? (
            <Image
              source={{uri: photo}}
              style={{width: 44, height: 44, borderRadius: 22}}
            />
          ) : (
            <Text style={appStyles.avatarText}>{initials}</Text>
          )}
          <View style={appStyles.onlineDot} />
        </TouchableOpacity>
        <TouchableOpacity
          style={appStyles.settingsHeaderButton}
          activeOpacity={0.75}
          onPress={onOpenSettings}
          accessibilityRole="button"
          accessibilityLabel="Abrir ajustes">
          <AppIcon icon={faCog} color={palette.primaryDark} size={18} />
        </TouchableOpacity>
      </View>
      <Text style={appStyles.appTitle}>{title}</Text>
      {subtitle ? (
        <Text style={appStyles.softText}>{subtitle}</Text>
      ) : null}
    </>
  );
}
