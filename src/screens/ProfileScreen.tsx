import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { INPUT_LIMITS } from '../constants/data';
import { useAppSettings } from '../context/AppSettingsContext';
import { UserProfile } from '../types/medication';
import {
  sanitizeBloodType,
  sanitizeMedicineName,
  sanitizeNotes,
  sanitizePersonName,
  sanitizePhone,
} from '../utils/inputSanitizers';

type Props = {
  visible: boolean;
  onClose: () => void;
  profile: UserProfile;
  onChange: (value: UserProfile) => void;
  onSave: () => void;
  onOpenSettings: () => void;
  profileName: string;
};

export function ProfileScreen({
  visible,
  onClose,
  profile,
  onChange,
  onSave,
  onOpenSettings,
  profileName,
}: Props) {
  const { styles: appStyles, palette } = useAppSettings();

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{flex: 1, backgroundColor: palette.bg}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <StatusBar barStyle="dark-content" backgroundColor={palette.bg} translucent={false} />
        <ScrollView contentContainerStyle={appStyles.scrollContent}>
          <View style={[appStyles.headerRow, {marginBottom: 16}]}>
            <TouchableOpacity onPress={onClose} accessibilityRole="button" accessibilityLabel="Cerrar perfil">
              <Text style={{fontFamily: 'Outfit', fontSize: 16, color: palette.primaryDark}}>Cerrar</Text>
            </TouchableOpacity>
          </View>

        <View style={appStyles.emptyCard}>
          <Text style={appStyles.inputLabel}>Nombre completo</Text>
          <TextInput
            style={appStyles.input}
            value={profile.fullName}
            maxLength={INPUT_LIMITS.PROFILE_FULL_NAME}
            autoCapitalize="words"
            onChangeText={value =>
              onChange({ ...profile, fullName: sanitizePersonName(value) })
            }
            placeholder="Ej: Maria Perez"
            placeholderTextColor={palette.placeholderText}
          />

          <Text style={appStyles.inputLabel}>Telefono</Text>
          <TextInput
            style={appStyles.input}
            value={profile.phone}
            maxLength={INPUT_LIMITS.PROFILE_PHONE}
            onChangeText={value =>
              onChange({ ...profile, phone: sanitizePhone(value) })
            }
            keyboardType="phone-pad"
            placeholder="Ej: 70000000"
            placeholderTextColor={palette.placeholderText}
          />

          <Text style={appStyles.inputLabel}>Contacto de emergencia</Text>
          <TextInput
            style={appStyles.input}
            value={profile.emergencyContact}
            maxLength={INPUT_LIMITS.PROFILE_EMERGENCY_CONTACT}
            onChangeText={value =>
              onChange({
                ...profile,
                emergencyContact: sanitizeMedicineName(value),
              })
            }
            placeholder="Nombre y telefono"
            placeholderTextColor={palette.placeholderText}
          />

          <Text style={appStyles.inputLabel}>Tipo de sangre</Text>
          <TextInput
            style={appStyles.input}
            value={profile.bloodType}
            maxLength={INPUT_LIMITS.PROFILE_BLOOD_TYPE}
            autoCapitalize="characters"
            onChangeText={value =>
              onChange({ ...profile, bloodType: sanitizeBloodType(value) })
            }
            placeholder="Ej: O+"
            placeholderTextColor={palette.placeholderText}
          />

          <Text style={appStyles.inputLabel}>Alergias</Text>
          <TextInput
            style={[appStyles.input, appStyles.notesInput]}
            value={profile.allergies}
            maxLength={INPUT_LIMITS.PROFILE_ALLERGIES}
            onChangeText={value =>
              onChange({ ...profile, allergies: sanitizeNotes(value) })
            }
            placeholder="Alergias a medicamentos o alimentos"
            placeholderTextColor={palette.placeholderText}
            multiline
          />

          <Text style={appStyles.inputLabel}>Enfermedades cronicas</Text>
          <TextInput
            style={[appStyles.input, appStyles.notesInput]}
            value={profile.chronicConditions}
            maxLength={INPUT_LIMITS.PROFILE_CHRONIC_CONDITIONS}
            onChangeText={value =>
              onChange({ ...profile, chronicConditions: sanitizeNotes(value) })
            }
            placeholder="Ej: diabetes, hipertension"
            placeholderTextColor={palette.placeholderText}
            multiline
          />

          <TouchableOpacity style={appStyles.bigButton} onPress={onSave}>
            <Text style={appStyles.bigButtonText}>GUARDAR PERFIL</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
