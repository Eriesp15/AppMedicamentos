import React from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';
import { Colors } from '../styles/colors';

interface HistoryDateCardProps {
  activity: {
    medicationName: string;
    dosage: string;
    scheduledTime: string;
    actualTime?: string;
    taken: boolean;
  };
}

export default function HistoryDateCard({ activity }: HistoryDateCardProps) {
  return (
    <View style={[
      styles.card,
      activity.taken ? styles.cardTaken : styles.cardMissed,
    ]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>💊</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{activity.medicationName}</Text>
        <View style={styles.details}>
          <Text style={styles.dosage}>{activity.dosage}</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.time}>{activity.scheduledTime}</Text>
        </View>
      </View>

      <View style={styles.statusContainer}>
        {activity.taken ? (
          <View style={styles.statusTaken}>
            <Text style={styles.statusCheckmark}>✓</Text>
          </View>
        ) : (
          <View style={styles.statusMissed}>
            <Text style={styles.statusX}>✕</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderLeftWidth: 4,
  },
  cardTaken: {
    backgroundColor: '#F0FFF0',
    borderLeftColor: Colors.success,
  },
  cardMissed: {
    backgroundColor: '#FFF5F5',
    borderLeftColor: Colors.error,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 18,
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
  dosage: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  separator: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  time: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  statusContainer: {
    marginLeft: 12,
  },
  statusTaken: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusCheckmark: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
  },
  statusMissed: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusX: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
  },
});
