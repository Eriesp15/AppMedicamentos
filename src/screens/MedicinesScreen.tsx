import React from 'react';
import {Alert, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {SettingsHeaderButton} from '../components/SettingsHeaderButton';
import {useAppSettings} from '../context/AppSettingsContext';
import {FREQUENCIES} from '../constants/data';
import {Medicine} from '../types/medication';

type Props = {
  medicines: Medicine[];
  onOpenNewForm: () => void;
  onOpenEditForm: (medicine: Medicine) => void;
  onDeleteMedicine: (medicineId: string) => void;
  onOpenSettings: () => void;
};

export function MedicinesScreen({
  medicines,
  onOpenNewForm,
  onOpenEditForm,
  onDeleteMedicine,
  onOpenSettings,
}: Props) {
  const {styles: appStyles} = useAppSettings();
  const showMedicineDetails = (medicine: Medicine) => {
    Alert.alert(
      medicine.name,
      [
        `Tipo: ${medicine.medicineType || 'Medicamento'}`,
        `Dosis: ${medicine.dosage} ${medicine.unit || ''}`.trim(),
        `Frecuencia: ${
          FREQUENCIES.find(f => f.id === medicine.frequency)?.label || medicine.frequency
        }`,
        `Hora: ${medicine.startTime}`,
        `Alimentos: ${medicine.foodInstruction || 'Con alimentos'}`,
        medicine.notes ? `Notas: ${medicine.notes}` : null,
      ]
        .filter(Boolean)
        .join('\n'),
    );
  };

  return (
    <ScrollView contentContainerStyle={appStyles.scrollContent}>
      <View style={appStyles.headerRow}>
        <View>
          <Text style={appStyles.appTitle}>Mis Medicamentos</Text>
          <Text style={appStyles.softText}>
            {medicines.length} medicamentos registrados
          </Text>
        </View>
        <SettingsHeaderButton onPress={onOpenSettings} />
      </View>

      <View style={appStyles.searchBox}>
        <Text style={appStyles.searchText}>⌕ Buscar medicamento...</Text>
      </View>

      <View style={appStyles.settingsChipRow}>
        {['Todos', 'Pastillas', 'Jarabe', 'Inyeccion'].map((label, index) => (
          <TouchableOpacity
            key={label}
            style={[
              appStyles.settingsChip,
              index === 0 ? appStyles.settingsChipActive : null,
            ]}>
            <Text
              style={[
                appStyles.settingsChipText,
                index === 0 ? appStyles.settingsChipTextActive : null,
              ]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {medicines.length === 0 ? (
        <View style={appStyles.emptyCard}>
          <Text style={appStyles.emptyTitle}>No hay medicamentos registrados</Text>
        </View>
      ) : (
        medicines.map(item => (
          <View key={item.id} style={appStyles.medicineCard}>
            <View style={appStyles.rowBetween}>
              <View style={appStyles.medicineHeaderInfo}>
                <Text style={appStyles.medicineName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={appStyles.softText}>
                  {item.medicineType || 'Medicamento'}
                </Text>
              </View>
              <View style={appStyles.activeBadge}>
                <Text style={appStyles.activeBadgeText}>Activo</Text>
              </View>
            </View>
            <View style={appStyles.medicineDetailStrip}>
              <Text style={appStyles.softText} numberOfLines={2}>
                {FREQUENCIES.find(f => f.id === item.frequency)?.label} -{' '}
                {item.foodInstruction || 'Con alimentos'}
              </Text>
            </View>
            <Text style={appStyles.softText}>
              Dosis: {item.dosage} {item.unit || ''}
            </Text>
            <Text style={appStyles.softText}>Hora: {item.startTime}</Text>
            {item.notes ? (
              <Text style={appStyles.softText} numberOfLines={3} ellipsizeMode="tail">
                Notas: {item.notes}
              </Text>
            ) : null}

            <View style={appStyles.actionRow}>
              <TouchableOpacity
                style={[appStyles.actionButton, appStyles.actionViewSoft]}
                onPress={() => showMedicineDetails(item)}>
                <Text style={appStyles.viewSoftText}>Ver</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[appStyles.actionButton, appStyles.actionEditSoft]}
                onPress={() => onOpenEditForm(item)}>
                <Text style={appStyles.editSoftText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[appStyles.actionButton, appStyles.actionDeleteSoft]}
                onPress={() => onDeleteMedicine(item.id)}>
                <Text style={appStyles.deleteSoftText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      <TouchableOpacity style={appStyles.bigButton} onPress={onOpenNewForm}>
        <Text style={appStyles.bigButtonText}>+ Agregar nuevo medicamento</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
