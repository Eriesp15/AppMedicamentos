import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {SettingsHeaderButton} from '../components/SettingsHeaderButton';
import {useAppSettings} from '../context/AppSettingsContext';
import {TIPS} from '../constants/data';

type Props = {
  onOpenSettings: () => void;
};

export function TipsScreen({onOpenSettings}: Props) {
  const {styles: appStyles} = useAppSettings();
  return (
    <ScrollView contentContainerStyle={appStyles.scrollContent}>
      <View style={appStyles.headerRow}>
        <Text style={appStyles.appTitle}>Consejos de Salud</Text>
        <SettingsHeaderButton onPress={onOpenSettings} />
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
