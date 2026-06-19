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
import { Platform } from 'react-native';
import { ALARM_SOUND_OPTIONS } from '../constants/data';
import {
  loadPersistedData,
  persistActivity,
} from '../storage/medicationStorage';
import { ActivityItem, Medicine } from '../types/medication';
import { AppSettings } from '../types/settings';
import { getTimeParts } from '../utils/inputSanitizers';
import {
  scheduleAlarmLaunch,
  cancelAlarmLaunch,
  clearAlarmLaunchNotification,
  requestSpecialAlarmPermissions,
} from './AlarmLaunchNative';

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

function getDoseOffsets(frequency: string, customFrequencyHours?: string) {
  if (frequency === 'cada8h') return [0, 8, 16];
  if (frequency === 'cada12h') return [0, 12];
  if (frequency === 'otra') {
    const hours = parseInt(customFrequencyHours || '', 10);
    if (hours > 0) {
      const doses: number[] = [];
      for (let offset = 0; offset < 24; offset += hours) {
        doses.push(offset);
      }
      return doses;
    }
    return [0];
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

function createNotificationData(medicine: Medicine, notificationId = '') {
  return {
    notificationId,
    medicationId: medicine.id,
    medicationName: medicine.name,
    scheduledTime: medicine.startTime,
    dosage: medicine.dosage,
    snoozeMinutes: medicine.snoozeMinutes,
    alarmSound: medicine.alarmSound,
  };
}

export function alarmDataFromPayload(
  data: Record<string, unknown>,
): Record<string, string | number> {
  return {
    notificationId: String(data.notificationId || ''),
    medicationId: String(data.medicationId || ''),
    medicationName: String(data.medicationName || 'Medicamento'),
    scheduledTime: String(data.scheduledTime || ''),
    dosage: String(data.dosage || ''),
    snoozeMinutes: Number(data.snoozeMinutes || 10),
    alarmSound: String(data.alarmSound || 'default'),
  };
}

export async function requestAlarmPermissions() {
  await notifee.requestPermission().catch(() => {});
  if (Platform.OS === 'android') {
    await requestSpecialAlarmPermissions().catch(() => {});
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
  const previewChannelId = `${NOTIFICATION_PREFIX}-preview-v3`;
  await notifee.createChannel({
    id: previewChannelId,
    name: 'Preview',
    importance: AndroidImportance.HIGH,
    sound: sound.androidSound === 'default' ? 'default' : sound.androidSound,
    bypassDnd: true,
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
    } catch {}
  }, 2500);
}

async function ensureAlarmChannel(medicine: Medicine, settings: AppSettings) {
  const sound = getAlarmSound(medicine.alarmSound);

  return notifee.createChannel({
    id: `${NOTIFICATION_PREFIX}-v3-${sound.id}`,
    name: sound.channelName,
    importance: AndroidImportance.HIGH,
    vibration: settings.vibrationOnReminder,
    sound: sound.androidSound === 'default' ? 'default' : sound.androidSound,
    bypassDnd: true,
  });
}

export async function cancelMedicineAlarms(medicineId: string) {
  const ids = getNotificationIds(medicineId);
  await Promise.all(ids.map(id => cancelAlarmLaunch(id))).catch(() => {});
  await notifee.cancelTriggerNotifications(ids).catch(() => {});
}

export async function scheduleMedicineAlarms(
  medicine: Medicine,
  settings: AppSettings,
) {
  await cancelMedicineAlarms(medicine.id);

  if (!medicine.active || !medicine.alarmEnabled) {
    return;
  }

  if (medicine.treatmentDays && medicine.createdAt) {
    const startDate = new Date(medicine.createdAt);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + medicine.treatmentDays);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    if (today.getTime() >= endDate.getTime()) {
      return;
    }
  }

  await requestAlarmPermissions().catch(() => {});
  const channelId = await ensureAlarmChannel(medicine, settings);
  const sound = getAlarmSound(medicine.alarmSound);
  const offsets = getDoseOffsets(medicine.frequency, medicine.customFrequencyHours);

  await Promise.all(
    offsets.map((offset, index) => {
      const timestamp = getNextDailyTimestamp(
        medicine.startTime,
        offset,
        settings.reminderMinutesBefore,
      );
      const notificationId = getNotificationIds(medicine.id)[index];
      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp,
        repeatFrequency: RepeatFrequency.DAILY,
        alarmManager: {
          type: AlarmType.SET_EXACT_AND_ALLOW_WHILE_IDLE,
        },
      };

      const notificationData = createNotificationData(medicine, notificationId);

      scheduleAlarmLaunch(timestamp, notificationId, notificationData);

      return notifee.createTriggerNotification(
        {
          id: getNotificationIds(medicine.id)[index],
          title: `⏰ ${medicine.startTime} - ${medicine.name}`,
          body: `${medicine.dosage} ${medicine.unit} - ${medicine.foodInstruction}`,
          data: notificationData,
          android: {
            channelId,
            category: AndroidCategory.ALARM,
            pressAction: { id: 'open-app' },
            fullScreenAction: {
              id: 'default',
              launchActivity: '.AlarmActivity',
            },

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
    medicines.map(medicine =>
      scheduleMedicineAlarms(medicine, settings).catch(() => {}),
    ),
  );
}

export async function markNotificationDoseAsTaken(data: Record<string, unknown>) {
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

export async function snoozeNotification(data: Record<string, unknown>) {
  const medicationId = String(data.medicationId || '');
  const snoozeMinutes = Number(data.snoozeMinutes || 10);
  const soundId = String(
    data.alarmSound || 'default',
  ) as Medicine['alarmSound'];
  const sound = getAlarmSound(soundId);
  const channelId = await notifee.createChannel({
    id: `${NOTIFICATION_PREFIX}-v3-${sound.id}`,
    name: sound.channelName,
    importance: AndroidImportance.HIGH,
    sound: sound.androidSound === 'default' ? 'default' : sound.androidSound,
    bypassDnd: true,
  });

  const snoozeNotificationId = `${NOTIFICATION_PREFIX}-${medicationId}-snooze`;
  const snoozeTimestamp = Date.now() + snoozeMinutes * 60 * 1000;
  const snoozeData = {
    ...(data as NotificationData),
    notificationId: snoozeNotificationId,
    medicationId,
    medicationName: String(data.medicationName || 'Medicamento'),
    scheduledTime: String(data.scheduledTime || ''),
    dosage: String(data.dosage || ''),
    snoozeMinutes,
    alarmSound: soundId,
  };

  scheduleAlarmLaunch(snoozeTimestamp, snoozeNotificationId, snoozeData);

  await notifee.createTriggerNotification(
    {
      id: snoozeNotificationId,
      title: `⏰ Recordatorio (${snoozeMinutes} min)`,
      body: `${String(data.medicationName || 'Medicamento')} - ${String(
        data.dosage || '',
      )}`,
      data: snoozeData,
      android: {
        channelId,
        category: AndroidCategory.ALARM,
        pressAction: { id: 'open-app' },
        fullScreenAction: {
          id: 'default',
          launchActivity: '.AlarmActivity',
        },
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
      timestamp: snoozeTimestamp,
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
    clearAlarmLaunchNotification(notificationId);
  }

  if (detail.pressAction?.id === ACTION_TAKEN) {
    await markNotificationDoseAsTaken(data);
    const medicationId = String(data.medicationId || '');
    if (medicationId) {
      await cancelMedicineAlarms(medicationId);
    }
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
