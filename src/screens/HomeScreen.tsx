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
  missedTodayCount: number;
  pendingTodayCount: number;
  todayStatusByMedication: Record<string, 'taken' | 'missed'>;
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
  missedTodayCount,
  pendingTodayCount,
  todayStatusByMedication,
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
        <Text style={appStyles.softText}>Hola, {profileName || 'Maria'} 👋</Text>
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

      <View style={appStyles.metricsRow}>
        <View style={[appStyles.metricCard, appStyles.metricCardTaken]}>
          <Text style={appStyles.metricTitle}>Tomados</Text>
          <Text style={appStyles.metricValue}>{takenTodayCount}</Text>
        </View>
        <View style={[appStyles.metricCard, appStyles.metricCardMissed]}>
          <Text style={appStyles.metricTitle}>No tomados</Text>
          <Text style={appStyles.metricValue}>{missedTodayCount}</Text>
        </View>
        <View style={[appStyles.metricCard, appStyles.metricCardPending]}>
          <Text style={appStyles.metricTitle}>Pendientes</Text>
          <Text style={appStyles.metricValue}>{pendingTodayCount}</Text>
        </View>
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
              <Text style={appStyles.medicineName}>💊 {item.name}</Text>
              <Text style={appStyles.softText}>🕒 {item.startTime}</Text>
            </View>
            <Text style={appStyles.softText}>
              {item.dosage} - {FREQUENCIES.find(f => f.id === item.frequency)?.label}
            </Text>
            {todayStatusByMedication[item.id] ? (
              <View style={appStyles.loggedTodayTag}>
                <Text style={appStyles.loggedTodayTagText}>
                  {todayStatusByMedication[item.id] === 'taken'
                    ? '✓ Ya marcado como tomado'
                    : '⚠ Marcado como no tomado'}
                </Text>
              </View>
            ) : null}

            <View style={appStyles.actionRow}>
              <TouchableOpacity
                style={[appStyles.actionButton, appStyles.actionPrimary]}
                onPress={() => onMarkTaken(item)}>
                <Text style={appStyles.actionButtonText}>✓ Marcar tomado</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[appStyles.actionButton, appStyles.actionDanger]}
                onPress={() => onMarkMissed(item)}>
                <Text style={appStyles.actionButtonText}>⚠ No tomada</Text>
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
