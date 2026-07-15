import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Alert } from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const WEB_CLIENT_ID =
  '729177671885-dup8nr99r2cec96q05156gip3n96p25q.apps.googleusercontent.com';

// Configure Google Sign-In once at module load time so configuration is
// guaranteed before any sign-in attempt. Configuration comes from
// google-services.json automatically; we only need the WEB client id for
// ID-token verification against Firebase Auth.
GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
  offlineAccess: false,
});

// Shape we expose to the rest of the app. Derived from the Firebase Auth User
// (which is bound to a stable UID) plus the first Google providerData entry.
export interface AuthUser {
  id: string;
  email: string | null;
  name: string | null;
  photo: string | null;
  providerId: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  idToken: string | null;
  loading: boolean;
  initializing: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function mapFirebaseUser(firebaseUser: FirebaseAuthTypes.User): AuthUser {
  const googleProvider = firebaseUser.providerData.find(
    p => p.providerId === 'google.com',
  );
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    name: firebaseUser.displayName ?? googleProvider?.displayName ?? null,
    photo: firebaseUser.photoURL ?? googleProvider?.photoURL ?? null,
    providerId: googleProvider?.providerId ?? null,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Synchronous guard against double-taps. State updates lag one render, so
  // we mirror `loading` into a ref while the promise is in flight.
  const inFlightRef = useRef(false);

  // Single source of truth for session state. Firebase Auth persists the
  // session natively across app restarts, so onAuthStateChanged fires with
  // the previous user (or null) immediately on subscribe — that's how we
  // initialize. No need for an explicit signInSilently().
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async firebaseUser => {
      if (firebaseUser) {
        setUser(mapFirebaseUser(firebaseUser));
        try {
          const token = await firebaseUser.getIdToken();
          setIdToken(token);
        } catch {
          setIdToken(null);
        }
      } else {
        setUser(null);
        setIdToken(null);
      }
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const response = await GoogleSignin.signIn();
      if (response.type !== 'success' || !response.data) {
        return;
      }
      const googleIdToken = response.data.idToken;
      if (!googleIdToken) {
        throw new Error('Google Sign-In no devolvió un idToken.');
      }
      // The integration with Firebase Auth is exactly what the docs show:
      // exchange the Google idToken for a Firebase credential, then
      // signInWithCredential binds the user to a stable Firebase UID.
      const credential = auth.GoogleAuthProvider.credential(googleIdToken);
      await auth().signInWithCredential(credential);
      // onAuthStateChanged will fire and update state; nothing else to do.
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            // User cancelled — no need to show an error.
            return;
          case statusCodes.IN_PROGRESS:
            Alert.alert('Aviso', 'Ya hay un inicio de sesión en progreso.');
            return;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert(
              'Error',
              'Google Play Services no está disponible o está desactualizado.',
            );
            return;
          default:
            break;
        }
      }
      const message =
        error instanceof Error ? error.message : 'Inténtalo de nuevo.';
      Alert.alert('No se pudo iniciar sesión', message);
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('Error cerrando sesión de Google:', error);
    }
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Error cerrando sesión de Firebase:', error);
    }
    // The onAuthStateChanged listener will fire with null and clear state.
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      idToken,
      loading,
      initializing,
      signInWithGoogle,
      signOut: handleSignOut,
    }),
    [user, idToken, loading, initializing, signInWithGoogle, handleSignOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return ctx;
}
