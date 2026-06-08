import React from 'react';
import {Alert, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {
  faCheck,
  faEye,
  faPen,
  faPills,
  faSearch,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import {AppIcon} from '../components/AppIcon';
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
  const {palette, styles: appStyles} = useAppSettings();
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
        <View style={appStyles.inlineIconText}>
          <AppIcon icon={faSearch} color={palette.textSoft} size={13} />
          <Text style={appStyles.searchText}>Buscar medicamento...</Text>
        </View>
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
              <View style={appStyles.medicineIconBoxSmall}>
                <AppIcon icon={faPills} color={palette.teal} size={20} />
              </View>
              <View style={appStyles.medicineHeaderInfo}>
                <Text style={appStyles.medicineName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={appStyles.softText}>
                  {item.medicineType || 'Medicamento'}
                </Text>
              </View>
              <View style={appStyles.activeBadge}>
                <AppIcon icon={faCheck} color={palette.green} size={9} />
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
                <View style={appStyles.iconTextRow}>
                  <AppIcon icon={faEye} color={palette.primaryDark} size={13} />
                  <Text style={appStyles.viewSoftText}>Ver</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[appStyles.actionButton, appStyles.actionEditSoft]}
                onPress={() => onOpenEditForm(item)}>
                <View style={appStyles.iconTextRow}>
                  <AppIcon icon={faPen} color={palette.yellow} size={12} />
                  <Text style={appStyles.editSoftText}>Editar</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[appStyles.actionButton, appStyles.actionDeleteSoft]}
                onPress={() => onDeleteMedicine(item.id)}>
                <View style={appStyles.iconTextRow}>
                  <AppIcon icon={faTrash} color={palette.red} size={12} />
                  <Text style={appStyles.deleteSoftText}>Eliminar</Text>
                </View>
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
