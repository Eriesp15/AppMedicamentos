import React from 'react';
import {Modal, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {FREQUENCIES} from '../constants/data';
import {appStyles} from '../styles/appStyles';
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
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={appStyles.modalOverlay}>
        <View style={appStyles.modalCard}>
          <Text style={appStyles.modalTitle}>
            {editingMedicineId ? 'Editar medicamento' : 'Nuevo medicamento'}
          </Text>

          <TextInput
            style={appStyles.input}
            placeholder="Nombre"
            value={form.name}
            onChangeText={value => setForm(current => ({...current, name: value}))}
          />

          <TextInput
            style={appStyles.input}
            placeholder="Dosis (ej. 1 pastilla)"
            value={form.dosage}
            onChangeText={value => setForm(current => ({...current, dosage: value}))}
          />

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
            value={form.startTime}
            onChangeText={value => setForm(current => ({...current, startTime: value}))}
          />

          <TextInput
            style={[appStyles.input, appStyles.notesInput]}
            placeholder="Notas (opcional)"
            multiline
            numberOfLines={3}
            value={form.notes}
            onChangeText={value => setForm(current => ({...current, notes: value}))}
          />

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
        </View>
      </View>
    </Modal>
  );
}
