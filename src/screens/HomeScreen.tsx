import React from 'react';
import {ScrollView, Text, TouchableOpacity, View, Alert} from 'react-native';
import {
  faBell,
  faCheckCircle,
  faClock,
  faExclamationTriangle,
  faPills,
  faStopwatch,
  faSyringe,
  faUtensils,
  faHeart,
  faTint,
  faBed,
  faClipboardList,
  faMoon,
  faSun,
} from '@fortawesome/free-solid-svg-icons';
import {AppIcon} from '../components/AppIcon';
import {ScreenHeader} from '../components/ScreenHeader';
import {useAppSettings} from '../context/AppSettingsContext';
import {FREQUENCIES} from '../constants/data';
import {DoseEvent, Medicine} from '../types/medication';

type Props = {
  todayDoses: DoseEvent[];
  takenTodayCount: number;
  adherencePercent: number;
  missedTodayCount: number;
  pendingTodayCount: number;
  todayStatusByDose: Record<string, 'taken' | 'missed'>;
  onMarkTaken: (medicine: Medicine, scheduledTime: string) => void;
  onMarkMissed: (medicine: Medicine, scheduledTime: string) => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  profileName: string;
  photo: string;
};

// Helper to convert HH:MM 24h to 12h format
function formatTime12h(time24: string) {
  const [hStr, mStr] = time24.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  const formattedH = String(displayH).padStart(2, '0');
  const formattedM = String(m).padStart(2, '0');
  return {
    hour: `${formattedH}:${formattedM}`,
    ampm,
  };
}

// Helper to calculate time left
function formatTimeLeft(startTime24: string) {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [hStr, mStr] = startTime24.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const medicineMinutes = h * 60 + m;
  let diff = medicineMinutes - currentMinutes;
  
  if (diff < 0) {
    diff += 1440; // tomorrow
  }
  
  if (diff === 0) {
    return '¡Ahora!';
  }
  if (diff < 60) {
    return `En ${diff} min`;
  }
  const hours = Math.floor(diff / 60);
  const mins = diff % 60;
  if (mins === 0) {
    return `En ${hours}h`;
  }
  return `En ${hours}h ${mins}m`;
}

// Helper to get an icon based on the instruction text
function getInstructionIcon(text: string) {
  const clean = (text || '').toLowerCase();
  if (
    clean.includes('desayuno') ||
    clean.includes('almuerzo') ||
    clean.includes('cena') ||
    clean.includes('comida') ||
    clean.includes('alimento') ||
    clean.includes('comer')
  ) {
    return faUtensils;
  }
  if (
    clean.includes('cardiaco') ||
    clean.includes('cardíaco') ||
    clean.includes('corazon') ||
    clean.includes('corazón') ||
    clean.includes('pecho')
  ) {
    return faHeart;
  }
  if (
    clean.includes('presion') ||
    clean.includes('presión') ||
    clean.includes('arterial') ||
    clean.includes('sangre')
  ) {
    return faTint;
  }
  if (
    clean.includes('acostarse') ||
    clean.includes('dormir') ||
    clean.includes('noche') ||
    clean.includes('cama')
  ) {
    return faBed;
  }
  return faClipboardList;
}

// Helper to define theme color and watermark icon based on medicine name / index
function getMedicineTheme(name: string, startTime: string, index: number) {
  const cleanName = name.toLowerCase().trim();
  
  // Decide watermark based on time: night is moon, otherwise sun or pills
  const [hStr] = startTime.split(':');
  const h = parseInt(hStr, 10);
  const isNight = h >= 18 || h < 7;
  const watermarkIcon = isNight ? faMoon : faSun;

  if (
    cleanName.includes('omeprazol') ||
    cleanName.includes('vitamina') ||
    cleanName.includes('gotas')
  ) {
    return {
      color: '#17C878', // Green
      bg: '#E8FAF1',
      iconBg: '#E8FAF1',
      borderColor: '#DDF7EA',
      watermarkColor: '#17C878',
      watermarkIcon,
    };
  } else if (
    cleanName.includes('aspirina') ||
    cleanName.includes('ibuprofeno') ||
    cleanName.includes('dolor')
  ) {
    return {
      color: '#FF6B35', // Orange
      bg: '#FFF1EB',
      iconBg: '#FFF1EB',
      borderColor: '#FFEBE0',
      watermarkColor: '#FF6B35',
      watermarkIcon: isNight ? faMoon : faPills,
    };
  } else if (
    cleanName.includes('losartan') ||
    cleanName.includes('enalapril') ||
    cleanName.includes('presión') ||
    cleanName.includes('presion')
  ) {
    return {
      color: '#1479FF', // Blue
      bg: '#EBF4FF',
      iconBg: '#EBF4FF',
      borderColor: '#DEEDFF',
      watermarkColor: '#1479FF',
      watermarkIcon: isNight ? faMoon : faPills,
    };
  } else if (
    cleanName.includes('atorvastatina') ||
    cleanName.includes('simvastatina') ||
    cleanName.includes('lipidos') ||
    cleanName.includes('colesterol')
  ) {
    return {
      color: '#8A3FFC', // Purple
      bg: '#F4EDFF',
      iconBg: '#F4EDFF',
      borderColor: '#EFE5FF',
      watermarkColor: '#8A3FFC',
      watermarkIcon,
    };
  }
  
  // Default themes rotation
  const themes = [
    {
      color: '#17C878',
      bg: '#E8FAF1',
      iconBg: '#E8FAF1',
      borderColor: '#DDF7EA',
      watermarkColor: '#17C878',
      watermarkIcon,
    },
    {
      color: '#FF6B35',
      bg: '#FFF1EB',
      iconBg: '#FFF1EB',
      borderColor: '#FFEBE0',
      watermarkColor: '#FF6B35',
      watermarkIcon,
    },
    {
      color: '#1479FF',
      bg: '#EBF4FF',
      iconBg: '#EBF4FF',
      borderColor: '#DEEDFF',
      watermarkColor: '#1479FF',
      watermarkIcon,
    },
    {
      color: '#8A3FFC',
      bg: '#F4EDFF',
      iconBg: '#F4EDFF',
      borderColor: '#EFE5FF',
      watermarkColor: '#8A3FFC',
      watermarkIcon,
    },
  ];
  return themes[index % themes.length];
}

export function HomeScreen({
  todayDoses,
  takenTodayCount,
  adherencePercent,
  missedTodayCount,
  pendingTodayCount,
  todayStatusByDose,
  onMarkTaken,
  onMarkMissed,
  onOpenSettings,
  onOpenProfile,
  profileName,
  photo,
}: Props) {
  const {palette, styles: appStyles} = useAppSettings();
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const doseKeyOf = (medicineId: string, st: string) => `${medicineId}#${st}`;

  const getDoseDiff = (timeStr: string) => {
    const [h, min] = timeStr.split(':').map(Number);
    const medicineMinutes = h * 60 + min;
    let diff = medicineMinutes - currentMinutes;
    if (diff < 0) { diff += 1440; }
    return diff;
  };

  const sortedDoses = [...todayDoses].sort((a, b) => {
    return getDoseDiff(a.scheduledTime) - getDoseDiff(b.scheduledTime);
  });

  const missedDoses = todayDoses.filter(
    d => todayStatusByDose[doseKeyOf(d.medicine.id, d.scheduledTime)] === 'missed',
  );
  const pendingDoses = todayDoses.filter(
    d => !todayStatusByDose[doseKeyOf(d.medicine.id, d.scheduledTime)],
  );
  const nextDose = pendingDoses.length === 0
    ? undefined
    : pendingDoses
        .map(d => {
          const diff = getDoseDiff(d.scheduledTime);
          return {d, diff};
        })
        .sort((a, b) => a.diff - b.diff)[0].d;
  const todayLabel = new Intl.DateTimeFormat('es-BO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const handleCardPress = (medicine: Medicine, scheduledTime: string) => {
    const status = todayStatusByDose[doseKeyOf(medicine.id, scheduledTime)];
    let statusText = 'Pendiente';
    if (status === 'taken') statusText = 'Tomado';
    if (status === 'missed') statusText = 'Omitido';

    Alert.alert(
      medicine.name,
      `Dosis programada: ${scheduledTime}\nEstado actual: ${statusText}\n${medicine.dosage} ${medicine.unit || ''}\n${medicine.foodInstruction || ''}`,
      [
        {
          text: 'Marcar como tomado',
          onPress: () => onMarkTaken(medicine, scheduledTime),
        },
        {
          text: 'Marcar como omitido',
          onPress: () => onMarkMissed(medicine, scheduledTime),
          style: 'destructive',
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const handleTakeDoseQuick = (medicine: Medicine, scheduledTime: string) => {
    Alert.alert(
      'Registrar toma',
      `¿Confirmas que has tomado ${medicine.name} (${medicine.dosage} ${medicine.unit || ''})?`,
      [
        {
          text: 'Sí, tomar',
          onPress: () => onMarkTaken(medicine, scheduledTime),
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView contentContainerStyle={appStyles.scrollContent}>
      {/* Header Row */}
      <ScreenHeader
        title={todayLabel || 'Inicio'}
        subtitle={`Buenos dias, ${profileName || 'Maria'}!`}
        profileName={profileName}
        photo={photo}
        onOpenProfile={onOpenProfile}
        onOpenSettings={onOpenSettings}
      />

      {/* Proxima Toma Card */}
      <View style={appStyles.nextDoseCard}>
        <View style={appStyles.rowBetween}>
          <Text style={appStyles.sectionEyebrow}>Proxima toma</Text>
          <View style={appStyles.medicineIconBox}>
            <AppIcon icon={faPills} color={palette.primary} size={28} />
          </View>
        </View>
        {nextDose ? (
          <>
            <Text style={appStyles.heroMedicineName}>{nextDose.medicine.name}</Text>
            <Text style={appStyles.softText}>
              {nextDose.medicine.dosage} {nextDose.medicine.unit || ''} -{' '}
              {nextDose.medicine.medicineType || 'Medicamento'}
            </Text>
            <View style={appStyles.doseInfoRow}>
              <View style={appStyles.doseInfoBox}>
                <AppIcon icon={faClock} color={palette.textSoft} size={15} />
                <Text style={appStyles.doseTime}>{nextDose.scheduledTime}</Text>
              </View>
              <View style={appStyles.doseInfoBox}>
                <AppIcon icon={faUtensils} color={palette.textSoft} size={13} />
                <Text style={appStyles.doseMeta}>
                  {nextDose.medicine.foodInstruction || 'Con alimentos'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={appStyles.takeButton}
              onPress={() => onMarkTaken(nextDose.medicine, nextDose.scheduledTime)}>
              <View style={appStyles.iconTextRow}>
                <AppIcon icon={faCheckCircle} color="#FFFFFF" size={16} />
                <Text style={appStyles.actionButtonText}>Marcar como tomado</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={appStyles.postponeButton}
              onPress={() => onMarkMissed(nextDose.medicine, nextDose.scheduledTime)}>
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

      {/* Missed Medicines Section */}
      {missedDoses.length > 0 ? (
        <>
          <Text style={appStyles.warningTitle}>Atencion! No tomado</Text>
          {missedDoses.map((dose, idx) => {
            const dk = doseKeyOf(dose.medicine.id, dose.scheduledTime);
            return (
              <View key={dk} style={appStyles.missedCard}>
                <View style={appStyles.rowBetween}>
                  <View style={appStyles.missedTitleRow}>
                    <View style={appStyles.missedIconCircle}>
                      <AppIcon icon={faSyringe} color={palette.red} size={17} />
                    </View>
                    <Text style={appStyles.medicineName}>{dose.medicine.name}</Text>
                  </View>
                  <View style={appStyles.missedBadge}>
                    <AppIcon icon={faExclamationTriangle} color="#FFFFFF" size={10} />
                    <Text style={appStyles.missedBadgeText}>No tomado</Text>
                  </View>
                </View>
                <Text style={appStyles.softText}>
                  {dose.scheduledTime} - {dose.medicine.foodInstruction || 'Sin alimentos'}
                </Text>
              </View>
            );
          })}
        </>
      ) : (
        <View style={appStyles.miniSummaryRow}>
          <Text style={appStyles.softText}>Tomados: {takenTodayCount}</Text>
          <Text style={appStyles.softText}>Omitidos: {missedTodayCount}</Text>
          <Text style={appStyles.softText}>{adherencePercent}%</Text>
        </View>
      )}

      {/* Section Title */}
      <View style={[appStyles.rowBetween, { marginBottom: 16, marginTop: 10 }]}>
        <Text style={appStyles.sectionTitle}>Medicamentos de hoy</Text>
        <View style={appStyles.countBadge}>
          <Text style={appStyles.countBadgeText}>{pendingTodayCount} pendientes</Text>
        </View>
      </View>

      {/* Timeline Flow */}
      {sortedDoses.length === 0 ? (
        <View style={appStyles.emptyCard}>
          <Text style={appStyles.emptyTitle}>Sin medicamentos</Text>
          <Text style={appStyles.softText}>
            Registra tus medicamentos para ver tu cronograma de hoy aqui.
          </Text>
        </View>
      ) : (
        <View>
          {sortedDoses.map((dose, index) => {
            const m = dose.medicine;
            const dk = doseKeyOf(m.id, dose.scheduledTime);
            const status = todayStatusByDose[dk];
            const isNext = nextDose && nextDose.medicine.id === m.id && nextDose.scheduledTime === dose.scheduledTime;
            const { hour, ampm } = formatTime12h(dose.scheduledTime);
            const theme = getMedicineTheme(m.name, dose.scheduledTime, index);

            const instructionText = m.notes || m.foodInstruction || 'Sin restricciones';
            const instructionIcon = getInstructionIcon(instructionText);
            const isLast = index === sortedDoses.length - 1;

            const lineColor = isNext ? palette.orange : palette.line;
            const cardBorderColor = isNext ? theme.color : palette.line;

            return (
              <View style={appStyles.timelineRow} key={dk}>
                <View style={appStyles.timelineLeftColumn}>
                  <View style={appStyles.timelineTimeContainer}>
                    <Text style={[
                      appStyles.timelineTimeText,
                      isNext && appStyles.timelineTimeTextActive
                    ]}>
                      {hour}
                    </Text>
                    <Text style={[
                      appStyles.timelineAmpmText,
                      isNext && appStyles.timelineAmpmTextActive
                    ]}>
                      {ampm}
                    </Text>
                  </View>

                  {isLast ? (
                    <View style={appStyles.timelineLineShortDashed} />
                  ) : (
                    <View style={[
                      appStyles.timelineLine,
                      { backgroundColor: lineColor }
                    ]} />
                  )}
                </View>

                <View style={appStyles.timelineRightColumn}>
                  <TouchableOpacity
                    style={[
                      appStyles.timelineCard,
                      isNext && appStyles.timelineCardActive,
                      { borderColor: cardBorderColor }
                    ]}
                    onPress={() => handleCardPress(m, dose.scheduledTime)}
                    activeOpacity={0.8}
                  >
                    <View style={appStyles.timelineWatermark}>
                      <AppIcon
                        icon={theme.watermarkIcon}
                        color={theme.watermarkColor}
                        size={80}
                      />
                    </View>

                    {status === 'taken' && (
                      <View style={appStyles.timelineStatusBadgeTaken}>
                        <AppIcon icon={faCheckCircle} color={palette.green} size={20} />
                      </View>
                    )}
                    {status === 'missed' && (
                      <View style={appStyles.timelineStatusBadgeMissed}>
                        <AppIcon icon={faExclamationTriangle} color={palette.red} size={20} />
                      </View>
                    )}

                    <View style={[
                      appStyles.timelineIconContainer,
                      { backgroundColor: theme.bg }
                    ]}>
                      <AppIcon
                        icon={m.medicineType === 'Inyeccion' ? faSyringe : faPills}
                        color={theme.color}
                        size={22}
                      />
                    </View>

                    <View style={[
                      appStyles.timelineContentContainer,
                      isNext && { paddingRight: 95 }
                    ]}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                        <Text style={[appStyles.timelineCardTitle, { flex: 1 }]} numberOfLines={1} ellipsizeMode="tail">
                          {m.name}
                        </Text>

                        {isNext && (
                          <View style={[appStyles.pendingBadge, { backgroundColor: '#FFF3D8', flexShrink: 0, marginLeft: 8 }]}>
                            <AppIcon icon={faClock} color={palette.orange} size={9} />
                            <Text style={[appStyles.pendingBadgeText, { color: palette.orange }]}>
                              {formatTimeLeft(dose.scheduledTime)}
                            </Text>
                          </View>
                        )}
                      </View>

                      <Text style={[
                        appStyles.timelineCardSubtitle,
                        { color: theme.color }
                      ]} numberOfLines={1} ellipsizeMode="tail">
                        {m.dosage} {m.unit || ''} • {FREQUENCIES.find(f => f.hours === m.frequency)?.label || 'Diario'}
                      </Text>

                      <View style={appStyles.timelineCardFooter}>
                        <AppIcon icon={instructionIcon} color={palette.textSoft} size={12} />
                        <Text style={appStyles.timelineCardFooterText} numberOfLines={1} ellipsizeMode="tail">
                          {instructionText}
                        </Text>
                      </View>
                    </View>

                    {isNext && (
                      <TouchableOpacity
                        style={[
                          appStyles.timelineTocaAhoraButton,
                          { backgroundColor: palette.orange }
                        ]}
                        onPress={() => handleTakeDoseQuick(m, dose.scheduledTime)}
                        activeOpacity={0.7}
                      >
                        <Text style={appStyles.timelineTocaAhoraText}>¡Toca Ahora!</Text>
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}
