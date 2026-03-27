import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { theme } from '../utils/theme';
import { ActionButton } from '../components/ActionButton';
import { useUser } from '../context/UserContext';
import { UserProfile } from '../types';

interface ProfileScreenProps {
  navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({
    id: '',
    name: '',
    age: 0,
    email: '',
    phone: '',
    doctorName: '',
    doctorPhone: '',
    emergencyContact: '',
    emergencyPhone: '',
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Por favor ingrese su nombre');
      return;
    }

    const updatedUser: UserProfile = {
      ...formData,
      id: formData.id || Date.now().toString(),
    };

    await updateUser(updatedUser);
    setIsEditing(false);
    Alert.alert('Éxito', 'Perfil actualizado correctamente');
  };

  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.white,
    },
    editButton: {
      backgroundColor: theme.colors.white,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
    },
    editButtonText: {
      color: theme.colors.primary,
      fontWeight: theme.fontWeight.semibold,
      fontSize: theme.fontSize.sm,
    },
    profileIcon: {
      fontSize: 48,
      textAlign: 'center',
      marginVertical: theme.spacing.lg,
    },
    section: {
      backgroundColor: theme.colors.white,
      marginHorizontal: theme.spacing.md,
      marginVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    sectionTitle: {
      fontSize: theme.fontSize.base,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    field: {
      marginBottom: theme.spacing.md,
    },
    label: {
      fontSize: theme.fontSize.sm,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      fontSize: theme.fontSize.base,
      color: theme.colors.text,
    },
    inputDisabled: {
      backgroundColor: theme.colors.background,
      color: theme.colors.textLight,
    },
    value: {
      fontSize: theme.fontSize.base,
      color: theme.colors.text,
      paddingVertical: theme.spacing.sm,
    },
    valueEmpty: {
      color: theme.colors.textLight,
      fontStyle: 'italic',
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginTop: theme.spacing.lg,
    },
    footerPadding: {
      paddingBottom: theme.spacing.xl,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
        {!isEditing && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.profileIcon}>👤</Text>

        {/* Información Personal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Nombre Completo</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                placeholder="Ingrese su nombre"
                value={formData.name}
                onChangeText={(value) => handleChange('name', value)}
                editable={isEditing}
                placeholderTextColor={theme.colors.textLight}
              />
            ) : (
              <Text
                style={[
                  styles.value,
                  !formData.name && styles.valueEmpty,
                ]}
              >
                {formData.name || 'No especificado'}
              </Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Edad</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                placeholder="Edad"
                value={formData.age?.toString()}
                onChangeText={(value) =>
                  handleChange('age', parseInt(value) || 0)
                }
                keyboardType="numeric"
                editable={isEditing}
                placeholderTextColor={theme.colors.textLight}
              />
            ) : (
              <Text
                style={[
                  styles.value,
                  !formData.age && styles.valueEmpty,
                ]}
              >
                {formData.age || 'No especificada'} años
              </Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                keyboardType="email-address"
                editable={isEditing}
                placeholderTextColor={theme.colors.textLight}
              />
            ) : (
              <Text
                style={[
                  styles.value,
                  !formData.email && styles.valueEmpty,
                ]}
              >
                {formData.email || 'No especificado'}
              </Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Teléfono</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                placeholder="+34 600 000 000"
                value={formData.phone}
                onChangeText={(value) => handleChange('phone', value)}
                keyboardType="phone-pad"
                editable={isEditing}
                placeholderTextColor={theme.colors.textLight}
              />
            ) : (
              <Text
                style={[
                  styles.value,
                  !formData.phone && styles.valueEmpty,
                ]}
              >
                {formData.phone || 'No especificado'}
              </Text>
            )}
          </View>
        </View>

        {/* Información Médica */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Médica</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Médico</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                placeholder="Nombre del médico"
                value={formData.doctorName}
                onChangeText={(value) => handleChange('doctorName', value)}
                editable={isEditing}
                placeholderTextColor={theme.colors.textLight}
              />
            ) : (
              <Text
                style={[
                  styles.value,
                  !formData.doctorName && styles.valueEmpty,
                ]}
              >
                {formData.doctorName || 'No especificado'}
              </Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Teléfono del Médico</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                placeholder="+34 600 000 000"
                value={formData.doctorPhone}
                onChangeText={(value) => handleChange('doctorPhone', value)}
                keyboardType="phone-pad"
                editable={isEditing}
                placeholderTextColor={theme.colors.textLight}
              />
            ) : (
              <Text
                style={[
                  styles.value,
                  !formData.doctorPhone && styles.valueEmpty,
                ]}
              >
                {formData.doctorPhone || 'No especificado'}
              </Text>
            )}
          </View>
        </View>

        {/* Contacto de Emergencia */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contacto de Emergencia</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Nombre</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                placeholder="Nombre del contacto"
                value={formData.emergencyContact}
                onChangeText={(value) =>
                  handleChange('emergencyContact', value)
                }
                editable={isEditing}
                placeholderTextColor={theme.colors.textLight}
              />
            ) : (
              <Text
                style={[
                  styles.value,
                  !formData.emergencyContact && styles.valueEmpty,
                ]}
              >
                {formData.emergencyContact || 'No especificado'}
              </Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Teléfono</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                placeholder="+34 600 000 000"
                value={formData.emergencyPhone}
                onChangeText={(value) => handleChange('emergencyPhone', value)}
                keyboardType="phone-pad"
                editable={isEditing}
                placeholderTextColor={theme.colors.textLight}
              />
            ) : (
              <Text
                style={[
                  styles.value,
                  !formData.emergencyPhone && styles.valueEmpty,
                ]}
              >
                {formData.emergencyPhone || 'No especificado'}
              </Text>
            )}
          </View>
        </View>

        {isEditing && (
          <View style={[styles.section, styles.buttonContainer]}>
            <View style={{ flex: 1 }}>
              <ActionButton
                title="Cancelar"
                onPress={() => setIsEditing(false)}
                variant="secondary"
                fullWidth
              />
            </View>
            <View style={{ flex: 1 }}>
              <ActionButton
                title="Guardar"
                onPress={handleSave}
                variant="primary"
                fullWidth
              />
            </View>
          </View>
        )}

        <View style={styles.footerPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};
