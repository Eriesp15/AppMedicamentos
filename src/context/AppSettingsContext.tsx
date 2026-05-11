import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '../constants/data';
import {getThemePalette, ThemePalette} from '../constants/themePalettes';
import {createAppStyles, AppStyles} from '../styles/createAppStyles';
import {
  AppSettings,
  DEFAULT_APP_SETTINGS,
  FontSizePreset,
} from '../types/settings';

const FONT_SCALE: Record<FontSizePreset, number> = {
  normal: 1,
  large: 1.14,
  xlarge: 1.28,
};

type AppSettingsContextValue = {
  settings: AppSettings;
  palette: ThemePalette;
  styles: AppStyles;
  updateSettings: (partial: Partial<AppSettings>) => void;
  statusBarStyle: 'light-content' | 'dark-content';
  statusBarBg: string;
};

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

export function AppSettingsProvider({children}: {children: React.ReactNode}) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEYS.APP_SETTINGS).then(raw => {
      if (cancelled || !raw) {
        return;
      }
      try {
        const parsed = JSON.parse(raw) as Partial<AppSettings>;
        setSettings({...DEFAULT_APP_SETTINGS, ...parsed});
      } catch {
        /* ignore corrupt */
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings(prev => {
      const next = {...prev, ...partial};
      AsyncStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(next)).catch(
        () => {},
      );
      return next;
    });
  }, []);

  const palette = useMemo(() => getThemePalette(settings.theme), [settings.theme]);
  const fontScale = FONT_SCALE[settings.fontSize];

  const styles = useMemo(
    () =>
      createAppStyles(
        palette,
        fontScale,
        settings.largeTouchTargets,
        settings.highVisibilityBorders,
      ),
    [
      palette,
      fontScale,
      settings.largeTouchTargets,
      settings.highVisibilityBorders,
    ],
  );

  const statusBarStyle: 'light-content' | 'dark-content' =
    settings.theme === 'light' ? 'dark-content' : 'light-content';
  const statusBarBg = palette.bg;

  const value = useMemo(
    () => ({
      settings,
      palette,
      styles,
      updateSettings,
      statusBarStyle,
      statusBarBg,
    }),
    [settings, palette, styles, updateSettings, statusBarStyle, statusBarBg],
  );

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) {
    throw new Error('useAppSettings debe usarse dentro de AppSettingsProvider');
  }
  return ctx;
}
