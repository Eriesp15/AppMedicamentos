/* global jest */

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(() => ({})),
  doc: jest.fn(() => ({})),
  getDoc: jest.fn(() =>
    Promise.resolve({
      exists: () => false,
      data: () => undefined,
    }),
  ),
  getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
  getFirestore: jest.fn(() => ({})),
  orderBy: jest.fn(() => ({})),
  query: jest.fn(() => ({})),
  setDoc: jest.fn(() => Promise.resolve()),
  writeBatch: jest.fn(() => ({
    commit: jest.fn(() => Promise.resolve()),
    delete: jest.fn(),
    set: jest.fn(),
  })),
}));

jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    cancelNotification: jest.fn(() => Promise.resolve()),
    cancelTriggerNotifications: jest.fn(() => Promise.resolve()),
    createChannel: jest.fn(channel => Promise.resolve(channel.id)),
    createTriggerNotification: jest.fn(() =>
      Promise.resolve('notification-id'),
    ),
    onBackgroundEvent: jest.fn(),
    onForegroundEvent: jest.fn(() => jest.fn()),
    requestPermission: jest.fn(() => Promise.resolve({})),
  },
  AlarmType: {
    SET_EXACT_AND_ALLOW_WHILE_IDLE: 3,
  },
  AndroidCategory: {
    ALARM: 'alarm',
  },
  AndroidImportance: {
    HIGH: 4,
  },
  EventType: {
    ACTION_PRESS: 2,
  },
  RepeatFrequency: {
    DAILY: 1,
  },
  TriggerType: {
    TIMESTAMP: 0,
  },
}));
