import React, { useEffect, useState, useFocusEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { theme } from '../utils/theme';
import { formatDateInSpanish } from '../utils/dateUtils';
import { MedicationCard } from '../components/MedicationCard';
import { ActionButton } from '../components/ActionButton';
import { useMedications } from '../context/MedicationContext';
import { Medication, MedicationSchedule } from '../types';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { getTodaysMedications, updateMedicationStatus, medications } = useMedications();
  const [todaySchedules, setTodaySchedules] = useState<MedicationSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadTodaysMedications = async () => {
    try {
      const schedules = await getTodaysMedications();
      setTodaySchedules(
        schedules.sort(
          (a, b) =>
            parseInt(a.time.split(':')[0]) - parseInt(b.time.split(':')[0])
        )
      );
    } catch (error) {
      console.error('Error loading medications:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadTodaysMedications();
    }, [])
  );

  useEffect(() => {
    loadTodaysMedications();
  }, [medications]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTodaysMedications();
    setRefreshing(false);
  };

  const handleMarkTaken = async (scheduleId: string) => {
    const schedule = todaySchedules.find((s) => s.id === scheduleId);
    if (schedule) {
      const newStatus = schedule.status === 'taken' ? 'pending' : 'taken';
      await updateMedicationStatus(scheduleId, newStatus);
      await loadTodaysMedications();
    }
  };

  const getMedicationDetails = (medicationId: string): Medication | undefined => {
    return medications.find((m) => m.id === medicationId);
  };

  const renderMedicationCard = ({ item }: { item: MedicationSchedule }) => {
    const medication = getMedicationDetails(item.medicationId);
    if (!medication) return null;

    return (
      <MedicationCard
        medication={medication}
        schedule={item}
        onMarkTaken={handleMarkTaken}
        showStatus={true}
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
    dateSection: {
      backgroundColor: theme.colors.white,
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    dateTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.primary,
      textAlign: 'center',
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
    actionsContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.white,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    actionButtonContainer: {
      flex: 1,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MediCare</Text>
        <TouchableOpacity>
          <Text style={{ fontSize: 24 }}>📋</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dateSection}>
        <Text style={styles.dateTitle}>
          Medicamentos de Hoy
        </Text>
        <Text
          style={[
            styles.dateTitle,
            { fontSize: theme.fontSize.xl, marginTop: theme.spacing.sm },
          ]}
        >
          {formatDateInSpanish(new Date())}
        </Text>
      </View>

      {todaySchedules.length > 0 ? (
        <FlatList
          style={styles.listContainer}
          data={todaySchedules}
          renderItem={renderMedicationCard}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No hay medicamentos programados para hoy
          </Text>
        </View>
      )}

      <View style={styles.actionsContainer}>
        <View style={styles.actionButtonContainer}>
          <ActionButton
            title="Agregar Medicamento"
            onPress={() => navigation.navigate('Medicamentos')}
            variant="primary"
            fullWidth
          />
        </View>
        <View style={styles.actionButtonContainer}>
          <ActionButton
            title="Ver Historial"
            onPress={() => navigation.navigate('Horarios')}
            variant="secondary"
            fullWidth
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
