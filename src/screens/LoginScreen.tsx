import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { useAppSettings } from '../context/AppSettingsContext';
import { useAuth } from '../context/AuthContext';

const APP_NAME = 'AppMedicamentos';
const APP_TAGLINE = 'Tus medicamentos, siempre a tiempo.';

export function LoginScreen() {
  const { palette, settings } = useAppSettings();
  const { signInWithGoogle, loading } = useAuth();

  const isDarkButton =
    settings.theme === 'dark' || settings.theme === 'highContrast';

  const buttonColor = isDarkButton
    ? GoogleSigninButton.Color.Dark
    : GoogleSigninButton.Color.Light;

  const localStyles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          backgroundColor: palette.bg,
          paddingHorizontal: 24,
        },
        content: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        card: {
          backgroundColor: palette.card,
          borderRadius: 28,
          paddingVertical: 36,
          paddingHorizontal: 28,
          width: '100%',
          maxWidth: 420,
          alignItems: 'center',
          shadowColor: '#162033',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.18,
          shadowRadius: 24,
          elevation: 8,
          borderWidth: settings.highVisibilityBorders ? 2 : 1,
          borderColor: palette.line,
        },
        logoBox: {
          width: 84,
          height: 84,
          borderRadius: 22,
          backgroundColor: palette.primary,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 18,
          shadowColor: palette.primaryDark,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
          elevation: 4,
        },
        logoText: {
          fontFamily: 'Outfit-Bold',
          color: '#FFFFFF',
          fontSize: 36,
          fontWeight: 'normal',
        },
        title: {
          fontFamily: 'Outfit-Bold',
          color: palette.text,
          fontSize: 24,
          fontWeight: 'normal',
          textAlign: 'center',
          marginBottom: 6,
        },
        tagline: {
          fontFamily: 'Outfit',
          color: palette.textSoft,
          fontSize: 14,
          textAlign: 'center',
          marginBottom: 28,
          lineHeight: 20,
        },
        googleWrap: {
          width: 220,
          height: 48,
          alignItems: 'center',
          justifyContent: 'center',
        },
        divider: {
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          marginTop: 20,
          marginBottom: 10,
          gap: 10,
        },
        dividerLine: {
          flex: 1,
          height: 1,
          backgroundColor: palette.line,
        },
        dividerText: {
          fontFamily: 'Outfit',
          color: palette.textSoft,
          fontSize: 11,
          fontWeight: 'normal',
          textTransform: 'uppercase',
          letterSpacing: 1,
        },
        footerNote: {
          fontFamily: 'Outfit',
          color: palette.textSoft,
          fontSize: 12,
          textAlign: 'center',
          marginTop: 14,
          lineHeight: 18,
        },
        footerLink: {
          color: palette.primary,
          fontWeight: 'normal',
        },
        badgeRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          marginTop: 10,
        },
        badgeDot: {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: palette.green,
        },
        badgeText: {
          fontFamily: 'Outfit',
          color: palette.textSoft,
          fontSize: 11,
          fontWeight: 'normal',
        },
      }),
    [palette, settings.highVisibilityBorders],
  );

  const handlePress = useCallback(() => {
    if (!loading) {
      signInWithGoogle();
    }
  }, [loading, signInWithGoogle]);

  const statusBarStyle =
    settings.theme === 'light' ? 'dark-content' : 'light-content';

  return (
    <SafeAreaView edges={['top', 'bottom']} style={localStyles.root}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={palette.bg}
        translucent={false}
      />
      <View style={localStyles.content}>
        <View style={localStyles.card}>
          <View style={localStyles.logoBox}>
            <Text style={localStyles.logoText}>M+</Text>
          </View>

          <Text style={localStyles.title}>{APP_NAME}</Text>
          <Text style={localStyles.tagline}>{APP_TAGLINE}</Text>

          {loading ? (
            <View style={[localStyles.googleWrap, { justifyContent: 'center' }]}>
              <ActivityIndicator size="small" color={palette.primary} />
            </View>
          ) : (
            <GoogleSigninButton
              size={GoogleSigninButton.Size.Wide}
              color={buttonColor}
              onPress={handlePress}
              disabled={loading}
            />
          )}

          <View style={localStyles.divider}>
            <View style={localStyles.dividerLine} />
            <Text style={localStyles.dividerText}>Inicio seguro</Text>
            <View style={localStyles.dividerLine} />
          </View>

          <Text style={localStyles.footerNote}>
            Al continuar, aceptas nuestros{' '}
            <Text style={localStyles.footerLink}>Términos</Text> y{' '}
            <Text style={localStyles.footerLink}>Privacidad</Text>.
          </Text>

          <View style={localStyles.badgeRow}>
            <View style={localStyles.badgeDot} />
            <Text style={localStyles.badgeText}>
              Tu sesión queda guardada en este dispositivo.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
