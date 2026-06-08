import notifee, {
  AlarmType,
  AndroidCategory,
  AndroidImportance,
  Event,
  EventType,
  RepeatFrequency,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import { PermissionsAndroid, Platform } from 'react-native';
import { ALARM_SOUND_OPTIONS } from '../constants/data';
import {
  loadPersistedData,
  persistActivity,
} from '../storage/medicationStorage';
import { ActivityItem, Medicine } from '../types/medication';
import { AppSettings } from '../types/settings';
import { getTimeParts } from '../utils/inputSanitizers';

const ACTION_TAKEN = 'medicine-taken';
const ACTION_SNOOZE = 'medicine-snooze';
const NOTIFICATION_PREFIX = 'medicine-alarm';
type NotificationData = { [key: string]: string | number | object };

function getAlarmSound(soundId: Medicine['alarmSound']) {
  return (
    ALARM_SOUND_OPTIONS.find(option => option.id === soundId) ||
    ALARM_SOUND_OPTIONS.find(option => option.id === 'default')!
  );
}

function getDoseOffsets(frequency: string) {
  if (frequency === 'cada8h') {
    return [0, 8, 16];
  }
  if (frequency === 'cada12h') {
    return [0, 12];
  }
  return [0];
}

function getNotificationIds(medicineId: string) {
  return [0, 1, 2].map(
    index => `${NOTIFICATION_PREFIX}-${medicineId}-${index}`,
  );
}

function getNextDailyTimestamp(
  startTime: string,
  offsetHours: number,
  advanceMinutes: number,
) {
  const { hours, minutes } = getTimeParts(startTime);
  const next = new Date();
  next.setHours(hours + offsetHours, minutes - advanceMinutes, 0, 0);

  if (next.getTime() <= Date.now()) {
    next.setDate(next.getDate() + 1);
  }

  return next.getTime();
}

function createNotificationData(medicine: Medicine) {
  return {
    medicationId: medicine.id,
    medicationName: medicine.name,
    scheduledTime: medicine.startTime,
    dosage: medicine.dosage,
    snoozeMinutes: medicine.snoozeMinutes,
    alarmSound: medicine.alarmSound,
  };
}

export async function requestAlarmPermissions() {
  await notifee.requestPermission();
  if (Platform.OS === 'android' && Platform.Version >= 34) {
    try {
      await (PermissionsAndroid as any).request(
        'android.permission.USE_FULL_SCREEN_INTENT',
      );
    } catch (_) {}
  }
}

let previewTimeoutId: ReturnType<typeof setTimeout> | null = null;
const PREVIEW_NOTIFICATION_ID = 'alarm-preview';

let onAlarmCallback: ((data: Record<string, unknown>) => void) | null = null;

export function setOnAlarmFired(cb: (data: Record<string, unknown>) => void) {
  onAlarmCallback = cb;
}

export async function playAlarmPreview(soundId: Medicine['alarmSound']) {
  if (previewTimeoutId) {
    clearTimeout(previewTimeoutId);
  }
  const sound = getAlarmSound(soundId);
  const previewChannelId = `${NOTIFICATION_PREFIX}-preview`;
  await notifee.createChannel({
    id: previewChannelId,
    name: 'Preview',
    importance: AndroidImportance.HIGH,
    sound: sound.androidSound === 'default' ? 'default' : sound.androidSound,
  });
  await notifee.displayNotification({
    id: PREVIEW_NOTIFICATION_ID,
    title: '🔔 Tono de alarma',
    body: sound.label,
    android: {
      channelId: previewChannelId,
      category: AndroidCategory.ALARM,
      autoCancel: true,
      onlyAlertOnce: true,
    },
  });
  previewTimeoutId = setTimeout(async () => {
    try {
      await notifee.cancelNotification(PREVIEW_NOTIFICATION_ID);
    } catch (_) {}
  }, 2500);
}

async function ensureAlarmChannel(medicine: Medicine, settings: AppSettings) {
  const sound = getAlarmSound(medicine.alarmSound);

  return notifee.createChannel({
    id: `${NOTIFICATION_PREFIX}-v2-${sound.id}`,
    name: sound.channelName,
    importance: AndroidImportance.HIGH,
    vibration: settings.vibrationOnReminder,
    sound: sound.androidSound === 'default' ? 'default' : sound.androidSound,
  });
}

export async function cancelMedicineAlarms(medicineId: string) {
  await notifee.cancelTriggerNotifications(getNotificationIds(medicineId));
}

export async function scheduleMedicineAlarms(
  medicine: Medicine,
  settings: AppSettings,
) {
  await cancelMedicineAlarms(medicine.id);

  if (!medicine.active || !medicine.alarmEnabled) {
    return;
  }

  await requestAlarmPermissions();
  const channelId = await ensureAlarmChannel(medicine, settings);
  const sound = getAlarmSound(medicine.alarmSound);
  const offsets = getDoseOffsets(medicine.frequency);

  await Promise.all(
    offsets.map((offset, index) => {
      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: getNextDailyTimestamp(
          medicine.startTime,
          offset,
          settings.reminderMinutesBefore,
        ),
        repeatFrequency: RepeatFrequency.DAILY,
        alarmManager: {
          type: AlarmType.SET_EXACT_AND_ALLOW_WHILE_IDLE,
        },
      };

      return notifee.createTriggerNotification(
        {
          id: getNotificationIds(medicine.id)[index],
          title: `⏰ ${medicine.startTime} - ${medicine.name}`,
          body: `${medicine.dosage} ${medicine.unit} - ${medicine.foodInstruction}`,
          data: createNotificationData(medicine),
          android: {
            channelId,
            category: AndroidCategory.ALARM,
            pressAction: { id: 'open-app' },
            fullScreenAction: { id: 'default' },
            showTimestamp: true,
            loopSound: true,
            sound:
              sound.androidSound === 'default' ? 'default' : sound.androidSound,
            actions: [
              {
                title: 'Tomado',
                pressAction: { id: ACTION_TAKEN },
              },
              {
                title: `Posponer ${medicine.snoozeMinutes} min`,
                pressAction: { id: ACTION_SNOOZE },
              },
            ],
          },
          ios: {
            sound:
              sound.androidSound === 'default'
                ? 'default'
                : `${sound.androidSound}.wav`,
          },
        },
        trigger,
      );
    }),
  );
}

export async function scheduleAllMedicineAlarms(
  medicines: Medicine[],
  settings: AppSettings,
) {
  await Promise.all(
    medicines.map(medicine => scheduleMedicineAlarms(medicine, settings)),
  );
}

async function markNotificationDoseAsTaken(data: Record<string, unknown>) {
  const medicationId = String(data.medicationId || '');
  if (!medicationId) {
    return;
  }

  const persisted = await loadPersistedData();
  const todayKey = new Date().toDateString();
  const alreadyLogged = persisted.activity.some(
    item =>
      item.medicationId === medicationId &&
      new Date(item.date).toDateString() === todayKey,
  );

  if (alreadyLogged) {
    return;
  }

  const item: ActivityItem = {
    id: `${medicationId}_${Date.now()}`,
    medicationId,
    medicationName: String(data.medicationName || 'Medicamento'),
    scheduledTime: String(data.scheduledTime || ''),
    dosage: String(data.dosage || ''),
    date: new Date().toISOString(),
    taken: true,
  };

  await persistActivity([item, ...persisted.activity]);
}

async function snoozeNotification(data: Record<string, unknown>) {
  const medicationId = String(data.medicationId || '');
  const snoozeMinutes = Number(data.snoozeMinutes || 10);
  const soundId = String(
    data.alarmSound || 'default',
  ) as Medicine['alarmSound'];
  const sound = getAlarmSound(soundId);
  const channelId = await notifee.createChannel({
    id: `${NOTIFICATION_PREFIX}-v2-${sound.id}`,
    name: sound.channelName,
    importance: AndroidImportance.HIGH,
    sound: sound.androidSound === 'default' ? 'default' : sound.androidSound,
  });

  await notifee.createTriggerNotification(
    {
      id: `${NOTIFICATION_PREFIX}-${medicationId}-snooze`,
      title: `⏰ Recordatorio (${snoozeMinutes} min)`,
      body: `${String(data.medicationName || 'Medicamento')} - ${String(
        data.dosage || '',
      )}`,
      data: data as NotificationData,
      android: {
        channelId,
        category: AndroidCategory.ALARM,
        pressAction: { id: 'open-app' },
        fullScreenAction: { id: 'default' },
        showTimestamp: true,
        loopSound: true,
        sound:
          sound.androidSound === 'default' ? 'default' : sound.androidSound,
        actions: [
          {
            title: 'Tomado',
            pressAction: { id: ACTION_TAKEN },
          },
          {
            title: `Posponer ${snoozeMinutes} min`,
            pressAction: { id: ACTION_SNOOZE },
          },
        ],
      },
      ios: {
        sound:
          sound.androidSound === 'default'
            ? 'default'
            : `${sound.androidSound}.wav`,
      },
    },
    {
      type: TriggerType.TIMESTAMP,
      timestamp: Date.now() + snoozeMinutes * 60 * 1000,
      alarmManager: {
        type: AlarmType.SET_EXACT_AND_ALLOW_WHILE_IDLE,
      },
    },
  );
}

export async function handleAlarmEvent({ type, detail }: Event) {
  const notification = detail.notification;
  const data = notification?.data || {};
  const notificationId = notification?.id;

  if (type === EventType.DELIVERED && onAlarmCallback && data?.medicationId) {
    onAlarmCallback(data as Record<string, unknown>);
  }

  if (type !== EventType.ACTION_PRESS) {
    return;
  }

  if (notificationId) {
    await notifee.cancelNotification(notificationId);
  }

  if (detail.pressAction?.id === ACTION_TAKEN) {
    await markNotificationDoseAsTaken(data);
  }

  if (detail.pressAction?.id === ACTION_SNOOZE) {
    await snoozeNotification(data);
  }
}

export function registerForegroundAlarmHandler() {
  return notifee.onForegroundEvent(event => {
    handleAlarmEvent(event).catch(() => {});
  });
}

export function registerBackgroundAlarmHandler() {
  notifee.onBackgroundEvent(handleAlarmEvent);
}
