import { NativeModules, Platform } from 'react-native';

const { AlarmLaunchModule } = NativeModules;

export function scheduleAlarmLaunch(
  timestamp: number,
  notificationId: string,
  data: {
    notificationId?: string;
    medicationId: string;
    medicationName: string;
    scheduledTime: string;
    dosage: string;
    snoozeMinutes: number;
    alarmSound: string;
  },
) {
  if (Platform.OS !== 'android' || !AlarmLaunchModule) return;
  AlarmLaunchModule.scheduleAlarm(timestamp, notificationId, data);
}

export function cancelAlarmLaunch(notificationId: string) {
  if (Platform.OS !== 'android' || !AlarmLaunchModule) return;
  AlarmLaunchModule.cancelAlarm(notificationId);
}

export function clearAlarmLaunchNotification(notificationId?: string) {
  if (Platform.OS !== 'android' || !AlarmLaunchModule || !notificationId) return;
  AlarmLaunchModule.clearAlarmNotification(notificationId);
}

export function requestSpecialAlarmPermissions() {
  if (Platform.OS !== 'android' || !AlarmLaunchModule) {
    return Promise.resolve(false);
  }

  return AlarmLaunchModule.requestSpecialAlarmPermissions();
}

export function checkOverlayPermission(): Promise<boolean> {
  if (Platform.OS !== 'android' || !AlarmLaunchModule) {
    return Promise.resolve(true);
  }
  return AlarmLaunchModule.checkOverlayPermission();
}

export function openOverlaySettings() {
  if (Platform.OS !== 'android' || !AlarmLaunchModule) return;
  AlarmLaunchModule.openOverlaySettings();
}

export function checkBatteryOptimization(): Promise<boolean> {
  if (Platform.OS !== 'android' || !AlarmLaunchModule) {
    return Promise.resolve(true);
  }
  return AlarmLaunchModule.checkBatteryOptimization();
}

export function openBatteryOptimizationSettings() {
  if (Platform.OS !== 'android' || !AlarmLaunchModule) return;
  AlarmLaunchModule.openBatteryOptimizationSettings();
}

export function checkExactAlarmPermission(): Promise<boolean> {
  if (Platform.OS !== 'android' || !AlarmLaunchModule) {
    return Promise.resolve(true);
  }
  return AlarmLaunchModule.checkExactAlarmPermission();
}

export function openExactAlarmSettings() {
  if (Platform.OS !== 'android' || !AlarmLaunchModule) return;
  AlarmLaunchModule.openExactAlarmSettings();
}

export function checkFullScreenIntentPermission(): Promise<boolean> {
  if (Platform.OS !== 'android' || !AlarmLaunchModule) {
    return Promise.resolve(true);
  }
  return AlarmLaunchModule.checkFullScreenIntentPermission();
}

export function openFullScreenIntentSettings() {
  if (Platform.OS !== 'android' || !AlarmLaunchModule) return;
  AlarmLaunchModule.openFullScreenIntentSettings();
}

export function openAppNotificationSettings() {
  if (Platform.OS !== 'android' || !AlarmLaunchModule) return;
  AlarmLaunchModule.openAppNotificationSettings();
}
