import React from 'react';
import {KeyboardAvoidingView, ScrollView, View} from 'react-native';
import {MedicineFormFields} from '../components/MedicineFormModal';
import {ScreenHeader} from '../components/ScreenHeader';
import {useAppSettings} from '../context/AppSettingsContext';
import {MedicationSuggestion, MedicineForm} from '../types/medication';

type Props = {
  form: MedicineForm;
  setForm: React.Dispatch<React.SetStateAction<MedicineForm>>;
  onSave: () => void;
  medicationCatalog: MedicationSuggestion[];
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  profileName: string;
  photo: string;
};

export function AddMedicineScreen({form, setForm, onSave, medicationCatalog, onOpenSettings, onOpenProfile, profileName, photo}: Props) {
  const {styles: appStyles} = useAppSettings();

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior="padding">
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={appStyles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <ScreenHeader
          title="Nuevo Medicamento"
          subtitle="Completa la informacion"
          profileName={profileName}
          photo={photo}
          onOpenProfile={onOpenProfile}
          onOpenSettings={onOpenSettings}
        />

        <View style={appStyles.formPanel}>
          <MedicineFormFields
            form={form}
            setForm={setForm}
            onSave={onSave}
            saveLabel="Guardar medicamento"
            medicationCatalog={medicationCatalog}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
