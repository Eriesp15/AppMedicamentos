import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import notifee from '@notifee/react-native';
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
  alarmDataFromPayload,
  cancelMedicineAlarms,
  markNotificationDoseAsTaken,
  registerForegroundAlarmHandler,
  requestAlarmPermissions,
  setOnAlarmFired,
  snoozeNotification,
} from './src/services/alarmService';
import { clearAlarmLaunchNotification } from './src/services/AlarmLaunchNative';
import { TrackingScreen } from './src/screens/TrackingScreen';

type InitialAlarmProps = Partial<AlarmScreenData> & {
  fromNativeAlarm?: boolean;
};

function AppShell({ initialAlarm }: { initialAlarm?: InitialAlarmProps }) {
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
    medicationCatalog,
    openNewForm,
    closeForm,
    openEditForm,
    saveMedicine,
    deleteMedicine,
    updateMedicineAlarm,
    markTaken,
    markMissed,
  } = useMedicationManager();

  const activeAlarmRef = useRef(activeAlarm);
  activeAlarmRef.current = activeAlarm;
  const handledInitialRef = useRef(false);

  const initialPermRef = useRef(false);

  useEffect(() => {
    if (initialPermRef.current) return;
    initialPermRef.current = true;
    requestAlarmPermissions().catch(() => {});
  }, []);

  useEffect(() => {
    const unsub = registerForegroundAlarmHandler();
    const alarmFromData = (data: Record<string, unknown>) => {
      const normalized = alarmDataFromPayload(data);
      const alarm: AlarmScreenData = {
        notificationId: String(normalized.notificationId || ''),
        medicationId: String(normalized.medicationId || ''),
        medicationName: String(normalized.medicationName || 'Medicamento'),
        scheduledTime: String(normalized.scheduledTime || ''),
        dosage: String(normalized.dosage || ''),
        snoozeMinutes: Number(normalized.snoozeMinutes || 10),
        alarmSound: String(
          normalized.alarmSound || 'default',
        ) as AlarmScreenData['alarmSound'],
      };
      setActiveAlarm(alarm);
    };
    setOnAlarmFired(alarmFromData);

    if (initialAlarm?.fromNativeAlarm && initialAlarm.medicationId) {
      alarmFromData(initialAlarm as Record<string, unknown>);
    }

    if (!handledInitialRef.current) {
      handledInitialRef.current = true;
      notifee.getInitialNotification().then(initial => {
        if (initial?.notification?.data?.medicationId) {
          alarmFromData(initial.notification.data as Record<string, unknown>);
        }
      });
    }

    const pollInterval = setInterval(async () => {
      if (activeAlarmRef.current) return;
      try {
        const displayed = await notifee.getDisplayedNotifications();
        for (const item of displayed) {
          const d = item.notification?.data;
          if (d && d.medicationId) {
            alarmFromData(d as Record<string, unknown>);
            break;
          }
        }
      } catch {}
    }, 1000);

    return () => {
      unsub();
      clearInterval(pollInterval);
    };
  }, [initialAlarm]);

  const openSettings = () => setShowSettings(true);
  const closeSettings = () => setShowSettings(false);
  const openProfileFromSettings = () => {
    closeSettings();
    setActiveTab('tracking');
  };

  const closeActiveAlarm = useCallback((data?: AlarmScreenData | null) => {
    if (data?.notificationId) {
      notifee.cancelNotification(data.notificationId).catch(() => {});
      clearAlarmLaunchNotification(data.notificationId);
    }

    if (data?.medicationId) {
      notifee
        .getDisplayedNotifications()
        .then(displayed =>
          Promise.all(
            displayed
              .filter(
                item =>
                  item.notification?.data?.medicationId === data.medicationId,
              )
              .map(item =>
                item.notification?.id
                  ? notifee.cancelNotification(item.notification.id)
                  : Promise.resolve(),
              ),
          ),
        )
        .catch(() => {});
    }

    setActiveAlarm(null);
  }, []);

  const handleTaken = useCallback((data: AlarmScreenData) => {
    const medicine = medicines.find(m => m.id === data.medicationId);
    if (medicine) {
      markTaken(medicine);
      cancelMedicineAlarms(medicine.id).catch(() => {});
    } else {
      markNotificationDoseAsTaken(data).catch(() => {});
    }
    closeActiveAlarm(data);
  }, [closeActiveAlarm, medicines, markTaken]);

  const handleSnooze = useCallback((data: AlarmScreenData) => {
    snoozeNotification(data).catch(() => {});
    closeActiveAlarm(data);
  }, [closeActiveAlarm]);

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
      <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
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
            medicationCatalog={medicationCatalog}
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
          medicationCatalog={medicationCatalog}
        />
      </SafeAreaView>

      {activeAlarm && (
        <AlarmScreen
          alarm={activeAlarm}
          onDismiss={() => closeActiveAlarm(activeAlarm)}
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

function App(props: InitialAlarmProps) {
  return (
    <SafeAreaProvider>
      <AppSettingsProvider>
        <AppShell initialAlarm={props} />
      </AppSettingsProvider>
    </SafeAreaProvider>
  );
}

export default App;
