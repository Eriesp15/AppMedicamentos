import React from 'react';
import {Text, TouchableOpacity, View, ScrollView} from 'react-native';
import {COLORS} from '../constants/theme';
import {appStyles} from '../styles/appStyles';
import {ActivityItem} from '../types/medication';
import {formatDateLabel} from '../utils/date';

type Props = {
  selectedDate: Date;
  onPreviousDay: () => void;
  onNextDay: () => void;
  activities: ActivityItem[];
};

export function HistoryScreen({
  selectedDate,
  onPreviousDay,
  onNextDay,
  activities,
}: Props) {
  return (
    <ScrollView contentContainerStyle={appStyles.scrollContent}>
      <Text style={appStyles.appTitle}>Mi Historial</Text>

      <View style={appStyles.historyDateNav}>
        <TouchableOpacity style={appStyles.navRoundButton} onPress={onPreviousDay}>
          <Text style={appStyles.navRoundButtonText}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={appStyles.historyDateText}>{formatDateLabel(selectedDate)}</Text>

        <TouchableOpacity style={appStyles.navRoundButton} onPress={onNextDay}>
          <Text style={appStyles.navRoundButtonText}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      <View style={appStyles.summaryCard}>
        <Text style={appStyles.summaryText}>
          Tomadas: {activities.filter(item => item.taken).length}
        </Text>
        <Text style={appStyles.summaryText}>
          Omitidas: {activities.filter(item => !item.taken).length}
        </Text>
      </View>

      {activities.length === 0 ? (
        <View style={appStyles.emptyCard}>
          <Text style={appStyles.emptyTitle}>Sin actividad para esta fecha</Text>
        </View>
      ) : (
        activities.map(item => (
          <View key={item.id} style={appStyles.historyCard}>
            <View>
              <Text style={appStyles.medicineName}>{item.medicationName}</Text>
              <Text style={appStyles.softText}>
                {item.dosage} - {item.scheduledTime}
              </Text>
            </View>
            <View
              style={[
                appStyles.statusPill,
                {backgroundColor: item.taken ? COLORS.green : COLORS.red},
              ]}>
              <Text style={appStyles.statusPillText}>
                {item.taken ? 'Tomada' : 'Omitida'}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}
