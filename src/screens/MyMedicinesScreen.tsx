import React, { useState, useCallback, useFocusEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useMedicationStorage } from '../utils/storage';
import { Medication } from '../types/medication';
import MedicineListItem from '../components/MedicineListItem';
import BottomTabBar from '../components/BottomTabBar';
import { Colors } from '../styles/colors';

type MyMedicinesScreenProps = {
  navigation: any;
};

export default function MyMedicinesScreen({ navigation }: MyMedicinesScreenProps) {
  const { medications, deleteMedication } = useMedicationStorage();
  const [medicinesCount, setMedicinesCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setMedicinesCount(medications.length);
    }, [medications]),
  );

  const handleDelete = (medicationId: string) => {
    Alert.alert(
      'Eliminar Medicamento',
      '¿Estás seguro de que deseas eliminar este medicamento?',
      [
        { text: 'Cancelar', onPress: () => {}, style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              await deleteMedication(medicationId);
              Alert.alert('Éxito', 'Medicamento eliminado');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el medicamento');
            }
          },
          style: 'destructive',
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Mis Medicinas</Text>
            <Text style={styles.subtitle}>
              Lista completa de {medicinesCount} medicamentos
            </Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{medicinesCount} setores</Text>
          </View>
        </View>

        {/* Medicines List */}
        {medications.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💊</Text>
            <Text style={styles.emptyTitle}>No hay medicamentos</Text>
            <Text style={styles.emptyText}>Comienza agregando tu primer medicamento</Text>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Medicamentos Registrados</Text>
            {medications.map((med: Medication) => (
              <MedicineListItem
                key={med.id}
                medication={med}
                onEdit={() => navigation.navigate('EditMedication', { id: med.id })}
                onDelete={() => handleDelete(med.id)}
              />
            ))}
          </View>
        )}

        {/* Add Button */}
        {medications.length > 0 && (
          <TouchableOpacity
            style={styles.addNewButton}
            onPress={() => navigation.navigate('AddMedication')}
            activeOpacity={0.8}
          >
            <Text style={styles.addNewButtonText}>+ AGREGAR NUEVO</Text>
          </TouchableOpacity>
        )}

        <View style={styles.spacer} />
      </ScrollView>

      {/* Bottom Tab Bar */}
      <BottomTabBar
        activeTab="medicines"
        onTabPress={(tab) => {
          if (tab === 'home') navigation.navigate('Home');
          if (tab === 'history') navigation.navigate('History');
          if (tab === 'tips') navigation.navigate('Tips');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  badge: {
    backgroundColor: Colors.lightOrange,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.orange,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: Colors.orange,
    paddingBottom: 8,
  },
  emptyState: {
    marginTop: 60,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  addNewButton: {
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addNewButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  spacer: {
    height: 80,
  },
});
