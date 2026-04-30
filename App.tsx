import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {BottomTabs} from './src/components/BottomTabs';
import {MedicineFormModal} from './src/components/MedicineFormModal';
import {useMedicationManager} from './src/hooks/useMedicationManager';
import {HistoryScreen} from './src/screens/HistoryScreen';
import {HomeScreen} from './src/screens/HomeScreen';
import {MedicinesScreen} from './src/screens/MedicinesScreen';
import {ProfileScreen} from './src/screens/ProfileScreen';
import {TipsScreen} from './src/screens/TipsScreen';
import {appStyles} from './src/styles/appStyles';
import {COLORS} from './src/constants/theme';
import {Alert} from 'react-native';

function App() {
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
    openNewForm,
    openEditForm,
    saveMedicine,
    deleteMedicine,
    markTaken,
    markMissed,
  } = useMedicationManager();

  return (
    <SafeAreaView style={appStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {activeTab === 'home' && (
        <HomeScreen
          medicines={medicines}
          takenTodayCount={takenTodayCount}
          adherencePercent={adherencePercent}
          onMarkTaken={markTaken}
          onMarkMissed={markMissed}
          onOpenNewForm={openNewForm}
          onOpenProfile={() => setActiveTab('profile')}
          profileName={profile.fullName}
        />
      )}

      {activeTab === 'medicines' && (
        <MedicinesScreen
          medicines={medicines}
          onOpenNewForm={openNewForm}
          onOpenEditForm={openEditForm}
          onDeleteMedicine={deleteMedicine}
          onOpenProfile={() => setActiveTab('profile')}
          profileName={profile.fullName}
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
          onOpenProfile={() => setActiveTab('profile')}
          profileName={profile.fullName}
        />
      )}

      {activeTab === 'tips' && (
        <TipsScreen
          onOpenProfile={() => setActiveTab('profile')}
          profileName={profile.fullName}
        />
      )}

      {activeTab === 'profile' && (
        <ProfileScreen
          profile={profile}
          onChange={setProfile}
          onSave={() => Alert.alert('Perfil', 'Perfil guardado correctamente.')}
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
  );
}

export default App;