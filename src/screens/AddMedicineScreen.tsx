import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {MedicineFormFields} from '../components/MedicineFormModal';
import {useAppSettings} from '../context/AppSettingsContext';
import {MedicationSuggestion, MedicineForm} from '../types/medication';

type Props = {
  form: MedicineForm;
  setForm: React.Dispatch<React.SetStateAction<MedicineForm>>;
  onSave: () => void;
  medicationCatalog: MedicationSuggestion[];
};

export function AddMedicineScreen({form, setForm, onSave, medicationCatalog}: Props) {
  const {styles: appStyles} = useAppSettings();

  return (
    <ScrollView
      contentContainerStyle={appStyles.scrollContent}
      keyboardShouldPersistTaps="handled">
      <View style={appStyles.headerRow}>
        <View>
          <Text style={appStyles.appTitle}>Nuevo Medicamento</Text>
          <Text style={appStyles.softText}>Completa la informacion</Text>
        </View>
      </View>

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
  );
}
