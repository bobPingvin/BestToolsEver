import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { CursedVictim, RitualHistoryItem } from '../types/curse';
import { BlessedSoul, BlessingHistoryItem } from '../types/blessed';

// Corrupter DB Collections
const VICTIMS_COLLECTION = 'victims';
const HISTORY_COLLECTION = 'history';

// Sanctuary DB Collections (BlessedTools)
const BLESSED_SOULS_COLLECTION = 'blessed_souls';
const BLESSING_HISTORY_COLLECTION = 'blessing_history';

// ================= CORRUPTER DB =================

// Real-time listener for Victims
export function subscribeToVictims(
  onUpdate: (victims: CursedVictim[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const colRef = collection(db, VICTIMS_COLLECTION);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const items: CursedVictim[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as CursedVictim);
        });
        onUpdate(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, VICTIMS_COLLECTION);
        if (onError) onError(error as Error);
      }
    );
    return unsubscribe;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, VICTIMS_COLLECTION);
    return () => {};
  }
}

// Real-time listener for History
export function subscribeToHistory(
  onUpdate: (history: RitualHistoryItem[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const colRef = collection(db, HISTORY_COLLECTION);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const items: RitualHistoryItem[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as RitualHistoryItem);
        });
        onUpdate(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, HISTORY_COLLECTION);
        if (onError) onError(error as Error);
      }
    );
    return unsubscribe;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, HISTORY_COLLECTION);
    return () => {};
  }
}

// Save or Update a Victim in Firestore
export async function saveVictimToFirestore(victim: CursedVictim): Promise<void> {
  const docRef = doc(db, VICTIMS_COLLECTION, victim.id);
  try {
    await setDoc(docRef, victim, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${VICTIMS_COLLECTION}/${victim.id}`);
  }
}

// Delete Victim from Firestore
export async function deleteVictimFromFirestore(victimId: string): Promise<void> {
  const docRef = doc(db, VICTIMS_COLLECTION, victimId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${VICTIMS_COLLECTION}/${victimId}`);
  }
}

// Save Ritual History to Firestore
export async function saveHistoryToFirestore(item: RitualHistoryItem): Promise<void> {
  const docRef = doc(db, HISTORY_COLLECTION, item.id);
  try {
    await setDoc(docRef, item);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${HISTORY_COLLECTION}/${item.id}`);
  }
}

// ================= SANCTUARY DB (BLESSEDTOOLS) =================

// Real-time listener for Blessed Souls
export function subscribeToBlessedSouls(
  onUpdate: (souls: BlessedSoul[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const colRef = collection(db, BLESSED_SOULS_COLLECTION);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const items: BlessedSoul[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as BlessedSoul);
        });
        onUpdate(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, BLESSED_SOULS_COLLECTION);
        if (onError) onError(error as Error);
      }
    );
    return unsubscribe;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, BLESSED_SOULS_COLLECTION);
    return () => {};
  }
}

// Save or Update Blessed Soul in Firestore
export async function saveBlessedSoulToFirestore(soul: BlessedSoul): Promise<void> {
  const docRef = doc(db, BLESSED_SOULS_COLLECTION, soul.id);
  try {
    await setDoc(docRef, soul, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${BLESSED_SOULS_COLLECTION}/${soul.id}`);
  }
}

// Delete Blessed Soul from Firestore
export async function deleteBlessedSoulFromFirestore(soulId: string): Promise<void> {
  const docRef = doc(db, BLESSED_SOULS_COLLECTION, soulId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${BLESSED_SOULS_COLLECTION}/${soulId}`);
  }
}

// Real-time listener for Blessing History
export function subscribeToBlessingHistory(
  onUpdate: (history: BlessingHistoryItem[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const colRef = collection(db, BLESSING_HISTORY_COLLECTION);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const items: BlessingHistoryItem[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as BlessingHistoryItem);
        });
        onUpdate(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, BLESSING_HISTORY_COLLECTION);
        if (onError) onError(error as Error);
      }
    );
    return unsubscribe;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, BLESSING_HISTORY_COLLECTION);
    return () => {};
  }
}

// Save Blessing History to Firestore
export async function saveBlessingHistoryToFirestore(item: BlessingHistoryItem): Promise<void> {
  const docRef = doc(db, BLESSING_HISTORY_COLLECTION, item.id);
  try {
    await setDoc(docRef, item);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${BLESSING_HISTORY_COLLECTION}/${item.id}`);
  }
}
