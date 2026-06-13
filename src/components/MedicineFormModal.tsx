import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  faBell,
  faCheckCircle,
  faClipboardList,
  faClock,
  faFlask,
  faMinus,
  faPlay,
  faPlus,
  faVolumeHigh,
  faSyringe,
  faTablets,
  faTag,
  faUtensils,
} from '@fortawesome/free-solid-svg-icons';
import { AppIcon } from './AppIcon';
import {
  ALARM_SOUND_OPTIONS,
  FOOD_OPTIONS,
  FREQUENCIES,
  INPUT_LIMITS,
  MEDICINE_TYPES,
  MEDICINE_UNITS,
  SNOOZE_OPTIONS,
} from '../constants/data';
import { useAppSettings } from '../context/AppSettingsContext';
import { MedicineForm } from '../types/medication';
import { playAlarmPreview } from '../services/alarmService';
import {
  formatTime,
  getTimeParts,
  sanitizeDecimal,
  sanitizeMedicineName,
  sanitizeNotes,
} from '../utils/inputSanitizers';

type Props = {
  visible: boolean;
  editingMedicineId: string | null;
  form: MedicineForm;
  setForm: React.Dispatch<React.SetStateAction<MedicineForm>>;
  onClose: () => void;
  onSave: () => void;
};

type FormFieldsProps = {
  form: MedicineForm;
  setForm: React.Dispatch<React.SetStateAction<MedicineForm>>;
  onSave: () => void;
  onCancel?: () => void;
  saveLabel?: string;
};

export function MedicineFormFields({
  form,
  setForm,
  onSave,
  onCancel,
  saveLabel = 'Guardar medicamento',
}: FormFieldsProps) {
  const { styles: appStyles, palette } = useAppSettings();
  const timeParts = getTimeParts(form.startTime);
  const [editingField, setEditingField] = useState<'hours' | 'minutes' | null>(
    null,
  );
  const [editingValue, setEditingValue] = useState('');

  const updateTime = (hours: number, minutes: number) => {
    setForm(current => ({ ...current, startTime: formatTime(hours, minutes) }));
  };

  const adjustTime = (part: 'hours' | 'minutes', amount: number) => {
    const current = getTimeParts(form.startTime);
    const nextHours =
      part === 'hours'
        ? current.hours + amount
        : current.hours + Math.floor((current.minutes + amount) / 60);
    const nextMinutes =
      part === 'minutes' ? current.minutes + amount : current.minutes;

    updateTime(nextHours, nextMinutes);
  };

  const commitTimeField = (field: 'hours' | 'minutes') => {
    const cleaned = editingValue.replace(/[^0-9]/g, '').slice(0, 2);
    const num = parseInt(cleaned, 10);
    const current = getTimeParts(form.startTime);

    if (field === 'hours') {
      const val = isNaN(num) ? current.hours : Math.min(num, 23);
      updateTime(val, current.minutes);
    } else {
      const val = isNaN(num) ? current.minutes : Math.min(num, 59);
      updateTime(current.hours, val);
    }
    setEditingField(null);
  };

  const startEditing = (field: 'hours' | 'minutes') => {
    const current = getTimeParts(form.startTime);
    setEditingValue(
      String(field === 'hours' ? current.hours : current.minutes),
    );
    setEditingField(field);
  };

  return (
    <>
      <View style={appStyles.fieldCard}>
        <View style={appStyles.formLabelRow}>
          <View style={appStyles.formIconCircle}>
            <AppIcon icon={faTag} color={palette.primary} size={20} />
          </View>
          <Text style={appStyles.inputLabel}>Nombre del medicamento</Text>
        </View>
        <TextInput
          style={appStyles.input}
          placeholder="Ej: Metformina"
          placeholderTextColor={palette.placeholderText}
          maxLength={INPUT_LIMITS.MEDICINE_NAME}
          value={form.name}
          autoCapitalize="words"
          onChangeText={value =>
            setForm(current => ({
              ...current,
              name: sanitizeMedicineName(value),
            }))
          }
        />
        <Text style={appStyles.charCounter}>
          {form.name.length}/{INPUT_LIMITS.MEDICINE_NAME}
        </Text>
      </View>

      <View style={appStyles.fieldCard}>
        <View style={appStyles.formLabelRow}>
          <View
            style={[appStyles.formIconCircle, { backgroundColor: '#FFF0E6' }]}
          >
            <AppIcon icon={faTablets} color={palette.orange} size={20} />
          </View>
          <Text style={appStyles.inputLabel}>Tipo de medicamento</Text>
        </View>
        <View style={appStyles.optionGrid}>
          {MEDICINE_TYPES.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                appStyles.optionChip,
                form.medicineType === option
                  ? appStyles.optionChipActive
                  : null,
              ]}
              onPress={() =>
                setForm(current => ({ ...current, medicineType: option }))
              }
            >
              <Text
                style={[
                  appStyles.optionChipText,
                  form.medicineType === option
                    ? appStyles.optionChipTextActive
                    : null,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={appStyles.fieldCard}>
        <View style={appStyles.formLabelRow}>
          <View
            style={[appStyles.formIconCircle, { backgroundColor: '#E0F5EC' }]}
          >
            <AppIcon icon={faFlask} color={palette.teal} size={20} />
          </View>
          <Text style={appStyles.inputLabel}>Unidad</Text>
        </View>
        <View style={appStyles.frequencyWrap}>
          {MEDICINE_UNITS.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                appStyles.frequencyItem,
                form.unit === option ? appStyles.frequencyItemActive : null,
              ]}
              onPress={() => setForm(current => ({ ...current, unit: option }))}
            >
              <Text
                style={[
                  appStyles.frequencyItemText,
                  form.unit === option
                    ? appStyles.frequencyItemTextActive
                    : null,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={appStyles.fieldCard}>
        <View style={appStyles.formLabelRow}>
          <View
            style={[appStyles.formIconCircle, { backgroundColor: '#FFE8E8' }]}
          >
            <AppIcon icon={faSyringe} color={palette.red} size={18} />
          </View>
          <Text style={appStyles.inputLabel}>Dosis</Text>
        </View>
        <TextInput
          style={appStyles.input}
          placeholder="Ej: 500"
          placeholderTextColor={palette.placeholderText}
          maxLength={INPUT_LIMITS.MEDICINE_DOSAGE}
          keyboardType="decimal-pad"
          value={form.dosage}
          onChangeText={value =>
            setForm(current => ({ ...current, dosage: sanitizeDecimal(value) }))
          }
        />
        <Text style={appStyles.charCounter}>
          {form.dosage.length}/{INPUT_LIMITS.MEDICINE_DOSAGE}
        </Text>
      </View>

      <View style={appStyles.fieldCard}>
        <View style={appStyles.formLabelRow}>
          <View
            style={[appStyles.formIconCircle, { backgroundColor: '#E8EDF8' }]}
          >
            <AppIcon icon={faClock} color={palette.primaryDark} size={20} />
          </View>
          <Text style={appStyles.inputLabel}>Frecuencia</Text>
        </View>
        <View style={appStyles.frequencyWrap}>
          {FREQUENCIES.map(option => (
            <TouchableOpacity
              key={option.id}
              style={[
                appStyles.frequencyItem,
                form.frequency === option.id
                  ? appStyles.frequencyItemActive
                  : null,
              ]}
              onPress={() =>
                setForm(current => ({ ...current, frequency: option.id }))
              }
            >
              <Text
                style={[
                  appStyles.frequencyItemText,
                  form.frequency === option.id
                    ? appStyles.frequencyItemTextActive
                    : null,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={appStyles.fieldCard}>
        <View style={appStyles.formLabelRow}>
          <View
            style={[appStyles.formIconCircle, { backgroundColor: '#FFF3D8' }]}
          >
            <AppIcon icon={faBell} color={palette.yellow} size={20} />
          </View>
          <Text style={appStyles.inputLabel}>Hora de toma</Text>
        </View>
        <View style={appStyles.timePickerCard}>
          <View style={appStyles.timeStepper}>
            <TouchableOpacity
              style={appStyles.timeStepButton}
              onPress={() => adjustTime('hours', 1)}
              accessibilityLabel="Subir hora"
            >
              <AppIcon icon={faPlus} color={palette.primary} size={13} />
            </TouchableOpacity>
            {editingField === 'hours' ? (
              <TextInput
                style={[
                  appStyles.timeStepperValue,
                  { padding: 0, borderBottomWidth: 2, borderBottomColor: palette.primary },
                ]}
                value={editingValue}
                keyboardType="number-pad"
                maxLength={2}
                selectTextOnFocus
                autoFocus
                onBlur={() => commitTimeField('hours')}
                onSubmitEditing={() => commitTimeField('hours')}
                onChangeText={setEditingValue}
              />
            ) : (
              <TouchableOpacity onPress={() => startEditing('hours')}>
                <Text style={appStyles.timeStepperValue}>
                  {timeParts.hours.toString().padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={appStyles.timeStepButton}
              onPress={() => adjustTime('hours', -1)}
              accessibilityLabel="Bajar hora"
            >
              <AppIcon icon={faMinus} color={palette.primary} size={13} />
            </TouchableOpacity>
          </View>

          <Text style={appStyles.timeSeparator}>:</Text>

          <View style={appStyles.timeStepper}>
            <TouchableOpacity
              style={appStyles.timeStepButton}
              onPress={() => adjustTime('minutes', 5)}
              accessibilityLabel="Subir minutos"
            >
              <AppIcon icon={faPlus} color={palette.primary} size={13} />
            </TouchableOpacity>
            {editingField === 'minutes' ? (
              <TextInput
                style={[
                  appStyles.timeStepperValue,
                  { padding: 0, borderBottomWidth: 2, borderBottomColor: palette.primary },
                ]}
                value={editingValue}
                keyboardType="number-pad"
                maxLength={2}
                selectTextOnFocus
                autoFocus
                onBlur={() => commitTimeField('minutes')}
                onSubmitEditing={() => commitTimeField('minutes')}
                onChangeText={setEditingValue}
              />
            ) : (
              <TouchableOpacity onPress={() => startEditing('minutes')}>
                <Text style={appStyles.timeStepperValue}>
                  {timeParts.minutes.toString().padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={appStyles.timeStepButton}
              onPress={() => adjustTime('minutes', -5)}
              accessibilityLabel="Bajar minutos"
            >
              <AppIcon icon={faMinus} color={palette.primary} size={13} />
            </TouchableOpacity>
          </View>

          <View style={appStyles.timeFormatPill}>
            <Text style={appStyles.timeFormatText}>24 h</Text>
          </View>
        </View>
      </View>

      <View style={appStyles.fieldCard}>
        <View style={appStyles.formLabelRow}>
          <View
            style={[appStyles.formIconCircle, { backgroundColor: '#FFF0E6' }]}
          >
            <AppIcon icon={faUtensils} color={palette.orange} size={18} />
          </View>
          <Text style={appStyles.inputLabel}>Con o sin alimentos</Text>
        </View>
        <View style={appStyles.optionGrid}>
          {FOOD_OPTIONS.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                appStyles.optionChip,
                form.foodInstruction === option
                  ? appStyles.optionChipActive
                  : null,
              ]}
              onPress={() =>
                setForm(current => ({ ...current, foodInstruction: option }))
              }
            >
              <Text
                style={[
                  appStyles.optionChipText,
                  form.foodInstruction === option
                    ? appStyles.optionChipTextActive
                    : null,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={appStyles.fieldCard}>
        <View style={appStyles.formLabelRow}>
          <View
            style={[appStyles.formIconCircle, { backgroundColor: '#F0F0F5' }]}
          >
            <AppIcon
              icon={faClipboardList}
              color={palette.textSoft}
              size={18}
            />
          </View>
          <Text style={appStyles.inputLabel}>Notas adicionales</Text>
        </View>
        <TextInput
          style={[appStyles.input, appStyles.notesInput]}
          placeholder="Ej: Tomar con agua fria, evitar lacteos..."
          placeholderTextColor={palette.placeholderText}
          maxLength={INPUT_LIMITS.MEDICINE_NOTES}
          multiline
          numberOfLines={3}
          value={form.notes}
          onChangeText={value =>
            setForm(current => ({ ...current, notes: sanitizeNotes(value) }))
          }
        />
        <Text style={appStyles.charCounter}>
          {form.notes.length}/{INPUT_LIMITS.MEDICINE_NOTES}
        </Text>
      </View>

      <View style={appStyles.fieldCard}>
        <View style={appStyles.rowBetween}>
          <View style={appStyles.formLabelRow}>
            <View
              style={[appStyles.formIconCircle, { backgroundColor: '#E8EDF8' }]}
            >
              <AppIcon icon={faVolumeHigh} color={palette.primary} size={18} />
            </View>
            <View>
              <Text style={appStyles.inputLabel}>Alarma local</Text>
              <Text style={appStyles.softText}>
                Sonara aunque cierres la aplicacion.
              </Text>
            </View>
          </View>
          <Switch
            value={form.alarmEnabled}
            onValueChange={value =>
              setForm(current => ({ ...current, alarmEnabled: value }))
            }
          />
        </View>

        <Text style={appStyles.settingsRowLabel}>Tono de alarma</Text>
        <View style={appStyles.settingsChipRow}>
          {ALARM_SOUND_OPTIONS.map(sound => (
            <View key={sound.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                style={[
                  appStyles.settingsChip,
                  form.alarmSound === sound.id
                    ? appStyles.settingsChipActive
                    : null,
                ]}
                onPress={() =>
                  setForm(current => ({ ...current, alarmSound: sound.id }))
                }
              >
                <Text
                  style={[
                    appStyles.settingsChipText,
                    form.alarmSound === sound.id
                      ? appStyles.settingsChipTextActive
                      : null,
                  ]}
                >
                  {sound.label}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ padding: 8, marginLeft: 2 }}
                onPress={() => playAlarmPreview(sound.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <AppIcon icon={faPlay} size={14} color="#888" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Text style={appStyles.settingsRowLabel}>Posponer</Text>
        <View style={appStyles.settingsChipRow}>
          {SNOOZE_OPTIONS.map(minutes => (
            <TouchableOpacity
              key={minutes}
              style={[
                appStyles.settingsChip,
                form.snoozeMinutes === minutes
                  ? appStyles.settingsChipActive
                  : null,
              ]}
              onPress={() =>
                setForm(current => ({ ...current, snoozeMinutes: minutes }))
              }
            >
              <Text
                style={[
                  appStyles.settingsChipText,
                  form.snoozeMinutes === minutes
                    ? appStyles.settingsChipTextActive
                    : null,
                ]}
              >
                {minutes} min
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={appStyles.actionRow}>
        {onCancel ? (
          <TouchableOpacity
            style={[appStyles.actionButton, appStyles.cancelButton]}
            onPress={onCancel}
          >
            <Text style={appStyles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={[appStyles.actionButton, appStyles.actionPrimary]}
          onPress={onSave}
        >
          <View style={appStyles.iconTextRow}>
            <AppIcon icon={faCheckCircle} color="#FFFFFF" size={16} />
            <Text style={appStyles.actionButtonText}>{saveLabel}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}

export function MedicineFormModal({
  visible,
  editingMedicineId,
  form,
  setForm,
  onClose,
  onSave,
}: Props) {
  const { styles: appStyles } = useAppSettings();
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={appStyles.modalOverlay}>
        <View style={appStyles.modalCard}>
          <Text style={appStyles.modalTitle}>
            {editingMedicineId ? 'Editar medicamento' : 'Nuevo medicamento'}
          </Text>

          <ScrollView
            style={appStyles.modalScroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <MedicineFormFields
              form={form}
              setForm={setForm}
              onCancel={onClose}
              onSave={onSave}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
