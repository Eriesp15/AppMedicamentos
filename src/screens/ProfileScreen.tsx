import React from 'react';
import {ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {SettingsHeaderButton} from '../components/SettingsHeaderButton';
import {INPUT_LIMITS} from '../constants/data';
import {useAppSettings} from '../context/AppSettingsContext';
import {UserProfile} from '../types/medication';

type Props = {
  profile: UserProfile;
  onChange: (value: UserProfile) => void;
  onSave: () => void;
  onOpenSettings: () => void;
};

export function ProfileScreen({profile, onChange, onSave, onOpenSettings}: Props) {
  const {styles: appStyles, palette} = useAppSettings();
  return (
    <ScrollView contentContainerStyle={appStyles.scrollContent}>
      <View style={appStyles.headerRow}>
        <Text style={appStyles.appTitle}>Mi Perfil</Text>
        <SettingsHeaderButton onPress={onOpenSettings} />
      </View>
      <Text style={appStyles.softText}>Datos personales y de salud basicos.</Text>

      <View style={appStyles.emptyCard}>
        <Text style={appStyles.inputLabel}>Nombre completo</Text>
        <TextInput
          style={appStyles.input}
          value={profile.fullName}
          maxLength={INPUT_LIMITS.PROFILE_FULL_NAME}
          onChangeText={value => onChange({...profile, fullName: value})}
          placeholder="Ej: Maria Perez"
          placeholderTextColor={palette.placeholderText}
        />

        <Text style={appStyles.inputLabel}>Edad</Text>
        <TextInput
          style={appStyles.input}
          value={profile.age}
          maxLength={INPUT_LIMITS.PROFILE_AGE}
          onChangeText={value => onChange({...profile, age: value})}
          keyboardType="numeric"
          placeholder="Ej: 68"
          placeholderTextColor={palette.placeholderText}
        />

        <Text style={appStyles.inputLabel}>Telefono</Text>
        <TextInput
          style={appStyles.input}
          value={profile.phone}
          maxLength={INPUT_LIMITS.PROFILE_PHONE}
          onChangeText={value => onChange({...profile, phone: value})}
          keyboardType="phone-pad"
          placeholder="Ej: 70000000"
          placeholderTextColor={palette.placeholderText}
        />

        <Text style={appStyles.inputLabel}>Contacto de emergencia</Text>
        <TextInput
          style={appStyles.input}
          value={profile.emergencyContact}
          maxLength={INPUT_LIMITS.PROFILE_EMERGENCY_CONTACT}
          onChangeText={value => onChange({...profile, emergencyContact: value})}
          placeholder="Nombre y telefono"
          placeholderTextColor={palette.placeholderText}
        />

        <Text style={appStyles.inputLabel}>Tipo de sangre</Text>
        <TextInput
          style={appStyles.input}
          value={profile.bloodType}
          maxLength={INPUT_LIMITS.PROFILE_BLOOD_TYPE}
          onChangeText={value => onChange({...profile, bloodType: value})}
          placeholder="Ej: O+"
          placeholderTextColor={palette.placeholderText}
        />

        <Text style={appStyles.inputLabel}>Alergias</Text>
        <TextInput
          style={[appStyles.input, appStyles.notesInput]}
          value={profile.allergies}
          maxLength={INPUT_LIMITS.PROFILE_ALLERGIES}
          onChangeText={value => onChange({...profile, allergies: value})}
          placeholder="Alergias a medicamentos o alimentos"
          placeholderTextColor={palette.placeholderText}
          multiline
        />

        <Text style={appStyles.inputLabel}>Enfermedades cronicas</Text>
        <TextInput
          style={[appStyles.input, appStyles.notesInput]}
          value={profile.chronicConditions}
          maxLength={INPUT_LIMITS.PROFILE_CHRONIC_CONDITIONS}
          onChangeText={value => onChange({...profile, chronicConditions: value})}
          placeholder="Ej: diabetes, hipertension"
          placeholderTextColor={palette.placeholderText}
          multiline
        />

        <TouchableOpacity style={appStyles.bigButton} onPress={onSave}>
          <Text style={appStyles.bigButtonText}>GUARDAR PERFIL</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
