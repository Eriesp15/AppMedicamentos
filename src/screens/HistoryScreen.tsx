import React from 'react';
import {Text, TouchableOpacity, View, ScrollView} from 'react-native';
import {ScreenHeader} from '../components/ScreenHeader';
import {useAppSettings} from '../context/AppSettingsContext';
import {ActivityItem} from '../types/medication';
import {formatDateLabel} from '../utils/date';

type Props = {
  selectedDate: Date;
  onPreviousDay: () => void;
  onNextDay: () => void;
  activities: ActivityItem[];
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  profileName: string;
  photo: string;
};

export function HistoryScreen({
  selectedDate,
  onPreviousDay,
  onNextDay,
  activities,
  onOpenSettings,
  onOpenProfile,
  profileName,
  photo,
}: Props) {
  const {styles: appStyles, palette} = useAppSettings();
  return (
    <ScrollView contentContainerStyle={appStyles.scrollContent}>
      <ScreenHeader
        title="Mi Historial"
        profileName={profileName}
        photo={photo}
        onOpenProfile={onOpenProfile}
        onOpenSettings={onOpenSettings}
      />

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
                {item.scheduledTime}
              </Text>
            </View>
            <View
              style={[
                appStyles.statusPill,
                {backgroundColor: item.taken ? palette.green : palette.red},
              ]}>
              <Text style={appStyles.statusPillText}>
                {item.taken ? '✓ Tomada' : '⚠ Omitida'}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}
