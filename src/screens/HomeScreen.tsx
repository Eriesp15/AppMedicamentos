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
import { calculateAdherence } from '../utils/adherence';
import { Medication } from '../types/medication';
import MedicationCard from '../components/MedicationCard';
import BottomTabBar from '../components/BottomTabBar';
import { Colors } from '../styles/colors';

type HomeScreenProps = {
  navigation: any;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { medications, getActivityToday, markTaken, markNotTaken } = useMedicationStorage();
  const [todaysTaken, setTodaysTaken] = useState(0);
  const [todaysPending, setTodaysPending] = useState(0);
  const [adherencePercent, setAdherencePercent] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadTodaysData();
    }, []),
  );

  const loadTodaysData = async () => {
    try {
      const activity = await getActivityToday();
      const taken = activity.filter((a: any) => a.taken).length;
      const total = medications.length;
      setTodaysTaken(taken);
      setTodaysPending(total - taken);

      const adherence = await calculateAdherence();
      setAdherencePercent(adherence);
    } catch (error) {
      console.error('Error loading today data:', error);
    }
  };

  const handleMarkTaken = async (medicationId: string) => {
    try {
      await markTaken(medicationId);
      loadTodaysData();
    } catch (error) {
      Alert.alert('Error', 'Could not mark medication as taken');
    }
  };

  const handleMarkNotTaken = async (medicationId: string) => {
    try {
      await markNotTaken(medicationId);
      loadTodaysData();
    } catch (error) {
      Alert.alert('Error', 'Could not update medication status');
    }
  };

  const getMedicationsForToday = () => {
    const today = new Date().toDateString();
    return medications.filter((med: Medication) => {
      const startDate = new Date(med.startDate).toDateString();
      return startDate <= today;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>MediCare</Text>
          <Text style={styles.subGreeting}>¡Hola, María!</Text>
          <TouchableOpacity
            style={styles.profileButton}
            activeOpacity={0.7}
          >
            <View style={styles.avatarCircle} />
          </TouchableOpacity>
        </View>

        {/* Date and Stats */}
        <View style={styles.dateCard}>
          <Text style={styles.dateText}>HOY ES</Text>
          <Text style={styles.dayText}>{new Date().toLocaleDateString('es-ES', { 
            weekday: 'long', 
            month: 'short',
            day: 'numeric'
          })}</Text>
        </View>

        {/* Adherence Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>RESUMEN DEL DÍA</Text>
            <Text style={styles.adherenceText}>Hoy has tomado {todaysTaken} de {medications.length} medicamentos</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${adherencePercent}%` },
                ]}
              />
            </View>
            <Text style={styles.percentText}>{Math.round(adherencePercent)}%</Text>
          </View>
        </View>

        {/* Today's Medications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medicamentos de Hoy</Text>
          {getMedicationsForToday().length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No hay medicamentos registrados</Text>
            </View>
          ) : (
            getMedicationsForToday().map((med: Medication) => (
              <MedicationCard
                key={med.id}
                medication={med}
                onMarkTaken={() => handleMarkTaken(med.id)}
                onMarkNotTaken={() => handleMarkNotTaken(med.id)}
              />
            ))
          )}

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddMedication')}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>+ AGREGAR MEDICAMENTO</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Bottom Tab Bar */}
      <BottomTabBar
        activeTab="home"
        onTabPress={(tab) => {
          if (tab === 'medicines') navigation.navigate('MyMedicines');
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
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  subGreeting: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
  },
  dateCard: {
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.white,
    opacity: 0.9,
  },
  dayText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
    marginTop: 4,
    textTransform: 'capitalize',
  },
  summaryCard: {
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  summaryContent: {
    gap: 12,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  adherenceText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.lightGray,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  percentText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  emptyState: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  addButton: {
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  spacer: {
    height: 80,
  },
});
