export type FontSizePreset = 'normal' | 'large' | 'xlarge';

export type AppThemeMode = 'light' | 'dark' | 'highContrast';

export type AlarmVolume = 'low' | 'medium' | 'high';

export type AlarmSoundId = 'gentle' | 'default' | 'classic';

export type ReminderAdvanceMinutes = 0 | 5 | 10 | 15;

export type AppSettings = {
  fontSize: FontSizePreset;
  theme: AppThemeMode;
  alarmVolume: AlarmVolume;
  alarmSound: AlarmSoundId;
  vibrationOnReminder: boolean;
  reminderMinutesBefore: ReminderAdvanceMinutes;
  largeTouchTargets: boolean;
  reduceAnimations: boolean;
  readAloudConfirmations: boolean;
  highVisibilityBorders: boolean;
  keepScreenAwakeOnReminders: boolean;
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  fontSize: 'normal',
  theme: 'light',
  alarmVolume: 'medium',
  alarmSound: 'default',
  vibrationOnReminder: true,
  reminderMinutesBefore: 5,
  largeTouchTargets: true,
  reduceAnimations: false,
  readAloudConfirmations: false,
  highVisibilityBorders: false,
  keepScreenAwakeOnReminders: false,
};
