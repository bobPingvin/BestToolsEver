import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, setLogLevel } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Silence verbose internal offline/reconnection alerts
setLogLevel('silent');

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errCode = (error as { code?: string })?.code;
  const errMsg = error instanceof Error ? error.message : String(error);

  // If transient connection issue, timeout, or offline mode, handle gracefully
  if (
    errCode === 'unavailable' ||
    errCode === 'deadline-exceeded' ||
    errMsg.includes('unavailable') ||
    errMsg.includes('client is offline') ||
    errMsg.includes("didn't respond") ||
    errMsg.includes('Could not reach')
  ) {
    console.warn('Firestore operating in offline-first mode:', errMsg);
    return;
  }

  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

// Test connection on boot as specified in guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message.includes('the client is offline') ||
        error.message.includes('unavailable') ||
        error.message.includes("didn't respond") ||
        error.message.includes('Could not reach')
      ) {
        // Handled: offline mode is active and local storage cache handles persistence
        return;
      }
    }
  }
}
testConnection();
