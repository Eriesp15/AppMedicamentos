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

  const sortedMedicines = [...medicines].sort((a, b) =>
    a.startTime.localeCompare(b.startTime),
  );

  const handleCardPress = (item: Medicine) => {
    const status = todayStatusByMedication[item.id];
    let statusText = 'Pendiente';
    if (status === 'taken') statusText = 'Tomado';
    if (status === 'missed') statusText = 'Omitido';

    Alert.alert(
      item.name,
      `Dosis programada: ${item.startTime}\nEstado actual: ${statusText}\n${item.dosage} ${item.unit || ''}\n${item.foodInstruction || ''}`,
      [
        {
          text: 'Marcar como tomado',
          onPress: () => onMarkTaken(item),
        },
        {
          text: 'Marcar como omitido',
          onPress: () => onMarkMissed(item),
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

  const handleTakeDoseQuick = (item: Medicine) => {
    Alert.alert(
      'Registrar toma',
      `¿Confirmas que has tomado ${item.name} (${item.dosage} ${item.unit || ''})?`,
      [
        {
          text: 'Sí, tomar',
          onPress: () => onMarkTaken(item),
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

      {/* Proxima Toma Card */}
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

      {/* Missed Medicines Section */}
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

      {/* Section Title */}
      <View style={[appStyles.rowBetween, { marginBottom: 16, marginTop: 10 }]}>
        <Text style={appStyles.sectionTitle}>Medicamentos de hoy</Text>
        <View style={appStyles.countBadge}>
          <Text style={appStyles.countBadgeText}>{pendingTodayCount} pendientes</Text>
        </View>
      </View>

      {/* Timeline Flow */}
      {sortedMedicines.length === 0 ? (
        <View style={appStyles.emptyCard}>
          <Text style={appStyles.emptyTitle}>Sin medicamentos</Text>
          <Text style={appStyles.softText}>
            Registra tus medicamentos para ver tu cronograma de hoy aquí.
          </Text>
        </View>
      ) : (
        <View>
          {sortedMedicines.map((item, index) => {
            const status = todayStatusByMedication[item.id];
            const isNext = nextMedicine && nextMedicine.id === item.id;
            const { hour, ampm } = formatTime12h(item.startTime);
            const theme = getMedicineTheme(item.name, item.startTime, index);
            
            const instructionText = item.notes || item.foodInstruction || 'Sin restricciones';
            const instructionIcon = getInstructionIcon(instructionText);
            const isLast = index === sortedMedicines.length - 1;
            
            // Timeline line color below the item
            const lineColor = isNext ? palette.orange : palette.line;
            const cardBorderColor = isNext ? theme.color : palette.line;

            return (
              <View style={appStyles.timelineRow} key={item.id}>
                {/* Left Column: Time & Line */}
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
                  
                  {/* Vertical line segment */}
                  {isLast ? (
                    <View style={appStyles.timelineLineShortDashed} />
                  ) : (
                    <View style={[
                      appStyles.timelineLine,
                      { backgroundColor: lineColor }
                    ]} />
                  )}
                </View>

                {/* Right Column: Card */}
                <View style={appStyles.timelineRightColumn}>
                  <TouchableOpacity
                    style={[
                      appStyles.timelineCard,
                      isNext && appStyles.timelineCardActive,
                      { borderColor: cardBorderColor }
                    ]}
                    onPress={() => handleCardPress(item)}
                    activeOpacity={0.8}
                  >
                    {/* Watermark in background */}
                    <View style={appStyles.timelineWatermark}>
                      <AppIcon
                        icon={theme.watermarkIcon}
                        color={theme.watermarkColor}
                        size={80}
                      />
                    </View>

                    {/* Status badges */}
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

                    {/* Left Icon box */}
                    <View style={[
                      appStyles.timelineIconContainer,
                      { backgroundColor: theme.bg }
                    ]}>
                      <AppIcon
                        icon={item.medicineType === 'Inyeccion' ? faSyringe : faPills}
                        color={theme.color}
                        size={22}
                      />
                    </View>

                    {/* Middle details */}
                    <View style={[
                      appStyles.timelineContentContainer,
                      isNext && { paddingRight: 95 } // Prevents overlapping with the absolute corner "¡TOCA AHORA!" button
                    ]}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                        <Text style={[appStyles.timelineCardTitle, { flex: 1 }]} numberOfLines={1} ellipsizeMode="tail">
                          {item.name}
                        </Text>
                        
                        {/* Countdown Badge inside card */}
                        {isNext && (
                          <View style={[appStyles.pendingBadge, { backgroundColor: '#FFF3D8', flexShrink: 0, marginLeft: 8 }]}>
                            <AppIcon icon={faClock} color={palette.orange} size={9} />
                            <Text style={[appStyles.pendingBadgeText, { color: palette.orange }]}>
                              {formatTimeLeft(item.startTime)}
                            </Text>
                          </View>
                        )}
                      </View>

                      <Text style={[
                        appStyles.timelineCardSubtitle,
                        { color: theme.color }
                      ]} numberOfLines={1} ellipsizeMode="tail">
                        {item.dosage} {item.unit || ''} • {FREQUENCIES.find(f => f.id === item.frequency)?.label || 'Diario'}
                      </Text>

                      <View style={appStyles.timelineCardFooter}>
                        <AppIcon icon={instructionIcon} color={palette.textSoft} size={12} />
                        <Text style={appStyles.timelineCardFooterText} numberOfLines={1} ellipsizeMode="tail">
                          {instructionText}
                        </Text>
                      </View>
                    </View>

                    {/* Corner active button */}
                    {isNext && (
                      <TouchableOpacity
                        style={[
                          appStyles.timelineTocaAhoraButton,
                          { backgroundColor: palette.orange }
                        ]}
                        onPress={() => handleTakeDoseQuick(item)}
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
