import React from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {ProfileAvatarButton} from '../components/ProfileAvatarButton';
import {FREQUENCIES} from '../constants/data';
import {appStyles} from '../styles/appStyles';
import {Medicine} from '../types/medication';

type Props = {
  medicines: Medicine[];
  onOpenNewForm: () => void;
  onOpenEditForm: (medicine: Medicine) => void;
  onDeleteMedicine: (medicineId: string) => void;
  onOpenProfile: () => void;
  profileName: string;
};

export function MedicinesScreen({
  medicines,
  onOpenNewForm,
  onOpenEditForm,
  onDeleteMedicine,
  onOpenProfile,
  profileName,
}: Props) {
  return (
    <ScrollView contentContainerStyle={appStyles.scrollContent}>
      <View style={appStyles.headerRow}>
        <View>
          <Text style={appStyles.appTitle}>Mis Medicinas</Text>
          <Text style={appStyles.softText}>Total: {medicines.length}</Text>
        </View>
        <ProfileAvatarButton fullName={profileName} onPress={onOpenProfile} />
      </View>

      <View style={appStyles.rowBetween}>
        <Text style={appStyles.softText}>Lista completa de medicamentos</Text>
        <TouchableOpacity style={appStyles.countBadge}>
          <Text style={appStyles.countBadgeText}>{medicines.length} activos</Text>
        </TouchableOpacity>
      </View>

      {medicines.length === 0 ? (
        <View style={appStyles.emptyCard}>
          <Text style={appStyles.emptyTitle}>No hay medicamentos registrados</Text>
        </View>
      ) : (
        medicines.map(item => (
          <View key={item.id} style={appStyles.medicineCard}>
            <Text style={appStyles.medicineName}>{item.name}</Text>
            <Text style={appStyles.softText}>Dosis: {item.dosage}</Text>
            <Text style={appStyles.softText}>
              Frecuencia: {FREQUENCIES.find(f => f.id === item.frequency)?.label}
            </Text>
            <Text style={appStyles.softText}>Hora: {item.startTime}</Text>

            <View style={appStyles.actionRow}>
              <TouchableOpacity
                style={[appStyles.actionButton, appStyles.actionPrimary]}
                onPress={() => onOpenEditForm(item)}>
                <Text style={appStyles.actionButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[appStyles.actionButton, appStyles.actionDanger]}
                onPress={() => onDeleteMedicine(item.id)}>
                <Text style={appStyles.actionButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      <TouchableOpacity style={appStyles.bigButton} onPress={onOpenNewForm}>
        <Text style={appStyles.bigButtonText}>+ AGREGAR NUEVO</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
