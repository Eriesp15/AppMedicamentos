import React from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useAppSettings} from '../context/AppSettingsContext';
import {FREQUENCIES} from '../constants/data';
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
  onOpenSettings: () => void;
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
  onOpenSettings,
  profileName,
}: Props) {
  const {styles: appStyles} = useAppSettings();
  const nextMedicine = medicines.find(item => !todayStatusByMedication[item.id]);
  const missedMedicines = medicines.filter(
    item => todayStatusByMedication[item.id] === 'missed',
  );
  const pendingMedicines = medicines.filter(item => !todayStatusByMedication[item.id]);
  const todayLabel = new Intl.DateTimeFormat('es-BO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <ScrollView contentContainerStyle={appStyles.scrollContent}>
      <View style={appStyles.headerRow}>
        <View>
          <Text style={appStyles.softText}>{todayLabel}</Text>
          <Text style={appStyles.appTitle}>Buenos dias, {profileName || 'Maria'}!</Text>
        </View>
        <TouchableOpacity style={appStyles.avatarButton} onPress={onOpenSettings}>
          <Text style={appStyles.avatarText}>
            {(profileName || 'M').trim().charAt(0).toUpperCase()}
          </Text>
          <View style={appStyles.onlineDot} />
        </TouchableOpacity>
      </View>

      <View style={appStyles.nextDoseCard}>
        <View style={appStyles.rowBetween}>
          <Text style={appStyles.sectionEyebrow}>Proxima toma</Text>
          <View style={appStyles.medicineIconBox}>
            <Text style={appStyles.medicineIconText}>●●</Text>
          </View>
        </View>
        {nextMedicine ? (
          <>
            <Text style={appStyles.heroMedicineName}>{nextMedicine.name}</Text>
            <Text style={appStyles.softText}>
              {nextMedicine.dosage} {nextMedicine.unit || ''} -{' '}
              {nextMedicine.medicineType || 'Medicamento'}
            </Text>
            <View style={appStyles.doseInfoRow}>
              <View style={appStyles.doseInfoBox}>
                <Text style={appStyles.doseTime}>{nextMedicine.startTime}</Text>
              </View>
              <View style={appStyles.doseInfoBox}>
                <Text style={appStyles.doseMeta}>
                  {nextMedicine.foodInstruction || 'Con alimentos'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={appStyles.takeButton}
              onPress={() => onMarkTaken(nextMedicine)}>
              <Text style={appStyles.actionButtonText}>✓ Marcar como tomado</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={appStyles.postponeButton}
              onPress={() => onMarkMissed(nextMedicine)}>
              <Text style={appStyles.postponeButtonText}>Posponer 15 min</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={appStyles.emptyTitle}>
            Todas las tomas de hoy estan registradas.
          </Text>
        )}
      </View>

      {missedMedicines.length > 0 ? (
        <>
          <Text style={appStyles.warningTitle}>Atencion! No tomado</Text>
          {missedMedicines.map(item => (
            <View key={item.id} style={appStyles.missedCard}>
              <View style={appStyles.rowBetween}>
                <Text style={appStyles.medicineName}>{item.name}</Text>
                <View style={appStyles.missedBadge}>
                  <Text style={appStyles.missedBadgeText}>No tomado</Text>
                </View>
              </View>
              <Text style={appStyles.softText}>
                {item.startTime} - {item.foodInstruction || 'Sin alimentos'}
              </Text>
            </View>
          ))}
        </>
      ) : (
        <View style={appStyles.miniSummaryRow}>
          <Text style={appStyles.softText}>Tomados: {takenTodayCount}</Text>
          <Text style={appStyles.softText}>Omitidos: {missedTodayCount}</Text>
          <Text style={appStyles.softText}>{adherencePercent}%</Text>
        </View>
      )}

      <View style={appStyles.rowBetween}>
        <Text style={appStyles.sectionTitle}>Medicamentos de hoy</Text>
        <View style={appStyles.countBadge}>
          <Text style={appStyles.countBadgeText}>{pendingTodayCount} pendientes</Text>
        </View>
      </View>

      {pendingMedicines.length === 0 ? (
        <View style={appStyles.emptyCard}>
          <Text style={appStyles.emptyTitle}>Sin pendientes por ahora</Text>
          <Text style={appStyles.softText}>
            Los medicamentos que quedan por tomar apareceran aqui.
          </Text>
        </View>
      ) : (
        pendingMedicines.map(item => (
          <View key={item.id} style={appStyles.simpleMedicineRow}>
            <View style={appStyles.medicineIconBoxSmall}>
              <Text style={appStyles.medicineIconSmallText}>●●</Text>
            </View>
            <View style={appStyles.medicineHeaderInfo}>
              <Text style={appStyles.medicineName}>{item.name}</Text>
              <Text style={appStyles.softText}>
                {item.dosage} {item.unit || ''} -{' '}
                {FREQUENCIES.find(f => f.id === item.frequency)?.label}
              </Text>
            </View>
            <View style={appStyles.homeTimeColumn}>
              <Text style={appStyles.medicineTimeText}>{item.startTime}</Text>
              <View style={appStyles.pendingBadge}>
                <Text style={appStyles.pendingBadgeText}>Pendiente</Text>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}
