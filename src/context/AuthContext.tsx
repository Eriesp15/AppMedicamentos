import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(
      (firebaseUser: FirebaseAuthTypes.User | null) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();

      if (signInResult.data?.idToken) {
        const googleCredential = auth.GoogleAuthProvider.credential(
          signInResult.data.idToken,
        );
        await auth().signInWithCredential(googleCredential);
      } else {
        throw new Error('No ID token found');
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            Alert.alert('Cancelado', 'Has cancelado el inicio de sesión con Google');
            break;
          case statusCodes.IN_PROGRESS:
            Alert.alert('En proceso', 'El inicio de sesión ya está en progreso');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert('Error', 'Los servicios de Google Play no están disponibles');
            break;
          default:
            Alert.alert('Error', 'Error al iniciar sesión con Google');
            console.error('Google sign-in error:', error);
        }
      } else {
        Alert.alert('Error', 'Error desconocido al iniciar sesión con Google');
        console.error('Google sign-in error:', error);
      }
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      const authError = error as { code: string };
      switch (authError.code) {
        case 'auth/invalid-email':
          Alert.alert('Error', 'Correo electrónico inválido');
          break;
        case 'auth/user-not-found':
          Alert.alert('Error', 'Usuario no encontrado');
          break;
        case 'auth/wrong-password':
          Alert.alert('Error', 'Contraseña incorrecta');
          break;
        case 'auth/too-many-requests':
          Alert.alert('Error', 'Demasiados intentos fallidos. Intenta más tarde');
          break;
        default:
          Alert.alert('Error', 'Error al iniciar sesión');
      }
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      await auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      const authError = error as { code: string };
      switch (authError.code) {
        case 'auth/email-already-in-use':
          Alert.alert('Error', 'Este correo electrónico ya está en uso');
          break;
        case 'auth/invalid-email':
          Alert.alert('Error', 'Correo electrónico inválido');
          break;
        case 'auth/weak-password':
          Alert.alert('Error', 'La contraseña es demasiado débil');
          break;
        default:
          Alert.alert('Error', 'Error al crear cuenta');
      }
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      try {
        await GoogleSignin.signOut();
      } catch {
        // El usuario podría no haber iniciado sesión con Google; ignorar.
      }
      await auth().signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const value: AuthContextValue = {
    user,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut: handleSignOut,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
