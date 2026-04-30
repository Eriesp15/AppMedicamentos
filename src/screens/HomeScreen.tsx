import React from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {ProfileAvatarButton} from '../components/ProfileAvatarButton';
import {FREQUENCIES} from '../constants/data';
import {appStyles} from '../styles/appStyles';
import {Medicine} from '../types/medication';

type Props = {
  medicines: Medicine[];
  takenTodayCount: number;
  adherencePercent: number;
  onMarkTaken: (medicine: Medicine) => void;
  onMarkMissed: (medicine: Medicine) => void;
  onOpenNewForm: () => void;
  onOpenProfile: () => void;
  profileName: string;
};

export function HomeScreen({
  medicines,
  takenTodayCount,
  adherencePercent,
  onMarkTaken,
  onMarkMissed,
  onOpenNewForm,
  onOpenProfile,
  profileName,
}: Props) {
  return (
    <ScrollView contentContainerStyle={appStyles.scrollContent}>
      <View style={appStyles.headerRow}>
        <Text style={appStyles.appTitle}>MediCare</Text>
        <ProfileAvatarButton fullName={profileName} onPress={onOpenProfile} />
      </View>
      <View>
        <Text style={appStyles.softText}>Hola, Maria</Text>
      </View>

      <View style={appStyles.summaryCard}>
        <Text style={appStyles.summaryLabel}>RESUMEN DEL DIA</Text>
        <Text style={appStyles.summaryText}>
          Hoy tomaste {takenTodayCount} de {medicines.length} medicamentos
        </Text>
        <View style={appStyles.progressBar}>
          <View style={[appStyles.progressFill, {width: `${adherencePercent}%`}]} />
        </View>
        <Text style={appStyles.summaryPercent}>{adherencePercent}%</Text>
      </View>

      <Text style={appStyles.sectionTitle}>Medicamentos de hoy</Text>

      {medicines.length === 0 ? (
        <View style={appStyles.emptyCard}>
          <Text style={appStyles.emptyTitle}>Aun no tienes medicamentos</Text>
          <Text style={appStyles.softText}>Empieza registrando tu primer medicamento.</Text>
        </View>
      ) : (
        medicines.map(item => (
          <View key={item.id} style={appStyles.medicineCard}>
            <View style={appStyles.rowBetween}>
              <Text style={appStyles.medicineName}>{item.name}</Text>
              <Text style={appStyles.softText}>{item.startTime}</Text>
            </View>
            <Text style={appStyles.softText}>
              {item.dosage} - {FREQUENCIES.find(f => f.id === item.frequency)?.label}
            </Text>

            <View style={appStyles.actionRow}>
              <TouchableOpacity
                style={[appStyles.actionButton, appStyles.actionPrimary]}
                onPress={() => onMarkTaken(item)}>
                <Text style={appStyles.actionButtonText}>Marcar tomado</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[appStyles.actionButton, appStyles.actionDanger]}
                onPress={() => onMarkMissed(item)}>
                <Text style={appStyles.actionButtonText}>No tomada</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      <TouchableOpacity style={appStyles.bigButton} onPress={onOpenNewForm}>
        <Text style={appStyles.bigButtonText}>+ AGREGAR MEDICAMENTO</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
