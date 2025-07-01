import { supermemo } from './supermemo';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  doc,
  collection,
  getDoc,
  updateDoc,
  getDocs,
} from 'firebase/firestore';
import { app } from './FirebaseConfig';

const auth = getAuth(app);
const db = getFirestore(app);

// --- FETCH CARDS ---
async function fetchCards() {
  const querySnapshot = await getDocs(collection(db, 'cards'));
  const cards = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  return cards;
}

// --- UPDATE PROGRESS ---
export async function updateUserCardProgress({
  userId,
  cardId,
  quality,
}: {
  userId: string;
  cardId: string;
  quality: number;
}) {
  if (!userId || !cardId) {
    console.error('Missing userId or cardId');
    return;
  }

  const progressId = `${userId}_${cardId}`;
  const docRef = doc(db, 'userCardProgress', progressId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    // console.error('No progress found for this card:', progressId);
    return;
  }

  const data = docSnap.data();

  const updated = supermemo(
    quality,
    data.easinessFactor,
    data.repetitionCount,
    data.interval
  );

  await updateDoc(docRef, {
    ...updated,
    quality,
    lastReviewedDate: new Date(),
    nextReviewDate: new Date(Date.now() + updated.interval * 24 * 60 * 60 * 1000),
    lastQuality: quality, 
  });
}

function runExampleWhenReady() {
  onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    const userId = user.uid;
    const cards = await fetchCards();

    if (cards.length === 0) {
      console.error('No cards found');
      return;
    }

    const firstCard = cards[0];

    await updateUserCardProgress({
      userId,
      cardId: firstCard.id,
      quality: 4,
    });
  });
}

runExampleWhenReady();
