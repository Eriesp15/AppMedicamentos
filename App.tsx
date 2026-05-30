import React, {useState} from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {BottomTabs} from './src/components/BottomTabs';
import {MedicineFormModal} from './src/components/MedicineFormModal';
import {AppSettingsProvider, useAppSettings} from './src/context/AppSettingsContext';
import {useMedicationManager} from './src/hooks/useMedicationManager';
import {AddMedicineScreen} from './src/screens/AddMedicineScreen';
import {HomeScreen} from './src/screens/HomeScreen';
import {MedicinesScreen} from './src/screens/MedicinesScreen';
import {SchedulesScreen} from './src/screens/SchedulesScreen';
import {SettingsScreen} from './src/screens/SettingsScreen';
import {TrackingScreen} from './src/screens/TrackingScreen';

function AppShell() {
  const {styles, statusBarStyle, statusBarBg} = useAppSettings();
  const [showSettings, setShowSettings] = useState(false);
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
    markTaken,
    markMissed,
  } = useMedicationManager();

  const openSettings = () => setShowSettings(true);
  const closeSettings = () => setShowSettings(false);
  const openProfileFromSettings = () => {
    closeSettings();
    setActiveTab('tracking');
  };

  return (
    <>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={statusBarBg}
        translucent={false}
      />
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
          <SchedulesScreen medicines={medicines} onOpenSettings={openSettings} />
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
