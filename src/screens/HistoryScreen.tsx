import React, { useState, useCallback, useFocusEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useMedicationStorage } from '../utils/storage';
import BottomTabBar from '../components/BottomTabBar';
import HistoryDateCard from '../components/HistoryDateCard';
import { Colors } from '../styles/colors';

type HistoryScreenProps = {
  navigation: any;
};

export default function HistoryScreen({ navigation }: HistoryScreenProps) {
  const { getActivityHistory } = useMedicationStorage();
  const [history, setHistory] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, []),
  );

  const loadHistory = async () => {
    try {
      const data = await getActivityHistory();
      setHistory(data);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const groupByDate = (activities: any[]) => {
    const grouped: { [key: string]: any[] } = {};
    activities.forEach((activity) => {
      const date = new Date(activity.date).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(activity);
    });
    return grouped;
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const groupedHistory = groupByDate(history);
  const selectedDateStr = selectedDate.toDateString();
  const todaysActivities = groupedHistory[selectedDateStr] || [];
  const takenCount = todaysActivities.filter((a: any) => a.taken).length;
  const totalMeds = todaysActivities.length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Mi Historial</Text>
          <Text style={styles.subtitle}>Historial de tus medicamentos</Text>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>RESUMEN DEL DÍA</Text>
          <Text style={styles.summaryText}>
            Hoy has tomado {takenCount} de {totalMeds} medicamentos
          </Text>
          <View style={styles.summaryProgress}>
            <View
              style={[
                styles.summaryProgressFill,
                { width: `${totalMeds > 0 ? (takenCount / totalMeds) * 100 : 0}%` },
              ]}
            />
          </View>
          <Text style={styles.summaryPercent}>
            {totalMeds > 0 ? Math.round((takenCount / totalMeds) * 100) : 0}%
          </Text>
        </View>

        {/* Date Navigation */}
        <View style={styles.dateNavigator}>
          <TouchableOpacity
            style={styles.dateArrow}
            onPress={() => changeDate(-1)}
          >
            <Text style={styles.dateArrowText}>{'<'}</Text>
          </TouchableOpacity>

          <View style={styles.dateDisplay}>
            <Text style={styles.dateDisplayText}>
              {selectedDate.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            {selectedDateStr === new Date().toDateString() && (
              <Text style={styles.todayLabel}>Hoy</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.dateArrow}
            onPress={() => changeDate(1)}
          >
            <Text style={styles.dateArrowText}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        {/* Activities List */}
        {todaysActivities.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Sin datos para este día</Text>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tomas del día</Text>
            {todaysActivities.map((activity: any, index: number) => (
              <HistoryDateCard key={index} activity={activity} />
            ))}
          </View>
        )}

        <View style={styles.spacer} />
      </ScrollView>

      {/* Bottom Tab Bar */}
      <BottomTabBar
        activeTab="history"
        onTabPress={(tab) => {
          if (tab === 'home') navigation.navigate('Home');
          if (tab === 'medicines') navigation.navigate('MyMedicines');
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
  summaryCard: {
    marginHorizontal: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    marginBottom: 20,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.white,
    opacity: 0.9,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
    marginTop: 8,
  },
  summaryProgress: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    marginTop: 12,
    overflow: 'hidden',
  },
  summaryProgressFill: {
    height: '100%',
    backgroundColor: Colors.white,
  },
  summaryPercent: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.white,
    marginTop: 8,
  },
  dateNavigator: {
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 16,
  },
  dateArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateArrowText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  dateDisplay: {
    flex: 1,
    marginHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateDisplayText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    textTransform: 'capitalize',
  },
  todayLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.accent,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  emptyState: {
    marginTop: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  spacer: {
    height: 80,
  },
});
