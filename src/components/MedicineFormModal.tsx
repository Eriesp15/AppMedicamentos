import React from 'react';
import {Modal, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {FREQUENCIES, INPUT_LIMITS} from '../constants/data';
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

export function MedicineFormModal({
  visible,
  editingMedicineId,
  form,
  setForm,
  onClose,
  onSave,
}: Props) {
  const {styles: appStyles, palette} = useAppSettings();
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
          <TextInput
            style={appStyles.input}
            placeholder="Nombre"
            placeholderTextColor={palette.placeholderText}
            maxLength={INPUT_LIMITS.MEDICINE_NAME}
            value={form.name}
            onChangeText={value => setForm(current => ({...current, name: value}))}
          />
          <Text style={appStyles.charCounter}>
            {form.name.length}/{INPUT_LIMITS.MEDICINE_NAME}
          </Text>

          <TextInput
            style={appStyles.input}
            placeholder="Dosis (ej. 1 pastilla)"
            placeholderTextColor={palette.placeholderText}
            maxLength={INPUT_LIMITS.MEDICINE_DOSAGE}
            value={form.dosage}
            onChangeText={value => setForm(current => ({...current, dosage: value}))}
          />
          <Text style={appStyles.charCounter}>
            {form.dosage.length}/{INPUT_LIMITS.MEDICINE_DOSAGE}
          </Text>

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
                    form.frequency === option.id ? appStyles.frequencyItemTextActive : null,
                  ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={appStyles.input}
            placeholder="Hora (HH:mm)"
            placeholderTextColor={palette.placeholderText}
            maxLength={INPUT_LIMITS.MEDICINE_TIME}
            keyboardType="numbers-and-punctuation"
            value={form.startTime}
            onChangeText={value => setForm(current => ({...current, startTime: value}))}
          />
          <Text style={appStyles.charCounter}>
            {form.startTime.length}/{INPUT_LIMITS.MEDICINE_TIME}
          </Text>

          <TextInput
            style={[appStyles.input, appStyles.notesInput]}
            placeholder="Notas (opcional)"
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

          <View style={appStyles.actionRow}>
            <TouchableOpacity
              style={[appStyles.actionButton, appStyles.cancelButton]}
              onPress={onClose}>
              <Text style={appStyles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[appStyles.actionButton, appStyles.actionPrimary]}
              onPress={onSave}>
              <Text style={appStyles.actionButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
