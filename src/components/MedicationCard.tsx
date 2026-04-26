import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Medication } from '../types/medication';
import { Colors } from '../styles/colors';

interface MedicationCardProps {
  medication: Medication;
  onMarkTaken: () => void;
  onMarkNotTaken: () => void;
}

export default function MedicationCard({
  medication,
  onMarkTaken,
  onMarkNotTaken,
}: MedicationCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>💊</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{medication.name}</Text>
        <View style={styles.details}>
          <Text style={styles.detailText}>{medication.dosage}</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.detailText}>{medication.startTime}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <View style={[styles.actionBadge, styles.badgeSuccess]}>
          <Text style={styles.badgeCheckmark}>✓</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: Colors.orange,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.lightOrange,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  separator: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  actions: {
    marginLeft: 12,
  },
  actionBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeSuccess: {
    backgroundColor: Colors.success,
  },
  badgeCheckmark: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
  },
});
