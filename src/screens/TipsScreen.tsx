import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {TIPS} from '../constants/data';
import {appStyles} from '../styles/appStyles';

export function TipsScreen() {
  return (
    <ScrollView contentContainerStyle={appStyles.scrollContent}>
      <Text style={appStyles.appTitle}>Consejos de Salud</Text>
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
