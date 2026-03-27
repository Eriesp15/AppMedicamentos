import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../utils/theme';
import { formatDateShort } from '../utils/dateUtils';
import { useMedications } from '../context/MedicationContext';
import { MedicationSchedule, Medication } from '../types';

interface SchedulesScreenProps {
  navigation: any;
}

export const SchedulesScreen: React.FC<SchedulesScreenProps> = ({
  navigation,
}) => {
  const { getMedicationsByDate, medications } = useMedications();
  const [schedules, setSchedules] = useState<MedicationSchedule[]>([]);
  const [selectedDate, setSelectedDate] = useState(formatDateShort(new Date()));
  const [stats, setStats] = useState({ taken: 0, pending: 0, total: 0 });

  useEffect(() => {
    loadSchedules();
  }, [selectedDate]);

  const loadSchedules = async () => {
    try {
      const data = await getMedicationsByDate(selectedDate);
      const sorted = data.sort(
        (a, b) =>
          parseInt(a.time.split(':')[0]) - parseInt(b.time.split(':')[0])
      );
      setSchedules(sorted);

      const taken = sorted.filter((s) => s.status === 'taken').length;
      const pending = sorted.filter((s) => s.status === 'pending').length;
      setStats({ taken, pending, total: sorted.length });
    } catch (error) {
      console.error('Error loading schedules:', error);
    }
  };

  const getMedicationDetails = (medicationId: string): Medication | undefined => {
    return medications.find((m) => m.id === medicationId);
  };

  const getDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = -7; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      dates.push(formatDateShort(date));
    }
    return dates;
  };

  const renderScheduleItem = ({ item }: { item: MedicationSchedule }) => {
    const medication = getMedicationDetails(item.medicationId);
    if (!medication) return null;

    const statusColor =
      item.status === 'taken'
        ? theme.colors.success
        : item.status === 'pending'
          ? theme.colors.pending
          : theme.colors.danger;

    const styles = StyleSheet.create({
      item: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginVertical: theme.spacing.sm,
        borderLeftWidth: 4,
        borderLeftColor: medication.color,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      content: {
        flex: 1,
      },
      medicationName: {
        fontSize: theme.fontSize.base,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
      },
      medicationDetails: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textLight,
        marginTop: theme.spacing.xs,
      },
      statusBadge: {
        backgroundColor: statusColor,
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
      },
      statusText: {
        color: theme.colors.white,
        fontWeight: theme.fontWeight.semibold,
        fontSize: theme.fontSize.xs,
      },
    });

    return (
      <View style={styles.item}>
        <View style={styles.content}>
          <Text style={styles.medicationName}>{medication.name}</Text>
          <Text style={styles.medicationDetails}>
            {medication.dosage} • {item.time}
          </Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {item.status === 'taken'
              ? '✓ Tomado'
              : item.status === 'pending'
                ? 'Pendiente'
                : 'No tomado'}
          </Text>
        </View>
      </View>
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
    },
    headerTitle: {
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.white,
      marginBottom: theme.spacing.md,
    },
    statsContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    statBox: {
      flex: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      alignItems: 'center',
    },
    statNumber: {
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.white,
    },
    statLabel: {
      fontSize: theme.fontSize.xs,
      color: 'rgba(255, 255, 255, 0.8)',
      marginTop: theme.spacing.xs,
    },
    datesContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.white,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    dateScrollContainer: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    dateButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    dateButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    dateButtonText: {
      fontSize: theme.fontSize.sm,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
    },
    dateButtonTextActive: {
      color: theme.colors.white,
    },
    listContainer: {
      padding: theme.spacing.md,
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
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Horarios</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.taken}</Text>
            <Text style={styles.statLabel}>Tomados</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </View>

      <View style={styles.datesContainer}>
        <Text
          style={{
            fontSize: theme.fontSize.sm,
            fontWeight: theme.fontWeight.semibold,
            color: theme.colors.text,
            marginBottom: theme.spacing.sm,
          }}
        >
          Seleccionar Fecha
        </Text>
        <View style={styles.dateScrollContainer}>
          {getDateOptions().map((date) => (
            <TouchableOpacity
              key={date}
              style={[
                styles.dateButton,
                selectedDate === date && styles.dateButtonActive,
              ]}
              onPress={() => setSelectedDate(date)}
            >
              <Text
                style={[
                  styles.dateButtonText,
                  selectedDate === date && styles.dateButtonTextActive,
                ]}
              >
                {new Date(date).toLocaleDateString('es-ES', {
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {schedules.length > 0 ? (
        <FlatList
          style={styles.listContainer}
          data={schedules}
          renderItem={renderScheduleItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No hay medicamentos programados para esta fecha
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};
