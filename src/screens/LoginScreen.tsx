import React from 'react';
import { Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSettings } from '../context/AppSettingsContext';
import { useAuth } from '../context/AuthContext';

export function LoginScreen() {
  const { styles } = useAppSettings();
  const { signInWithGoogle, loading } = useAuth();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
        <Text style={[styles.settingsTitleMain, { fontSize: 32, marginBottom: 12, textAlign: 'center' }]}>
          AppMedicamentos
        </Text>
        <Text style={[styles.softText, { textAlign: 'center', marginBottom: 48, fontSize: 16 }]}>
          Controla tus medicamentos y recibe recordatorios a tiempo
        </Text>

        <TouchableOpacity
          style={[
            styles.bigButton,
            {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              paddingVertical: 16,
              paddingHorizontal: 24,
              minWidth: 280,
            },
          ]}
          onPress={signInWithGoogle}
          disabled={loading}
          activeOpacity={0.85}>
          {loading ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <Text style={styles.bigButtonText}>Continuar con Google</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
