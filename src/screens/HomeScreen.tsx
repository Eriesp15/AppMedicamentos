import React from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {
  faBell,
  faCheckCircle,
  faClock,
  faExclamationTriangle,
  faPills,
  faStopwatch,
  faSyringe,
  faUtensils,
} from '@fortawesome/free-solid-svg-icons';
import {AppIcon} from '../components/AppIcon';
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
  const {palette, styles: appStyles} = useAppSettings();
  const missedMedicines = medicines.filter(
    item => todayStatusByMedication[item.id] === 'missed',
  );
  const pendingMedicines = medicines.filter(item => !todayStatusByMedication[item.id]);
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const nextMedicine = pendingMedicines.length === 0
    ? undefined
    : pendingMedicines
        .map(m => {
          const [h, min] = m.startTime.split(':').map(Number);
          const medicineMinutes = h * 60 + min;
          let diff = medicineMinutes - currentMinutes;
          if (diff < 0) diff += 1440;
          return {m, diff};
        })
        .sort((a, b) => a.diff - b.diff)[0].m;
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
          <Text style={appStyles.greetingTitle}>
            Buenos dias,{'\n'}
            {profileName || 'Maria'}!
          </Text>
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
            <AppIcon icon={faPills} color={palette.primary} size={28} />
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
                <AppIcon icon={faClock} color={palette.textSoft} size={15} />
                <Text style={appStyles.doseTime}>{nextMedicine.startTime}</Text>
              </View>
              <View style={appStyles.doseInfoBox}>
                <AppIcon icon={faUtensils} color={palette.textSoft} size={13} />
                <Text style={appStyles.doseMeta}>
                  {nextMedicine.foodInstruction || 'Con alimentos'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={appStyles.takeButton}
              onPress={() => onMarkTaken(nextMedicine)}>
              <View style={appStyles.iconTextRow}>
                <AppIcon icon={faCheckCircle} color="#FFFFFF" size={16} />
                <Text style={appStyles.actionButtonText}>Marcar como tomado</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={appStyles.postponeButton}
              onPress={() => onMarkMissed(nextMedicine)}>
              <View style={appStyles.iconTextRow}>
                <AppIcon icon={faStopwatch} color={palette.red} size={15} />
                <Text style={appStyles.postponeButtonText}>Posponer 15 min</Text>
              </View>
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
                <View style={appStyles.missedTitleRow}>
                  <View style={appStyles.missedIconCircle}>
                    <AppIcon icon={faSyringe} color={palette.red} size={17} />
                  </View>
                  <Text style={appStyles.medicineName}>{item.name}</Text>
                </View>
                <View style={appStyles.missedBadge}>
                  <AppIcon icon={faExclamationTriangle} color="#FFFFFF" size={10} />
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
              <AppIcon
                icon={item.medicineType === 'Inyeccion' ? faSyringe : faPills}
                color={item.name.toLowerCase().includes('vitamina') ? palette.yellow : palette.primary}
                size={20}
              />
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
                <AppIcon icon={faBell} color={palette.yellow} size={9} />
                <Text style={appStyles.pendingBadgeText}>Pendiente</Text>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}
