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
  getDocs: jest.fn(() => Promise.resolve({docs: []})),
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
