import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../utils/theme';
import { MedicationCard } from '../components/MedicationCard';
import { AddEditMedicationModal } from '../components/AddEditMedicationModal';
import { ActionButton } from '../components/ActionButton';
import { useMedications } from '../context/MedicationContext';
import { Medication } from '../types';

interface MedicationsScreenProps {
  navigation: any;
}

export const MedicationsScreen: React.FC<MedicationsScreenProps> = ({
  navigation,
}) => {
  const { medications, addMedication, editMedication, deleteMedication } =
    useMedications();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | undefined>();

  const handleAddPress = () => {
    setEditingMedication(undefined);
    setModalVisible(true);
  };

  const handleEditPress = (medication: Medication) => {
    setEditingMedication(medication);
    setModalVisible(true);
  };

  const handleSave = async (medication: Medication) => {
    if (editingMedication) {
      await editMedication(medication);
    } else {
      await addMedication(medication);
    }
    setModalVisible(false);
  };

  const handleDeletePress = async (medicationId: string) => {
    await deleteMedication(medicationId);
  };

  const renderMedicationCard = ({ item }: { item: Medication }) => {
    return (
      <MedicationCard
        medication={item}
        onEdit={handleEditPress}
        onDelete={handleDeletePress}
        showStatus={false}
      />
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.white,
    },
    headerSubtitle: {
      fontSize: theme.fontSize.base,
      color: theme.colors.white,
    },
    addButton: {
      backgroundColor: theme.colors.white,
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    addButtonText: {
      fontSize: 24,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.primary,
    },
    listContainer: {
      padding: theme.spacing.md,
      flex: 1,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    emptyText: {
      fontSize: theme.fontSize.base,
      color: theme.colors.textLight,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    emptyIcon: {
      fontSize: 48,
      marginBottom: theme.spacing.md,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Mis Medicamentos</Text>
          <Text style={styles.headerSubtitle}>
            {medications.length} medicamento{medications.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {medications.length > 0 ? (
        <FlatList
          style={styles.listContainer}
          data={medications}
          renderItem={renderMedicationCard}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>💊</Text>
          <Text style={styles.emptyText}>
            No hay medicamentos agregados aún
          </Text>
          <ActionButton
            title="Agregar Medicamento"
            onPress={handleAddPress}
            variant="primary"
          />
        </View>
      )}

      <AddEditMedicationModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingMedication(undefined);
        }}
        onSave={handleSave}
        initialMedication={editingMedication}
      />
    </SafeAreaView>
  );
};
