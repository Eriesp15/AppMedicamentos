import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  Switch,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useMedicationStorage } from '../utils/storage';
import { Colors } from '../styles/colors';

type AddMedicationScreenProps = {
  navigation: any;
};

export default function AddMedicationScreen({ navigation }: AddMedicationScreenProps) {
  const { addMedication } = useMedicationStorage();

  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [dosageUnit, setDosageUnit] = useState('pastilla');
  const [frequency, setFrequency] = useState('cada8h');
  const [startTime, setStartTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showFrequencyModal, setShowFrequencyModal] = useState(false);
  const [notes, setNotes] = useState('');

  const frequencyOptions = [
    { label: 'Cada 8 horas', value: 'cada8h', times: ['08:00', '16:00', '00:00'] },
    { label: 'Cada 12 horas', value: 'cada12h', times: ['08:00', '20:00'] },
    { label: 'Cada 24 horas', value: 'cada24h', times: ['08:00'] },
    { label: 'Con las comidas', value: 'comidas', times: ['08:00', '13:00', '19:00'] },
  ];

  const dosageUnits = [
    'pastilla',
    'tableta',
    'cápsula',
    'ml',
    'gotas',
    'sobre',
  ];

  const handleTimeChange = (event: any, selectedTime: any) => {
    if (event.type === 'dismissed') {
      setShowTimePicker(false);
      return;
    }
    setStartTime(selectedTime || startTime);
    setShowTimePicker(false);
  };

  const handleAddMedication = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Por favor ingresa el nombre del medicamento');
      return;
    }
    if (!dosage.trim()) {
      Alert.alert('Error', 'Por favor ingresa la dosis');
      return;
    }

    try {
      const newMedication = {
        id: Date.now().toString(),
        name: name.trim(),
        dosage: `${dosage} ${dosageUnit}`,
        frequency,
        startDate: new Date().toISOString(),
        startTime: startTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        notes: notes.trim(),
        active: true,
      };

      await addMedication(newMedication);
      Alert.alert('Éxito', 'Medicamento guardado correctamente');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el medicamento');
    }
  };

  const selectedFrequency = frequencyOptions.find((f) => f.value === frequency);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Nuevo Medicamento</Text>
          <View style={{ width: 30 }} />
        </View>

        <Text style={styles.subtitle}>Completa todos los campos</Text>

        {/* Medication Name */}
        <View style={styles.section}>
          <View style={styles.fieldHeader}>
            <Text style={styles.fieldIcon}>📋</Text>
            <Text style={styles.fieldLabel}>Nombre del Medicamento</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Ej: Paracetamol"
            placeholderTextColor={Colors.textSecondary}
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Dosage */}
        <View style={styles.section}>
          <View style={styles.fieldHeader}>
            <Text style={styles.fieldIcon}>⚖️</Text>
            <Text style={styles.fieldLabel}>Dosis</Text>
          </View>
          <View style={styles.dosageRow}>
            <TextInput
              style={[styles.input, styles.dosageInput]}
              placeholder="100"
              placeholderTextColor={Colors.textSecondary}
              keyboardType="decimal-pad"
              value={dosage}
              onChangeText={setDosage}
            />
            <TouchableOpacity style={styles.unitButton}>
              <Text style={styles.unitText}>{dosageUnit}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Frequency */}
        <View style={styles.section}>
          <View style={styles.fieldHeader}>
            <Text style={styles.fieldIcon}>⏰</Text>
            <Text style={styles.fieldLabel}>Frecuencia</Text>
          </View>
          <TouchableOpacity
            style={styles.frequencyButton}
            onPress={() => setShowFrequencyModal(true)}
          >
            <Text style={styles.frequencyButtonText}>{selectedFrequency?.label}</Text>
          </TouchableOpacity>

          {selectedFrequency && (
            <View style={styles.frequencyTimes}>
              {selectedFrequency.times.map((time, index) => (
                <View key={index} style={styles.frequencyTime}>
                  <Text style={styles.frequencyTimeText}>{time}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Start Time */}
        <View style={styles.section}>
          <View style={styles.fieldHeader}>
            <Text style={styles.fieldIcon}>🕐</Text>
            <Text style={styles.fieldLabel}>Hora de Inicio</Text>
          </View>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.timeButtonText}>
              {startTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <Text style={styles.ampmText}>AM</Text>
          </TouchableOpacity>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <View style={styles.fieldHeader}>
            <Text style={styles.fieldIcon}>📝</Text>
            <Text style={styles.fieldLabel}>Notas (opcional)</Text>
          </View>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Ej: Tomar con agua o leche..."
            placeholderTextColor={Colors.textSecondary}
            multiline
            numberOfLines={3}
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleAddMedication}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>GUARDAR MEDICAMENTO</Text>
        </TouchableOpacity>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          display="spinner"
          onChange={handleTimeChange}
          textColor={Colors.primary}
        />
      )}

      {/* Frequency Modal */}
      <Modal
        visible={showFrequencyModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFrequencyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona Frecuencia</Text>
            {frequencyOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.frequencyOption,
                  frequency === option.value && styles.frequencyOptionSelected,
                ]}
                onPress={() => {
                  setFrequency(option.value);
                  setShowFrequencyModal(false);
                }}
              >
                <Text style={styles.frequencyOptionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowFrequencyModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    fontSize: 28,
    color: Colors.primary,
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
    textAlign: 'center',
  },
  subtitle: {
    paddingHorizontal: 20,
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.text,
    backgroundColor: Colors.white,
  },
  dosageRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dosageInput: {
    flex: 1,
  },
  unitButton: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    minWidth: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unitText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  frequencyButton: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.white,
  },
  frequencyButtonText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  frequencyTimes: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  frequencyTime: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  frequencyTimeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  timeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.white,
  },
  timeButtonText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  ampmText: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '600',
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  spacer: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  frequencyOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  frequencyOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  frequencyOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  modalCloseButton: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.lightGray,
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
});
