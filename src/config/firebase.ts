import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDX1jokCW2IDRfmSuEY5ocvEPWIlkN-i0Q',
  authDomain: 'medicare-ab720.firebaseapp.com',
  projectId: 'medicare-ab720',
  storageBucket: 'medicare-ab720.firebasestorage.app',
  messagingSenderId: '372237029572',
  appId: '1:372237029572:android:81ec584bbd5b19f045b991',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firestoreDb = getFirestore(firebaseApp, 'default');
