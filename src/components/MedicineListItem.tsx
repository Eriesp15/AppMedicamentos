import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Medication } from '../types/medication';
import { Colors } from '../styles/colors';

interface MedicineListItemProps {
  medication: Medication;
  onEdit: () => void;
  onDelete: () => void;
}

export default function MedicineListItem({
  medication,
  onEdit,
  onDelete,
}: MedicineListItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>💊</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{medication.name}</Text>
        <View style={styles.row}>
          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>FRECUENCIA</Text>
            <Text style={styles.badgeValue}>
              {medication.frequency === 'cada24h' ? 'Cada 24 horas' : medication.frequency}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>DOSIS</Text>
            <Text style={styles.badgeValue}>{medication.dosage}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>HORA DE INICIO</Text>
            <Text style={styles.badgeValue}>{medication.startTime}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={onEdit}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={onDelete}
          activeOpacity={0.7}
        >
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 20,
  },
  content: {
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  row: {
    marginBottom: 8,
  },
  badge: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  badgeValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: Colors.primary,
  },
  deleteButton: {
    backgroundColor: Colors.error,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  deleteButtonText: {
    color: Colors.white,
  },
});
