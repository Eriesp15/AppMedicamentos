// Design system and theme constants
export const theme = {
  colors: {
    primary: '#2E5BFF',
    secondary: '#FFB300',
    success: '#00C851',
    danger: '#E74C3C',
    background: '#F5F5F5',
    white: '#FFFFFF',
    text: '#333333',
    textLight: '#666666',
    border: '#E0E0E0',
    pending: '#FFB300',
    taken: '#00C851',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  fontWeight: {
    regular: '400' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
};

export const medicationColors = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E2',
];

export const frequencyOptions = [
  { label: 'Diariamente', value: 'daily' },
  { label: 'Días específicos', value: 'specific_days' },
];

export const daysOfWeek = [
  { label: 'Dom', value: 0 },
  { label: 'Lun', value: 1 },
  { label: 'Mar', value: 2 },
  { label: 'Mié', value: 3 },
  { label: 'Jue', value: 4 },
  { label: 'Vie', value: 5 },
  { label: 'Sab', value: 6 },
];
