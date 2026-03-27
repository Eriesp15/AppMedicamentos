import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { theme, medicationColors, frequencyOptions, daysOfWeek } from '../utils/theme';
import { Medication } from '../types';
import { ActionButton } from './ActionButton';

interface AddEditMedicationModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (medication: Medication) => void;
  initialMedication?: Medication;
}

export const AddEditMedicationModal: React.FC<AddEditMedicationModalProps> = ({
  visible,
  onClose,
  onSave,
  initialMedication,
}) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'specific_days'>('daily');
  const [times, setTimes] = useState<string[]>(['08:00']);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [selectedColor, setSelectedColor] = useState(medicationColors[0]);

  useEffect(() => {
    if (initialMedication) {
      setName(initialMedication.name);
      setDosage(initialMedication.dosage);
      setFrequency(initialMedication.frequency);
      setTimes(initialMedication.times);
      setSelectedColor(initialMedication.color);
      setSelectedDays(initialMedication.specificDays || []);
    } else {
      resetForm();
    }
  }, [initialMedication, visible]);

  const resetForm = () => {
    setName('');
    setDosage('');
    setFrequency('daily');
    setTimes(['08:00']);
    setSelectedDays([]);
    setSelectedColor(medicationColors[0]);
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Por favor ingrese el nombre del medicamento');
      return;
    }
    if (!dosage.trim()) {
      Alert.alert('Error', 'Por favor ingrese la dosis');
      return;
    }

    const medication: Medication = {
      id: initialMedication?.id || Date.now().toString(),
      name: name.trim(),
      dosage: dosage.trim(),
      frequency,
      times,
      specificDays: frequency === 'specific_days' ? selectedDays : undefined,
      color: selectedColor,
      icon: 'pill',
      createdAt: initialMedication?.createdAt || Date.now(),
    };

    onSave(medication);
    onClose();
  };

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const addTime = () => {
    setTimes([...times, '08:00']);
  };

  const removeTime = (index: number) => {
    if (times.length > 1) {
      setTimes(times.filter((_, i) => i !== index));
    }
  };

  const updateTime = (index: number, value: string) => {
    const newTimes = [...times];
    newTimes[index] = value;
    setTimes(newTimes);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modal: {
      backgroundColor: theme.colors.white,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      maxHeight: '90%',
      paddingTop: theme.spacing.lg,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
    },
    closeButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: theme.spacing.md,
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    label: {
      fontSize: theme.fontSize.base,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      fontSize: theme.fontSize.base,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    frequencyContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    frequencyButton: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      alignItems: 'center',
    },
    frequencyButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    frequencyButtonInactive: {
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.border,
    },
    frequencyButtonText: {
      fontSize: theme.fontSize.sm,
      fontWeight: theme.fontWeight.semibold,
    },
    frequencyButtonTextActive: {
      color: theme.colors.white,
    },
    frequencyButtonTextInactive: {
      color: theme.colors.text,
    },
    daysContainer: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      flexWrap: 'wrap',
    },
    dayButton: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      flex: 1,
      minWidth: '30%',
    },
    dayButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    dayButtonInactive: {
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.border,
    },
    dayButtonText: {
      fontSize: theme.fontSize.sm,
      fontWeight: theme.fontWeight.semibold,
      textAlign: 'center',
    },
    dayButtonTextActive: {
      color: theme.colors.white,
    },
    dayButtonTextInactive: {
      color: theme.colors.text,
    },
    timeItem: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    timeInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      fontSize: theme.fontSize.base,
      color: theme.colors.text,
    },
    removeButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.danger,
    },
    addButton: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      alignItems: 'center',
    },
    addButtonText: {
      color: theme.colors.primary,
      fontWeight: theme.fontWeight.semibold,
      fontSize: theme.fontSize.base,
    },
    colorContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      flexWrap: 'wrap',
    },
    colorOption: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.md,
      borderWidth: 3,
      alignItems: 'center',
      justifyContent: 'center',
    },
    colorOptionSelected: {
      borderColor: theme.colors.text,
    },
    colorOptionUnselected: {
      borderColor: 'transparent',
    },
    footer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      padding: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    footerButton: {
      flex: 1,
    },
  });

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {initialMedication ? 'Editar Medicamento' : 'Agregar Medicamento'}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={{ fontSize: 20 }}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.label}>Nombre del Medicamento</Text>
              <TextInput
                style={styles.input}
                placeholder="ej. Aspirina"
                value={name}
                onChangeText={setName}
                placeholderTextColor={theme.colors.textLight}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Dosis</Text>
              <TextInput
                style={styles.input}
                placeholder="ej. 100mg"
                value={dosage}
                onChangeText={setDosage}
                placeholderTextColor={theme.colors.textLight}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Frecuencia</Text>
              <View style={styles.frequencyContainer}>
                {frequencyOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.frequencyButton,
                      frequency === option.value
                        ? styles.frequencyButtonActive
                        : styles.frequencyButtonInactive,
                    ]}
                    onPress={() => setFrequency(option.value as any)}
                  >
                    <Text
                      style={[
                        styles.frequencyButtonText,
                        frequency === option.value
                          ? styles.frequencyButtonTextActive
                          : styles.frequencyButtonTextInactive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {frequency === 'specific_days' && (
              <View style={styles.section}>
                <Text style={styles.label}>Seleccionar Días</Text>
                <View style={styles.daysContainer}>
                  {daysOfWeek.map((day) => (
                    <TouchableOpacity
                      key={day.value}
                      style={[
                        styles.dayButton,
                        selectedDays.includes(day.value)
                          ? styles.dayButtonActive
                          : styles.dayButtonInactive,
                      ]}
                      onPress={() => toggleDay(day.value)}
                    >
                      <Text
                        style={[
                          styles.dayButtonText,
                          selectedDays.includes(day.value)
                            ? styles.dayButtonTextActive
                            : styles.dayButtonTextInactive,
                        ]}
                      >
                        {day.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.label}>Horarios de Toma</Text>
              {times.map((time, index) => (
                <View key={index} style={styles.timeItem}>
                  <TextInput
                    style={styles.timeInput}
                    placeholder="HH:MM"
                    value={time}
                    onChangeText={(value) => updateTime(index, value)}
                    placeholderTextColor={theme.colors.textLight}
                    maxLength={5}
                  />
                  {times.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeTime(index)}
                    >
                      <Text style={{ fontSize: 16, color: theme.colors.white }}>−</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              <TouchableOpacity
                style={styles.addButton}
                onPress={addTime}
              >
                <Text style={styles.addButtonText}>+ Agregar Horario</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Color</Text>
              <View style={styles.colorContainer}>
                {medicationColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color
                        ? styles.colorOptionSelected
                        : styles.colorOptionUnselected,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <Text style={{ fontSize: 20 }}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.footerButton}>
              <ActionButton
                title="Cancelar"
                onPress={onClose}
                variant="secondary"
                fullWidth
              />
            </View>
            <View style={styles.footerButton}>
              <ActionButton
                title="Guardar"
                onPress={handleSave}
                variant="primary"
                fullWidth
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
