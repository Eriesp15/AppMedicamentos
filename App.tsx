import React, {useState} from 'react';
import {Alert, StatusBar} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {BottomTabs} from './src/components/BottomTabs';
import {MedicineFormModal} from './src/components/MedicineFormModal';
import {AppSettingsProvider, useAppSettings} from './src/context/AppSettingsContext';
import {useMedicationManager} from './src/hooks/useMedicationManager';
import {HistoryScreen} from './src/screens/HistoryScreen';
import {HomeScreen} from './src/screens/HomeScreen';
import {MedicinesScreen} from './src/screens/MedicinesScreen';
import {ProfileScreen} from './src/screens/ProfileScreen';
import {SettingsScreen} from './src/screens/SettingsScreen';
import {TipsScreen} from './src/screens/TipsScreen';

function AppShell() {
  const {styles, statusBarStyle, statusBarBg} = useAppSettings();
  const [showSettings, setShowSettings] = useState(false);
  const {
    activeTab,
    setActiveTab,
    showFormModal,
    setShowFormModal,
    editingMedicineId,
    selectedHistoryDate,
    setSelectedHistoryDate,
    medicines,
    profile,
    setProfile,
    form,
    setForm,
    takenTodayCount,
    adherencePercent,
    selectedDateActivities,
    todayStatusByMedication,
    missedTodayCount,
    pendingTodayCount,
    openNewForm,
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
    setActiveTab('profile');
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
            onOpenNewForm={openNewForm}
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

        {activeTab === 'history' && (
          <HistoryScreen
            selectedDate={selectedHistoryDate}
            onPreviousDay={() =>
              setSelectedHistoryDate(prev => {
                const next = new Date(prev);
                next.setDate(prev.getDate() - 1);
                return next;
              })
            }
            onNextDay={() =>
              setSelectedHistoryDate(prev => {
                const next = new Date(prev);
                next.setDate(prev.getDate() + 1);
                return next;
              })
            }
            activities={selectedDateActivities}
            onOpenSettings={openSettings}
          />
        )}

        {activeTab === 'tips' && (
          <TipsScreen onOpenSettings={openSettings} />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen
            profile={profile}
            onChange={setProfile}
            onSave={() => Alert.alert('Perfil', 'Perfil guardado correctamente.')}
            onOpenSettings={openSettings}
          />
        )}

        <BottomTabs activeTab={activeTab} onPress={setActiveTab} />

        <MedicineFormModal
          visible={showFormModal}
          editingMedicineId={editingMedicineId}
          form={form}
          setForm={setForm}
          onClose={() => setShowFormModal(false)}
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
