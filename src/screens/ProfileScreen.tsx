import React from 'react';
import {ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {appStyles} from '../styles/appStyles';
import {UserProfile} from '../types/medication';

type Props = {
  profile: UserProfile;
  onChange: (value: UserProfile) => void;
  onSave: () => void;
};

export function ProfileScreen({profile, onChange, onSave}: Props) {
  return (
    <ScrollView contentContainerStyle={appStyles.scrollContent}>
      <Text style={appStyles.appTitle}>Mi Perfil</Text>
      <Text style={appStyles.softText}>Datos personales y de salud basicos.</Text>

      <View style={appStyles.emptyCard}>
        <Text style={appStyles.inputLabel}>Nombre completo</Text>
        <TextInput
          style={appStyles.input}
          value={profile.fullName}
          onChangeText={value => onChange({...profile, fullName: value})}
          placeholder="Ej: Maria Perez"
        />

        <Text style={appStyles.inputLabel}>Edad</Text>
        <TextInput
          style={appStyles.input}
          value={profile.age}
          onChangeText={value => onChange({...profile, age: value})}
          keyboardType="numeric"
          placeholder="Ej: 68"
        />

        <Text style={appStyles.inputLabel}>Telefono</Text>
        <TextInput
          style={appStyles.input}
          value={profile.phone}
          onChangeText={value => onChange({...profile, phone: value})}
          keyboardType="phone-pad"
          placeholder="Ej: 70000000"
        />

        <Text style={appStyles.inputLabel}>Contacto de emergencia</Text>
        <TextInput
          style={appStyles.input}
          value={profile.emergencyContact}
          onChangeText={value => onChange({...profile, emergencyContact: value})}
          placeholder="Nombre y telefono"
        />

        <Text style={appStyles.inputLabel}>Tipo de sangre</Text>
        <TextInput
          style={appStyles.input}
          value={profile.bloodType}
          onChangeText={value => onChange({...profile, bloodType: value})}
          placeholder="Ej: O+"
        />

        <Text style={appStyles.inputLabel}>Alergias</Text>
        <TextInput
          style={[appStyles.input, appStyles.notesInput]}
          value={profile.allergies}
          onChangeText={value => onChange({...profile, allergies: value})}
          placeholder="Alergias a medicamentos o alimentos"
          multiline
        />

        <Text style={appStyles.inputLabel}>Enfermedades cronicas</Text>
        <TextInput
          style={[appStyles.input, appStyles.notesInput]}
          value={profile.chronicConditions}
          onChangeText={value => onChange({...profile, chronicConditions: value})}
          placeholder="Ej: diabetes, hipertension"
          multiline
        />

        <TouchableOpacity style={appStyles.bigButton} onPress={onSave}>
          <Text style={appStyles.bigButtonText}>GUARDAR PERFIL</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
