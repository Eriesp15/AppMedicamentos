import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {ScreenHeader} from '../components/ScreenHeader';
import {useAppSettings} from '../context/AppSettingsContext';
import {TIPS} from '../constants/data';

type Props = {
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  profileName: string;
  photo: string;
};

export function TipsScreen({onOpenSettings, onOpenProfile, profileName, photo}: Props) {
  const {styles: appStyles} = useAppSettings();
  return (
    <ScrollView contentContainerStyle={appStyles.scrollContent}>
      <ScreenHeader
        title="Consejos de Salud"
        subtitle="Informacion util para un uso responsable."
        profileName={profileName}
        photo={photo}
        onOpenProfile={onOpenProfile}
        onOpenSettings={onOpenSettings}
      />
      {TIPS.map(tip => (
        <View key={tip.title} style={appStyles.tipCard}>
          <Text style={appStyles.medicineName}>{tip.title}</Text>
          <Text style={appStyles.softText}>{tip.description}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
