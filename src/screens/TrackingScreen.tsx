import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {SettingsHeaderButton} from '../components/SettingsHeaderButton';
import {useAppSettings} from '../context/AppSettingsContext';
import {ActivityItem, Medicine} from '../types/medication';

type Props = {
  medicines: Medicine[];
  activities: ActivityItem[];
  takenTodayCount: number;
  missedTodayCount: number;
  adherencePercent: number;
  onOpenSettings: () => void;
};

export function TrackingScreen({
  medicines,
  activities,
  takenTodayCount,
  missedTodayCount,
  adherencePercent,
  onOpenSettings,
}: Props) {
  const {styles: appStyles, palette} = useAppSettings();
  const streakDays = Math.max(0, activities.filter(item => item.taken).length);
  const weeklyBars = [100, 80, 100, adherencePercent, 60, 70, 40];
  const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  return (
    <ScrollView contentContainerStyle={appStyles.scrollContent}>
      <View style={appStyles.headerRow}>
        <View>
          <Text style={appStyles.appTitle}>Seguimiento</Text>
          <Text style={appStyles.softText}>Tu progreso de tratamiento</Text>
        </View>
        <SettingsHeaderButton onPress={onOpenSettings} />
      </View>

      <Text style={appStyles.sectionTitle}>Resumen de hoy</Text>
      <View style={appStyles.metricsRow}>
        <View style={[appStyles.metricCard, appStyles.metricCardTaken]}>
          <Text style={appStyles.metricTitle}>Tomados hoy</Text>
          <Text style={appStyles.metricValue}>
            {takenTodayCount}/{medicines.length || 0}
          </Text>
        </View>
        <View style={[appStyles.metricCard, appStyles.metricCardMissed]}>
          <Text style={appStyles.metricTitle}>Omitidos</Text>
          <Text style={appStyles.metricValue}>{missedTodayCount}</Text>
        </View>
        <View style={[appStyles.metricCard, appStyles.metricCardPending]}>
          <Text style={appStyles.metricTitle}>Cumplimiento</Text>
          <Text style={appStyles.metricValue}>{adherencePercent}%</Text>
        </View>
      </View>

      <Text style={appStyles.sectionTitle}>Progreso semanal</Text>
      <View style={appStyles.weeklyCard}>
        <View style={appStyles.rowBetween}>
          <Text style={appStyles.emptyTitle}>Esta semana</Text>
          <View style={appStyles.activeBadge}>
            <Text style={appStyles.activeBadgeText}>Semana: {adherencePercent}%</Text>
          </View>
        </View>
        <View style={appStyles.weeklyBars}>
          {weeklyBars.map((value, index) => (
            <View key={`${weekDays[index]}-${index}`} style={appStyles.weeklyBarItem}>
              <View style={appStyles.weeklyBarTrack}>
                <View
                  style={[
                    appStyles.weeklyBarFill,
                    {
                      height: `${Math.max(18, value)}%`,
                      backgroundColor:
                        index === 3 ? palette.orange : index > 3 ? '#B8A7FF' : palette.primary,
                    },
                  ]}
                />
              </View>
              <Text style={appStyles.weeklyDayText}>{weekDays[index]}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={appStyles.streakCard}>
        <Text style={appStyles.streakValue}>{streakDays} dias</Text>
        <Text style={appStyles.streakText}>
          Llevas una racha siguiendo tus medicamentos.
        </Text>
      </View>

      <Text style={appStyles.sectionTitle}>Historial reciente</Text>
      {activities.length === 0 ? (
        <View style={appStyles.emptyCard}>
          <Text style={appStyles.emptyTitle}>Aun no hay historial</Text>
        </View>
      ) : (
        activities.slice(0, 8).map(item => (
          <View key={item.id} style={appStyles.historyCard}>
            <View>
              <Text style={appStyles.medicineName}>{item.medicationName}</Text>
              <Text style={appStyles.softText}>
                {item.scheduledTime} - {item.dosage}
              </Text>
            </View>
            <View
              style={[
                appStyles.statusPill,
                {backgroundColor: item.taken ? palette.green : palette.red},
              ]}>
              <Text style={appStyles.statusPillText}>
                {item.taken ? 'Tomado' : 'Omitido'}
              </Text>
            </View>
          </View>
        ))
      )}

      <Text style={appStyles.sectionTitle}>Medicamentos en tratamiento</Text>
      {medicines.map(item => (
        <View key={item.id} style={appStyles.simpleMedicineRow}>
          <View>
            <Text style={appStyles.medicineName}>{item.name}</Text>
            <Text style={appStyles.softText}>Esta semana</Text>
          </View>
          <Text style={appStyles.medicineTimeText}>{adherencePercent}%</Text>
        </View>
      ))}
    </ScrollView>
  );
}
