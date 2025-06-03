import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAxb-2MbmQUMJpk_HEQcD5eKohMgGDf1zs",
  authDomain: "task-sys.firebaseapp.com",
  projectId: "task-sys",
  storageBucket: "task-sys.firebasestorage.app",
  messagingSenderId: "415895998115",
  appId: "1:415895998115:web:b13deda4bc23418c82f916",
  measurementId: "G-C92B1KGGQ6"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);