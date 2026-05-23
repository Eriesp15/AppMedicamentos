import React from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAppSettings} from '../context/AppSettingsContext';
import {AlarmSoundId} from '../types/settings';

type Props = {
  visible: boolean;
  onClose: () => void;
  onOpenProfile: () => void;
};

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const {styles} = useAppSettings();
  return (
    <TouchableOpacity
      style={[styles.settingsChip, selected && styles.settingsChipActive]}
      onPress={onPress}
      activeOpacity={0.85}>
      <Text
        style={[
          styles.settingsChipText,
          selected && styles.settingsChipTextActive,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function FontSizeOption({
  label,
  hint,
  preview,
  selected,
  onPress,
}: {
  label: string;
  hint: string;
  preview: 'small' | 'medium' | 'large';
  selected: boolean;
  onPress: () => void;
}) {
  const {styles} = useAppSettings();
  const previewStyle =
    preview === 'small'
      ? styles.fontPreviewSmall
      : preview === 'medium'
        ? styles.fontPreviewMedium
        : styles.fontPreviewLarge;

  return (
    <TouchableOpacity
      style={[styles.visualOptionCard, selected && styles.visualOptionCardActive]}
      onPress={onPress}
      activeOpacity={0.85}>
      <Text style={previewStyle}>Aa</Text>
      <Text style={styles.visualOptionTitle}>{label}</Text>
      <Text style={styles.visualOptionHint}>{hint}</Text>
    </TouchableOpacity>
  );
}

function ThemeOption({
  label,
  colors,
  selected,
  onPress,
}: {
  label: string;
  colors: string[];
  selected: boolean;
  onPress: () => void;
}) {
  const {styles} = useAppSettings();

  return (
    <TouchableOpacity
      style={[styles.visualOptionCard, selected && styles.visualOptionCardActive]}
      onPress={onPress}
      activeOpacity={0.85}>
      <View style={styles.themePreview}>
        {colors.map(color => (
          <View
            key={color}
            style={[styles.themePreviewBand, {backgroundColor: color}]}
          />
        ))}
      </View>
      <Text style={styles.visualOptionTitle}>{label}</Text>
    </TouchableOpacity>
  );
}

function SoundOption({
  label,
  icon,
  selected,
  onSelect,
  onPreview,
}: {
  label: string;
  icon: string;
  selected: boolean;
  onSelect: () => void;
  onPreview: () => void;
}) {
  const {styles} = useAppSettings();

  return (
    <TouchableOpacity
      style={[styles.visualOptionCard, selected && styles.visualOptionCardActive]}
      onPress={onSelect}
      activeOpacity={0.85}>
      <Text style={styles.soundPreviewIcon}>{icon}</Text>
      <Text style={styles.visualOptionTitle}>{label}</Text>
      <TouchableOpacity style={styles.soundPreviewButton} onPress={onPreview}>
        <Text style={styles.soundPreviewButtonText}>PROBAR</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export function SettingsScreen({visible, onClose, onOpenProfile}: Props) {
  const {settings, updateSettings, styles} = useAppSettings();
  const previewSound = (sound: AlarmSoundId) => {
    const patterns: Record<AlarmSoundId, number[]> = {
      gentle: [0, 120, 80, 120],
      default: [0, 220, 100, 220],
      classic: [0, 140, 70, 140, 70, 320],
    };
    Vibration.vibrate(patterns[sound]);
    Alert.alert(
      'Vista previa',
      'La app reproduce una vibracion de muestra. Para sonido real se debe agregar una libreria/audio nativo.',
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={[styles.scrollContent, {paddingBottom: 32}]}>
          <View style={styles.settingsCloseBar}>
            <Text style={styles.settingsTitleMain}>Ajustes</Text>
            <TouchableOpacity onPress={onClose} accessibilityRole="button">
              <Text style={styles.settingsCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.softText}>
            Ajusta la app a tu vista y a tus recordatorios. Los cambios se guardan solos.
          </Text>

          <TouchableOpacity
            style={[styles.bigButton, {marginTop: 16}]}
            onPress={() => {
              onClose();
              onOpenProfile();
            }}>
            <Text style={styles.bigButtonText}>IR A MI PERFIL</Text>
          </TouchableOpacity>

          <Text style={styles.settingsSectionTitle}>LECTURA Y PANTALLA</Text>
          <View style={styles.settingsRow}>
            <Text style={styles.settingsRowLabel}>Tamaño de letra</Text>
            <Text style={styles.settingsRowHint}>
              Texto mas grande ayuda a leer sin esfuerzo.
            </Text>
            <View style={styles.settingsOptionGrid}>
              <FontSizeOption
                label="Normal"
                hint="Lectura base"
                preview="small"
                selected={settings.fontSize === 'normal'}
                onPress={() => updateSettings({fontSize: 'normal'})}
              />
              <FontSizeOption
                label="Grande"
                hint="Mas legible"
                preview="medium"
                selected={settings.fontSize === 'large'}
                onPress={() => updateSettings({fontSize: 'large'})}
              />
              <FontSizeOption
                label="Muy grande"
                hint="Maxima lectura"
                preview="large"
                selected={settings.fontSize === 'xlarge'}
                onPress={() => updateSettings({fontSize: 'xlarge'})}
              />
            </View>
          </View>

          <View style={styles.settingsRow}>
            <Text style={styles.settingsRowLabel}>Tema de la app</Text>
            <Text style={styles.settingsRowHint}>
              Alto contraste facilita ver botones y textos.
            </Text>
            <View style={styles.settingsOptionGrid}>
              <ThemeOption
                label="Claro"
                colors={['#F7FAFF', '#FFFFFF', '#2855D9']}
                selected={settings.theme === 'light'}
                onPress={() => updateSettings({theme: 'light'})}
              />
              <ThemeOption
                label="Oscuro"
                colors={['#0F1219', '#1A2030', '#6B8CFF']}
                selected={settings.theme === 'dark'}
                onPress={() => updateSettings({theme: 'dark'})}
              />
              <ThemeOption
                label="Alto contraste"
                colors={['#000000', '#FFFFFF', '#FFFF00']}
                selected={settings.theme === 'highContrast'}
                onPress={() => updateSettings({theme: 'highContrast'})}
              />
            </View>
          </View>

          <View style={styles.settingsRow}>
            <Text style={styles.settingsRowLabel}>Botones mas grandes</Text>
            <Text style={styles.settingsRowHint}>
              Area de toque mas amplia para pulsar con mas seguridad.
            </Text>
            <View style={styles.settingsToggleRow}>
              <Text style={styles.softText}>Activado</Text>
              <Switch
                value={settings.largeTouchTargets}
                onValueChange={v => updateSettings({largeTouchTargets: v})}
                accessibilityLabel="Botones mas grandes"
              />
            </View>
          </View>

          <View style={styles.settingsRow}>
            <Text style={styles.settingsRowLabel}>Bordes mas visibles</Text>
            <Text style={styles.settingsRowHint}>
              Tarjetas y campos se marcan mas fuerte para no perderlos de vista.
            </Text>
            <View style={styles.settingsToggleRow}>
              <Text style={styles.softText}>Activado</Text>
              <Switch
                value={settings.highVisibilityBorders}
                onValueChange={v => updateSettings({highVisibilityBorders: v})}
                accessibilityLabel="Bordes mas visibles"
              />
            </View>
          </View>

          <Text style={styles.settingsSectionTitle}>ALARMAS Y RECORDATORIOS</Text>
          <View style={styles.settingsRow}>
            <Text style={styles.settingsRowLabel}>Volumen del sonido (alarma)</Text>
            <Text style={styles.settingsRowHint}>
              Se aplicara cuando actives las notificaciones del telefono.
            </Text>
            <View style={styles.settingsChipRow}>
              <Chip
                label="Bajo"
                selected={settings.alarmVolume === 'low'}
                onPress={() => updateSettings({alarmVolume: 'low'})}
              />
              <Chip
                label="Medio"
                selected={settings.alarmVolume === 'medium'}
                onPress={() => updateSettings({alarmVolume: 'medium'})}
              />
              <Chip
                label="Alto"
                selected={settings.alarmVolume === 'high'}
                onPress={() => updateSettings({alarmVolume: 'high'})}
              />
            </View>
          </View>

          <View style={styles.settingsRow}>
            <Text style={styles.settingsRowLabel}>Tipo de sonido</Text>
            <Text style={styles.settingsRowHint}>
              Elige un tono que reconozcas facilmente.
            </Text>
            <View style={styles.settingsOptionGrid}>
              <SoundOption
                label="Suave"
                icon="♪"
                selected={settings.alarmSound === 'gentle'}
                onSelect={() => updateSettings({alarmSound: 'gentle'})}
                onPreview={() => previewSound('gentle')}
              />
              <SoundOption
                label="Normal"
                icon="♫"
                selected={settings.alarmSound === 'default'}
                onSelect={() => updateSettings({alarmSound: 'default'})}
                onPreview={() => previewSound('default')}
              />
              <SoundOption
                label="Clasico"
                icon="♬"
                selected={settings.alarmSound === 'classic'}
                onSelect={() => updateSettings({alarmSound: 'classic'})}
                onPreview={() => previewSound('classic')}
              />
            </View>
          </View>

          <View style={styles.settingsRow}>
            <Text style={styles.settingsRowLabel}>Vibracion al recordar</Text>
            <View style={styles.settingsToggleRow}>
              <Text style={styles.softText}>Aviso con vibracion</Text>
              <Switch
                value={settings.vibrationOnReminder}
                onValueChange={v => updateSettings({vibrationOnReminder: v})}
                accessibilityLabel="Vibracion en recordatorios"
              />
            </View>
          </View>

          <View style={styles.settingsRow}>
            <Text style={styles.settingsRowLabel}>Aviso antes de la hora</Text>
            <Text style={styles.settingsRowHint}>
              Te avisamos unos minutos antes para prepararte la toma.
            </Text>
            <View style={styles.settingsChipRow}>
              <Chip
                label="En la hora"
                selected={settings.reminderMinutesBefore === 0}
                onPress={() => updateSettings({reminderMinutesBefore: 0})}
              />
              <Chip
                label="5 min"
                selected={settings.reminderMinutesBefore === 5}
                onPress={() => updateSettings({reminderMinutesBefore: 5})}
              />
              <Chip
                label="10 min"
                selected={settings.reminderMinutesBefore === 10}
                onPress={() => updateSettings({reminderMinutesBefore: 10})}
              />
              <Chip
                label="15 min"
                selected={settings.reminderMinutesBefore === 15}
                onPress={() => updateSettings({reminderMinutesBefore: 15})}
              />
            </View>
          </View>

          <View style={styles.settingsRow}>
            <Text style={styles.settingsRowLabel}>Mantener pantalla encendida</Text>
            <Text style={styles.settingsRowHint}>
              Util al esperar la alarma (consume mas bateria).
            </Text>
            <View style={styles.settingsToggleRow}>
              <Text style={styles.softText}>Activado</Text>
              <Switch
                value={settings.keepScreenAwakeOnReminders}
                onValueChange={v =>
                  updateSettings({keepScreenAwakeOnReminders: v})
                }
                accessibilityLabel="Mantener pantalla encendida"
              />
            </View>
          </View>

          <Text style={styles.settingsSectionTitle}>ACCESIBILIDAD EXTRA</Text>
          <View style={styles.settingsRow}>
            <Text style={styles.settingsRowLabel}>Animaciones reducidas</Text>
            <Text style={styles.settingsRowHint}>
              Menos movimiento en pantalla para mareos o sensibilidad visual.
            </Text>
            <View style={styles.settingsToggleRow}>
              <Text style={styles.softText}>Activado</Text>
              <Switch
                value={settings.reduceAnimations}
                onValueChange={v => updateSettings({reduceAnimations: v})}
                accessibilityLabel="Animaciones reducidas"
              />
            </View>
          </View>

          <View style={styles.settingsRow}>
            <Text style={styles.settingsRowLabel}>Confirmaciones en voz alta</Text>
            <Text style={styles.settingsRowHint}>
              Preparado para cuando integremos lectura en voz al marcar tomas.
            </Text>
            <View style={styles.settingsToggleRow}>
              <Text style={styles.softText}>Activado</Text>
              <Switch
                value={settings.readAloudConfirmations}
                onValueChange={v => updateSettings({readAloudConfirmations: v})}
                accessibilityLabel="Confirmaciones en voz alta"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
