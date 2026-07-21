import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSettings } from './AppSettingsContext';
import { reportError } from '../utils/errorReporter';
import { classifyError, ClassifiedError } from '../utils/errorClassifier';

export type ToastTone = 'error' | 'info' | 'success' | 'warning';

type ToastVariant = {
  id: string;
  message: string;
  tone: ToastTone;
  duration: number;
  signature: string;
};

interface ToastContextValue {
  showToast: (
    message: string,
    options?: { tone?: ToastTone; duration?: number },
  ) => void;
  dismissToast: (id?: string) => void;
  handleError: (
    err: unknown,
    source:
      | 'medicationStorage'
      | 'useMedicationManager'
      | 'alarmService'
      | 'api'
      | 'auth'
      | 'app'
      | 'unknown',
    detail?: {
      context?: string;
      toastMessage?: string;
      alertMessage?: string;
      extra?: Record<string, unknown>;
      silent?: boolean;
    },
  ) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION = 3500;
const ERROR_DURATION = 5000;

// Anti-spam: no mostrar dos toasts con la misma firma (kind|context|message)
// dentro de esta ventana para no inundar al usuario cuando está offline.
const DEDUPE_WINDOW_MS = 4000;

let toastIdCounter = 0;
function nextToastId() {
  toastIdCounter += 1;
  return `toast-${Date.now()}-${toastIdCounter}`;
}

function ToastCard({
  toast,
  duration,
  onDismiss,
}: {
  toast: ToastVariant;
  duration: number;
  onDismiss: (id: string) => void;
}) {
  const { palette } = useAppSettings();

  const tone = toast.tone;
  const accent =
    tone === 'success'
      ? palette.green
      : tone === 'warning'
        ? palette.yellow
        : tone === 'info'
          ? palette.primary
          : palette.red;

  const bg = palette.card;
  const border = palette.line;
  const text = palette.text;
  const textSoft = palette.textSoft;

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  useEffect(() => {
    const handle = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -12,
          duration: 220,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) onDismiss(toast.id);
      });
    }, duration);
    return () => clearTimeout(handle);
  }, [duration, onDismiss, opacity, toast.id, translateY]);

  const animatedStyle = {
    opacity,
    transform: [{ translateY }],
  };

  const icon =
    tone === 'success'
      ? '✓'
      : tone === 'warning'
        ? '!'
        : tone === 'info'
          ? 'i'
          : '✕';

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.host, animatedStyle]}
      accessibilityRole="alert"
      accessibilityLabel={toast.message}>
      <Pressable
        onPress={() => onDismiss(toast.id)}
        style={[
          styles.card,
          {
            backgroundColor: bg,
            borderColor: border,
            shadowColor: '#0B1326',
          },
        ]}>
        <View style={[styles.iconBubble, { backgroundColor: accent }]}>
          <Text style={[styles.iconText, { color: '#FFFFFF' }]}>
            {icon}
          </Text>
        </View>
        <View style={styles.textWrap}>
          <Text
            style={[styles.message, { color: text }]}
            numberOfLines={3}>
            {toast.message}
          </Text>
          {tone !== 'info' && (
            <Text style={[styles.subtle, { color: textSoft }]}>
              Toca para cerrar
            </Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastVariant[]>([]);
  const lastShownRef = useRef<Map<string, number>>(new Map());

  const dismissToast = useCallback((id?: string) => {
    setToasts(prev => (id ? prev.filter(t => t.id !== id) : prev.slice(1)));
  }, []);

  const showToast = useCallback(
    (
      message: string,
      options?: { tone?: ToastTone; duration?: number; signature?: string },
    ) => {
      const signature = options?.signature ?? message;
      const now = Date.now();
      const last = lastShownRef.current.get(signature);
      if (last != null && now - last < DEDUPE_WINDOW_MS) {
        return;
      }
      lastShownRef.current.set(signature, now);

      const toast: ToastVariant = {
        id: nextToastId(),
        message,
        tone: options?.tone ?? 'info',
        duration: options?.duration ?? DEFAULT_DURATION,
        signature,
      };
      setToasts(prev => {
        const next = [...prev, toast];
        if (next.length > 3) return next.slice(next.length - 3);
        return next;
      });
    },
    [],
  );

  const handleError = useCallback<ToastContextValue['handleError']>(
    (err, source, detail) => {
      const classified: ClassifiedError =
        err && typeof err === 'object' && (err as { __appError?: boolean }).__appError
          ? (err as unknown as ClassifiedError)
          : classifyError(err);

      reportError(err, {
        source,
        context: detail?.context,
        extra: detail?.extra,
      });

      if (detail?.silent) return;

      // Errores críticos siguen escalando a Alert.alert para mantener el
      // patrón híbrido solicitado (modal para errores graves, toast para
      // los transitorios).
      if (classified.severity === 'alert') {
        Alert.alert(
          classified.title,
          detail?.alertMessage ?? classified.message,
          [{text: 'Entendido', style: 'default'}],
        );
        // Aún así, mostramos un toast corto como confirmación visual.
      }

      const toastMessage = detail?.toastMessage ?? classified.message;
      const tone: ToastTone =
        classified.severity === 'alert'
          ? 'info'
          : classified.kind === 'network'
            ? 'warning'
            : 'error';

      showToast(toastMessage, {
        tone,
        duration:
          classified.severity === 'alert' ? 2500 : DEFAULT_DURATION,
        signature: `${source}|${detail?.context ?? classified.kind}`,
      });
    },
    [showToast],
  );

  const value = useMemo<ToastContextValue>(
    () => ({ showToast, dismissToast, handleError }),
    [showToast, dismissToast, handleError],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.length > 0 && (
        <SafeAreaView
          pointerEvents="box-none"
          edges={['top']}
          style={styles.hostContainer}>
          {toasts.map(toast => (
            <ToastCard
              key={toast.id}
              toast={toast}
              duration={toast.duration}
              onDismiss={dismissToast}
            />
          ))}
        </SafeAreaView>
      )}
    </ToastContext.Provider>
  );
}



export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }
  return ctx;
}

const styles = StyleSheet.create({
  hostContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 12,
  },
  host: {
    paddingHorizontal: 14,
    paddingTop: 6,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
    gap: 10,
  },
  iconBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  textWrap: {
    flex: 1,
    minWidth: 0,
  },
  message: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '600',
  },
  subtle: {
    fontSize: 11,
    marginTop: 2,
  },
});
