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
