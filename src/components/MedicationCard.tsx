import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { theme } from '../utils/theme';
import { Medication, MedicationSchedule } from '../types';
import { StatusBadge } from './StatusBadge';
import { ActionButton } from './ActionButton';

interface MedicationCardProps {
  medication: Medication;
  schedule?: MedicationSchedule;
  onMarkTaken?: (scheduleId: string) => void;
  onEdit?: (medication: Medication) => void;
  onDelete?: (medicationId: string) => void;
  showStatus?: boolean;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  schedule,
  onMarkTaken,
  onEdit,
  onDelete,
  showStatus = true,
}) => {
  const handleDelete = () => {
    Alert.alert(
      'Eliminar medicamento',
      `¿Está seguro de que desea eliminar ${medication.name}?`,
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Eliminar',
          onPress: () => onDelete?.(medication.id),
          style: 'destructive',
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.white,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginVertical: theme.spacing.sm,
      borderLeftWidth: 4,
      borderLeftColor: medication.color,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    title: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      flex: 1,
    },
    dosage: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textLight,
      marginTop: theme.spacing.xs,
    },
    details: {
      marginVertical: theme.spacing.sm,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: theme.spacing.xs,
    },
    detailLabel: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textLight,
      fontWeight: theme.fontWeight.semibold,
    },
    detailValue: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.text,
    },
    frequencyLabel: {
      fontSize: theme.fontSize.xs,
      color: theme.colors.textLight,
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    buttonContainer: {
      flex: 1,
    },
    iconButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.background,
    },
    timesList: {
      marginVertical: theme.spacing.sm,
    },
    timeItem: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.text,
      marginVertical: theme.spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{medication.name}</Text>
          <Text style={styles.dosage}>{medication.dosage}</Text>
        </View>
        {showStatus && schedule && <StatusBadge status={schedule.status} size="sm" />}
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Hora:</Text>
          <Text style={styles.detailValue}>{medication.times.join(', ')}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Frecuencia:</Text>
          <Text style={styles.detailValue}>
            {medication.frequency === 'daily' ? 'Diariamente' : 'Días específicos'}
          </Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        {schedule && onMarkTaken && schedule.status !== 'taken' && (
          <View style={styles.buttonContainer}>
            <ActionButton
              title={schedule.status === 'pending' ? 'Marcar como Tomado' : 'Desmarcar'}
              onPress={() => onMarkTaken(schedule.id)}
              variant="success"
              size="sm"
            />
          </View>
        )}
        {schedule && schedule.status === 'taken' && (
          <View style={styles.buttonContainer}>
            <ActionButton
              title="Tomado"
              onPress={() => {}}
              variant="success"
              size="sm"
              disabled
            />
          </View>
        )}
        {onEdit && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => onEdit(medication)}
          >
            <Text style={{ fontSize: 18 }}>✏️</Text>
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity style={styles.iconButton} onPress={handleDelete}>
            <Text style={{ fontSize: 18 }}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
