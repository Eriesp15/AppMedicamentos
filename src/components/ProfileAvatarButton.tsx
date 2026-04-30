import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {appStyles} from '../styles/appStyles';

type Props = {
  fullName: string;
  onPress: () => void;
};

function getInitials(fullName: string) {
  const parts = fullName.trim().split(' ').filter(Boolean);
  if (parts.length === 0) {
    return 'U';
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 1).toUpperCase();
  }
  return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
}

export function ProfileAvatarButton({fullName, onPress}: Props) {
  return (
    <TouchableOpacity
      style={appStyles.profileAvatarButton}
      activeOpacity={0.8}
      onPress={onPress}>
      <Text style={appStyles.profileAvatarText}>{getInitials(fullName)}</Text>
    </TouchableOpacity>
  );
}
