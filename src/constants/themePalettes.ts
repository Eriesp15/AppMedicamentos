import {AppThemeMode} from '../types/settings';

export type ThemePalette = {
  bg: string;
  card: string;
  primary: string;
  primaryDark: string;
  orange: string;
  green: string;
  red: string;
  yellow: string;
  teal: string;
  text: string;
  textSoft: string;
  line: string;
  summaryMuted: string;
  progressTrack: string;
  metricTakenBg: string;
  metricTakenBorder: string;
  metricMissedBg: string;
  metricMissedBorder: string;
  metricPendingBg: string;
  metricPendingBorder: string;
  loggedTagBg: string;
  tabBarBg: string;
  modalCardBg: string;
  inputBg: string;
  placeholderText: string;
  cancelButtonBg: string;
  frequencyActiveBg: string;
  navButtonBg: string;
};

const LIGHT: ThemePalette = {
  bg: '#F8FAFD',
  card: '#FFFFFF',
  primary: '#1479FF',
  primaryDark: '#0062E6',
  orange: '#FF6B35',
  green: '#17C878',
  red: '#FF3B3B',
  yellow: '#FFB224',
  teal: '#17C878',
  text: '#111827',
  textSoft: '#6B7280',
  line: '#E6ECF5',
  summaryMuted: '#EAF2FF',
  progressTrack: '#E9EEF7',
  metricTakenBg: '#19C66A',
  metricTakenBorder: '#19C66A',
  metricMissedBg: '#FFF1F1',
  metricMissedBorder: '#FF3B3B',
  metricPendingBg: '#FF9F0A',
  metricPendingBorder: '#FF9F0A',
  loggedTagBg: '#F1F5F9',
  tabBarBg: '#FFFFFF',
  modalCardBg: '#FFFFFF',
  inputBg: '#F5F7FB',
  placeholderText: '#8A94A6',
  cancelButtonBg: '#EEF4FF',
  frequencyActiveBg: '#EAF3FF',
  navButtonBg: '#EEF5FF',
};

const DARK: ThemePalette = {
  bg: '#0F1219',
  card: '#1A2030',
  primary: '#6B8CFF',
  primaryDark: '#4A66D4',
  orange: '#FF9A5C',
  green: '#3DCF7A',
  red: '#FF6B6B',
  yellow: '#FFD66B',
  teal: '#2ED4CC',
  text: '#EEF2FC',
  textSoft: '#9AA6BF',
  line: '#2A3348',
  summaryMuted: '#D0DAFF',
  progressTrack: '#3D4F8C',
  metricTakenBg: '#143324',
  metricTakenBorder: '#2A6B48',
  metricMissedBg: '#3A1818',
  metricMissedBorder: '#7A3030',
  metricPendingBg: '#3A3010',
  metricPendingBorder: '#8A6A20',
  loggedTagBg: '#222A3D',
  tabBarBg: '#141A26',
  modalCardBg: '#1A2030',
  inputBg: '#141A26',
  placeholderText: '#B7C0D4',
  cancelButtonBg: '#2A3142',
  frequencyActiveBg: '#243052',
  navButtonBg: '#243052',
};

const HIGH_CONTRAST: ThemePalette = {
  bg: '#000000',
  card: '#0D0D0D',
  primary: '#FFFF00',
  primaryDark: '#CCCC00',
  orange: '#FF9900',
  green: '#00FF66',
  red: '#FF3333',
  yellow: '#FFFF00',
  teal: '#00FFFF',
  text: '#FFFFFF',
  textSoft: '#E0E0E0',
  line: '#FFFFFF',
  summaryMuted: '#000000',
  progressTrack: '#333333',
  metricTakenBg: '#003300',
  metricTakenBorder: '#00FF66',
  metricMissedBg: '#330000',
  metricMissedBorder: '#FF3333',
  metricPendingBg: '#332200',
  metricPendingBorder: '#FFCC00',
  loggedTagBg: '#1A1A1A',
  tabBarBg: '#000000',
  modalCardBg: '#0D0D0D',
  inputBg: '#000000',
  placeholderText: '#F5F5F5',
  cancelButtonBg: '#262626',
  frequencyActiveBg: '#333300',
  navButtonBg: '#333300',
};

export function getThemePalette(mode: AppThemeMode): ThemePalette {
  switch (mode) {
    case 'dark':
      return DARK;
    case 'highContrast':
      return HIGH_CONTRAST;
    default:
      return LIGHT;
  }
}
