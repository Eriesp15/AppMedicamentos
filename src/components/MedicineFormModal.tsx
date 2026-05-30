import React from 'react';
import {Modal, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {
  FOOD_OPTIONS,
  FREQUENCIES,
  INPUT_LIMITS,
  MEDICINE_TYPES,
  MEDICINE_UNITS,
} from '../constants/data';
import {useAppSettings} from '../context/AppSettingsContext';
import {MedicineForm} from '../types/medication';

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
  const {styles: appStyles, palette} = useAppSettings();

  return (
    <>
      <View style={appStyles.fieldCard}>
        <Text style={appStyles.formSectionIcon}>N</Text>
        <Text style={appStyles.inputLabel}>Nombre del medicamento</Text>
        <TextInput
          style={appStyles.input}
          placeholder="Ej: Metformina"
          placeholderTextColor={palette.placeholderText}
          maxLength={INPUT_LIMITS.MEDICINE_NAME}
          value={form.name}
          onChangeText={value => setForm(current => ({...current, name: value}))}
        />
        <Text style={appStyles.charCounter}>
          {form.name.length}/{INPUT_LIMITS.MEDICINE_NAME}
        </Text>
      </View>

      <View style={appStyles.fieldCard}>
        <Text style={appStyles.formSectionIcon}>T</Text>
        <Text style={appStyles.inputLabel}>Tipo de medicamento</Text>
        <View style={appStyles.optionGrid}>
          {MEDICINE_TYPES.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                appStyles.optionChip,
                form.medicineType === option ? appStyles.optionChipActive : null,
              ]}
              onPress={() =>
                setForm(current => ({...current, medicineType: option}))
              }>
              <Text
                style={[
                  appStyles.optionChipText,
                  form.medicineType === option
                    ? appStyles.optionChipTextActive
                    : null,
                ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={appStyles.fieldCard}>
        <Text style={appStyles.formSectionIcon}>U</Text>
        <Text style={appStyles.inputLabel}>Unidad</Text>
        <View style={appStyles.frequencyWrap}>
          {MEDICINE_UNITS.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                appStyles.frequencyItem,
                form.unit === option ? appStyles.frequencyItemActive : null,
              ]}
              onPress={() => setForm(current => ({...current, unit: option}))}>
              <Text
                style={[
                  appStyles.frequencyItemText,
                  form.unit === option ? appStyles.frequencyItemTextActive : null,
                ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={appStyles.fieldCard}>
        <Text style={appStyles.formSectionIcon}>D</Text>
        <Text style={appStyles.inputLabel}>Dosis</Text>
        <TextInput
          style={appStyles.input}
          placeholder="Ej: 500"
          placeholderTextColor={palette.placeholderText}
          maxLength={INPUT_LIMITS.MEDICINE_DOSAGE}
          keyboardType="numbers-and-punctuation"
          value={form.dosage}
          onChangeText={value => setForm(current => ({...current, dosage: value}))}
        />
        <Text style={appStyles.charCounter}>
          {form.dosage.length}/{INPUT_LIMITS.MEDICINE_DOSAGE}
        </Text>
      </View>

      <View style={appStyles.fieldCard}>
        <Text style={appStyles.formSectionIcon}>F</Text>
        <Text style={appStyles.inputLabel}>Frecuencia</Text>
        <View style={appStyles.frequencyWrap}>
          {FREQUENCIES.map(option => (
            <TouchableOpacity
              key={option.id}
              style={[
                appStyles.frequencyItem,
                form.frequency === option.id ? appStyles.frequencyItemActive : null,
              ]}
              onPress={() => setForm(current => ({...current, frequency: option.id}))}>
              <Text
                style={[
                  appStyles.frequencyItemText,
                  form.frequency === option.id
                    ? appStyles.frequencyItemTextActive
                    : null,
                ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={appStyles.fieldCard}>
        <Text style={appStyles.formSectionIcon}>H</Text>
        <Text style={appStyles.inputLabel}>Hora de toma</Text>
        <TextInput
          style={appStyles.input}
          placeholder="08:00"
          placeholderTextColor={palette.placeholderText}
          maxLength={INPUT_LIMITS.MEDICINE_TIME}
          keyboardType="numbers-and-punctuation"
          value={form.startTime}
          onChangeText={value => setForm(current => ({...current, startTime: value}))}
        />
        <Text style={appStyles.charCounter}>
          {form.startTime.length}/{INPUT_LIMITS.MEDICINE_TIME}
        </Text>
      </View>

      <View style={appStyles.fieldCard}>
        <Text style={appStyles.formSectionIcon}>A</Text>
        <Text style={appStyles.inputLabel}>Con o sin alimentos</Text>
        <View style={appStyles.optionGrid}>
          {FOOD_OPTIONS.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                appStyles.optionChip,
                form.foodInstruction === option ? appStyles.optionChipActive : null,
              ]}
              onPress={() =>
                setForm(current => ({...current, foodInstruction: option}))
              }>
              <Text
                style={[
                  appStyles.optionChipText,
                  form.foodInstruction === option
                    ? appStyles.optionChipTextActive
                    : null,
                ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={appStyles.fieldCard}>
        <Text style={appStyles.formSectionIcon}>N</Text>
        <Text style={appStyles.inputLabel}>Notas adicionales</Text>
        <TextInput
          style={[appStyles.input, appStyles.notesInput]}
          placeholder="Ej: Tomar con agua fria, evitar lacteos..."
          placeholderTextColor={palette.placeholderText}
          maxLength={INPUT_LIMITS.MEDICINE_NOTES}
          multiline
          numberOfLines={3}
          value={form.notes}
          onChangeText={value => setForm(current => ({...current, notes: value}))}
        />
        <Text style={appStyles.charCounter}>
          {form.notes.length}/{INPUT_LIMITS.MEDICINE_NOTES}
        </Text>
      </View>

      <View style={appStyles.actionRow}>
        {onCancel ? (
          <TouchableOpacity
            style={[appStyles.actionButton, appStyles.cancelButton]}
            onPress={onCancel}>
            <Text style={appStyles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={[appStyles.actionButton, appStyles.actionPrimary]}
          onPress={onSave}>
          <Text style={appStyles.actionButtonText}>{saveLabel}</Text>
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
  const {styles: appStyles} = useAppSettings();
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
            showsVerticalScrollIndicator={false}>
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
