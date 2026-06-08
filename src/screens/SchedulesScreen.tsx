import React from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import {
  faBell,
  faPen,
  faTrash,
  faVolumeHigh,
} from '@fortawesome/free-solid-svg-icons';
import { AppIcon } from '../components/AppIcon';
import { SettingsHeaderButton } from '../components/SettingsHeaderButton';
import {
  ALARM_SOUND_OPTIONS,
  FREQUENCIES,
  SNOOZE_OPTIONS,
} from '../constants/data';
import { useAppSettings } from '../context/AppSettingsContext';
import { AlarmSoundId, Medicine, SnoozeMinutes } from '../types/medication';
import { ReminderAdvanceMinutes } from '../types/settings';

type Props = {
  medicines: Medicine[];
  onOpenSettings: () => void;
  onOpenEditForm: (medicine: Medicine) => void;
  onDeleteMedicine: (medicineId: string) => void;
  onUpdateMedicineAlarm: (
    medicineId: string,
    partial: Partial<{
      alarmEnabled: boolean;
      alarmSound: AlarmSoundId;
      snoozeMinutes: SnoozeMinutes;
    }>,
  ) => void;
};

const DAYS = Array.from({ length: 30 }, (_, index) => index + 1);
const REMINDER_OPTIONS: ReminderAdvanceMinutes[] = [0, 5, 10, 15];

export function SchedulesScreen({
  medicines,
  onOpenSettings,
  onOpenEditForm,
  onDeleteMedicine,
  onUpdateMedicineAlarm,
}: Props) {
  const {
    palette,
    settings,
    styles: appStyles,
    updateSettings,
  } = useAppSettings();

  return (
    <ScrollView contentContainerStyle={appStyles.scrollContent}>
      <View style={appStyles.headerRow}>
        <View>
          <Text style={appStyles.appTitle}>Horarios</Text>
          <Text style={appStyles.softText}>Organiza tus tomas del dia</Text>
        </View>
        <SettingsHeaderButton onPress={onOpenSettings} />
      </View>

      <View style={appStyles.calendarCard}>
        <View style={appStyles.rowBetween}>
          <Text style={appStyles.emptyTitle}>Junio 2025</Text>
          <View style={appStyles.navRoundButton}>
            <Text style={appStyles.navRoundButtonText}>{'>'}</Text>
          </View>
        </View>
        <View style={appStyles.calendarGrid}>
          {DAYS.map(day => (
            <View
              key={day}
              style={[
                appStyles.calendarDay,
                day === 9 ? appStyles.calendarDayActive : null,
                day === 12 || day === 18 ? appStyles.calendarDayDose : null,
              ]}
            >
              <Text
                style={[
                  appStyles.calendarDayText,
                  day === 9 ? appStyles.calendarDayTextActive : null,
                ]}
              >
                {day}
              </Text>
            </View>
          ))}
        </View>
        <View style={appStyles.calendarLegendRow}>
          <Text style={appStyles.calendarLegendDose}>
            ● Dias con medicamentos
          </Text>
          <Text style={appStyles.calendarLegendToday}>● Hoy</Text>
        </View>
      </View>

      <Text style={appStyles.sectionTitle}>Tomas del dia</Text>
      {medicines.length === 0 ? (
        <View style={appStyles.emptyCard}>
          <Text style={appStyles.emptyTitle}>Sin medicamentos programados</Text>
        </View>
      ) : (
        medicines.map(item => {
          const soundLabel =
            ALARM_SOUND_OPTIONS.find(sound => sound.id === item.alarmSound)
              ?.label || 'Normal';

          return (
            <View key={item.id} style={appStyles.alarmCard}>
              <View style={appStyles.scheduleRow}>
                <View style={appStyles.scheduleTimePill}>
                  <Text style={appStyles.scheduleTimeText}>
                    {item.startTime}
                  </Text>
                </View>
                <View style={appStyles.scheduleInfo}>
                  <View style={appStyles.rowBetween}>
                    <View style={appStyles.medicineHeaderInfo}>
                      <Text style={appStyles.medicineName}>{item.name}</Text>
                      <Text style={appStyles.softText}>
                        {item.medicineType || 'Medicamento'} -{' '}
                        {FREQUENCIES.find(f => f.id === item.frequency)?.label}
                      </Text>
                    </View>
                    <Switch
                      value={item.alarmEnabled}
                      onValueChange={value =>
                        onUpdateMedicineAlarm(item.id, { alarmEnabled: value })
                      }
                    />
                  </View>
                  <View style={appStyles.inlineIconText}>
                    <AppIcon icon={faBell} color={palette.yellow} size={12} />
                    <Text style={appStyles.softText}>
                      {item.alarmEnabled ? 'Alarma activa' : 'Alarma apagada'}
                    </Text>
                  </View>
                  <View style={appStyles.inlineIconText}>
                    <AppIcon
                      icon={faVolumeHigh}
                      color={palette.primary}
                      size={12}
                    />
                    <Text style={appStyles.softText}>
                      {soundLabel} - posponer {item.snoozeMinutes || 10} min
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={appStyles.settingsRowLabel}>Tono</Text>
              <View style={appStyles.settingsChipRow}>
                {ALARM_SOUND_OPTIONS.map(sound => (
                  <TouchableOpacity
                    key={sound.id}
                    style={[
                      appStyles.settingsChip,
                      item.alarmSound === sound.id
                        ? appStyles.settingsChipActive
                        : null,
                    ]}
                    onPress={() =>
                      onUpdateMedicineAlarm(item.id, { alarmSound: sound.id })
                    }
                  >
                    <Text
                      style={[
                        appStyles.settingsChipText,
                        item.alarmSound === sound.id
                          ? appStyles.settingsChipTextActive
                          : null,
                      ]}
                    >
                      {sound.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={appStyles.settingsRowLabel}>Posponer</Text>
              <View style={appStyles.settingsChipRow}>
                {SNOOZE_OPTIONS.map(minutes => (
                  <TouchableOpacity
                    key={minutes}
                    style={[
                      appStyles.settingsChip,
                      item.snoozeMinutes === minutes
                        ? appStyles.settingsChipActive
                        : null,
                    ]}
                    onPress={() =>
                      onUpdateMedicineAlarm(item.id, { snoozeMinutes: minutes })
                    }
                  >
                    <Text
                      style={[
                        appStyles.settingsChipText,
                        item.snoozeMinutes === minutes
                          ? appStyles.settingsChipTextActive
                          : null,
                      ]}
                    >
                      {minutes} min
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={appStyles.actionRow}>
                <TouchableOpacity
                  style={[appStyles.actionButton, appStyles.actionEditSoft]}
                  onPress={() => onOpenEditForm(item)}
                >
                  <View style={appStyles.iconTextRow}>
                    <AppIcon icon={faPen} color={palette.yellow} size={12} />
                    <Text style={appStyles.editSoftText}>Editar</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[appStyles.actionButton, appStyles.actionDeleteSoft]}
                  onPress={() => onDeleteMedicine(item.id)}
                >
                  <View style={appStyles.iconTextRow}>
                    <AppIcon icon={faTrash} color={palette.red} size={12} />
                    <Text style={appStyles.deleteSoftText}>Eliminar</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      )}

      <Text style={appStyles.sectionTitle}>Ajustes de alarmas</Text>
      <View style={appStyles.settingsRow}>
        <Text style={appStyles.settingsRowLabel}>Recordatorio previo</Text>
        <Text style={appStyles.settingsRowHint}>
          Elige cuantos minutos antes quieres recibir la alarma.
        </Text>
        <View style={appStyles.settingsChipRow}>
          {REMINDER_OPTIONS.map(minutes => (
            <TouchableOpacity
              key={minutes}
              style={[
                appStyles.settingsChip,
                settings.reminderMinutesBefore === minutes
                  ? appStyles.settingsChipActive
                  : null,
              ]}
              onPress={() => updateSettings({ reminderMinutesBefore: minutes })}
            >
              <Text
                style={[
                  appStyles.settingsChipText,
                  settings.reminderMinutesBefore === minutes
                    ? appStyles.settingsChipTextActive
                    : null,
                ]}
              >
                {minutes === 0 ? 'En la hora' : `${minutes} min`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={appStyles.settingsRow}>
        <View style={appStyles.rowBetween}>
          <View style={appStyles.medicineHeaderInfo}>
            <Text style={appStyles.settingsRowLabel}>Vibracion</Text>
            <Text style={appStyles.settingsRowHint}>
              Refuerza la alarma con una alerta tactil.
            </Text>
          </View>
          <Switch
            value={settings.vibrationOnReminder}
            onValueChange={value =>
              updateSettings({ vibrationOnReminder: value })
            }
          />
        </View>
      </View>

      <View style={appStyles.settingsRow}>
        <Text style={appStyles.settingsRowLabel}>Sonido de alarma</Text>
        <View style={appStyles.settingsChipRow}>
          {ALARM_SOUND_OPTIONS.map(sound => (
            <TouchableOpacity
              key={sound.id}
              style={[
                appStyles.settingsChip,
                settings.alarmSound === sound.id
                  ? appStyles.settingsChipActive
                  : null,
              ]}
              onPress={() => updateSettings({ alarmSound: sound.id })}
            >
              <Text
                style={[
                  appStyles.settingsChipText,
                  settings.alarmSound === sound.id
                    ? appStyles.settingsChipTextActive
                    : null,
                ]}
              >
                {sound.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
