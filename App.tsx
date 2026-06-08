import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabs } from './src/components/BottomTabs';
import { MedicineFormModal } from './src/components/MedicineFormModal';
import {
  AppSettingsProvider,
  useAppSettings,
} from './src/context/AppSettingsContext';
import { useMedicationManager } from './src/hooks/useMedicationManager';
import { AddMedicineScreen } from './src/screens/AddMedicineScreen';
import { AlarmScreen, AlarmScreenData } from './src/screens/AlarmScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { MedicinesScreen } from './src/screens/MedicinesScreen';
import { SchedulesScreen } from './src/screens/SchedulesScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import {
  registerForegroundAlarmHandler,
  setOnAlarmFired,
} from './src/services/alarmService';
import { TrackingScreen } from './src/screens/TrackingScreen';

function AppShell() {
  const { styles, statusBarStyle, statusBarBg } = useAppSettings();
  const [showSettings, setShowSettings] = useState(false);
  const [activeAlarm, setActiveAlarm] = useState<AlarmScreenData | null>(null);
  const {
    activeTab,
    setActiveTab,
    showFormModal,
    editingMedicineId,
    medicines,
    activity,
    profile,
    form,
    setForm,
    takenTodayCount,
    adherencePercent,
    todayStatusByMedication,
    missedTodayCount,
    pendingTodayCount,
    openNewForm,
    closeForm,
    openEditForm,
    saveMedicine,
    deleteMedicine,
    updateMedicineAlarm,
    markTaken,
    markMissed,
  } = useMedicationManager();

  useEffect(() => {
    const unsub = registerForegroundAlarmHandler();
    setOnAlarmFired(data => {
      const alarm: AlarmScreenData = {
        medicationId: String(data.medicationId || ''),
        medicationName: String(data.medicationName || 'Medicamento'),
        scheduledTime: String(data.scheduledTime || ''),
        dosage: String(data.dosage || ''),
        snoozeMinutes: Number(data.snoozeMinutes || 10),
        alarmSound: (String(data.alarmSound || 'default')) as AlarmScreenData['alarmSound'],
      };
      setActiveAlarm(alarm);
    });
    return () => unsub();
  }, []);

  const openSettings = () => setShowSettings(true);
  const closeSettings = () => setShowSettings(false);
  const openProfileFromSettings = () => {
    closeSettings();
    setActiveTab('tracking');
  };

  const handleTaken = useCallback((data: AlarmScreenData) => {
    const medicine = medicines.find(m => m.id === data.medicationId);
    if (medicine) {
      markTaken(medicine);
    }
    setActiveAlarm(null);
  }, [medicines, markTaken]);

  const handleSnooze = useCallback((data: AlarmScreenData) => {
    setActiveAlarm(null);
  }, []);

  return (
    <>
      {activeAlarm ? (
        <StatusBar hidden />
      ) : (
        <StatusBar
          barStyle={statusBarStyle}
          backgroundColor={statusBarBg}
          translucent={false}
        />
      )}
      <SafeAreaView edges={['top']} style={styles.container}>
        {activeTab === 'home' && (
          <HomeScreen
            medicines={medicines}
            takenTodayCount={takenTodayCount}
            adherencePercent={adherencePercent}
            missedTodayCount={missedTodayCount}
            pendingTodayCount={pendingTodayCount}
            todayStatusByMedication={todayStatusByMedication}
            onMarkTaken={markTaken}
            onMarkMissed={markMissed}
            onOpenSettings={openSettings}
            profileName={profile.fullName}
          />
        )}

        {activeTab === 'medicines' && (
          <MedicinesScreen
            medicines={medicines}
            onOpenNewForm={openNewForm}
            onOpenEditForm={openEditForm}
            onDeleteMedicine={deleteMedicine}
            onOpenSettings={openSettings}
          />
        )}

        {activeTab === 'add' && (
          <AddMedicineScreen
            form={form}
            setForm={setForm}
            onSave={saveMedicine}
          />
        )}

        {activeTab === 'schedules' && (
          <SchedulesScreen
            medicines={medicines}
            onOpenSettings={openSettings}
            onOpenEditForm={openEditForm}
            onDeleteMedicine={deleteMedicine}
            onUpdateMedicineAlarm={updateMedicineAlarm}
          />
        )}

        {activeTab === 'tracking' && (
          <TrackingScreen
            medicines={medicines}
            activities={activity}
            takenTodayCount={takenTodayCount}
            missedTodayCount={missedTodayCount}
            adherencePercent={adherencePercent}
            onOpenSettings={openSettings}
          />
        )}

        <BottomTabs activeTab={activeTab} onPress={setActiveTab} />

        <MedicineFormModal
          visible={showFormModal}
          editingMedicineId={editingMedicineId}
          form={form}
          setForm={setForm}
          onClose={closeForm}
          onSave={saveMedicine}
        />
      </SafeAreaView>

      {activeAlarm && (
        <AlarmScreen
          alarm={activeAlarm}
          onDismiss={() => setActiveAlarm(null)}
          onTaken={handleTaken}
          onSnooze={handleSnooze}
        />
      )}

      <SettingsScreen
        visible={showSettings}
        onClose={closeSettings}
        onOpenProfile={openProfileFromSettings}
      />
    </>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <AppSettingsProvider>
        <AppShell />
      </AppSettingsProvider>
    </SafeAreaProvider>
  );
}

export default App;
