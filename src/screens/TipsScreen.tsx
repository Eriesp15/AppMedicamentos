import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {ProfileAvatarButton} from '../components/ProfileAvatarButton';
import {TIPS} from '../constants/data';
import {appStyles} from '../styles/appStyles';

type Props = {
  onOpenProfile: () => void;
  profileName: string;
};

export function TipsScreen({onOpenProfile, profileName}: Props) {
  return (
    <ScrollView contentContainerStyle={appStyles.scrollContent}>
      <View style={appStyles.headerRow}>
        <Text style={appStyles.appTitle}>Consejos de Salud</Text>
        <ProfileAvatarButton fullName={profileName} onPress={onOpenProfile} />
      </View>
      <Text style={appStyles.softText}>Informacion util para un uso responsable.</Text>
      {TIPS.map(tip => (
        <View key={tip.title} style={appStyles.tipCard}>
          <Text style={appStyles.medicineName}>{tip.title}</Text>
          <Text style={appStyles.softText}>{tip.description}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
