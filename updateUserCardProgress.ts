import { supermemo } from './supermemo';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, collection, getDoc, updateDoc, getDocs } from 'firebase/firestore';
import { app } from './FirebaseConfig';

const firebaseConfig = {
  // your config here
};

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
  // console.log(`Updating progress for userId: ${userId}, cardId: ${cardId}, quality: ${quality}`);

  if (!userId || !cardId) {
    // console.error('Missing userId or cardId');
    return;
  }

  const progressId = `${userId}_${cardId}`;
  // console.log('Looking for userCardProgress doc with id:', progressId);

  const docRef = doc(db, 'userCardProgress', progressId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    // console.error('No progress found for this card:', progressId);
    return;
  }

  const data = docSnap.data();
  // console.log('Current progress data:', data);

  const updated = supermemo(
    quality,
    data.easinessFactor,
    data.repetitionCount,
    data.interval
  );
  // console.log('Updated progress values:', updated);

  await updateDoc(docRef, {
    ...updated,
    lastReviewedDate: new Date(),
    nextReviewDate: new Date(Date.now() + updated.interval * 24 * 60 * 60 * 1000),
  });

  // console.log('Progress successfully updated.');
}

// --- RUN EXAMPLE AFTER USER SIGN-IN ---
function runExampleWhenReady() {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      // console.error('User is not signed in.');
      return;
    }

    const userId = user.uid;
    // console.log('Current userId:', userId);

    const cards = await fetchCards();

    if (cards.length === 0) {
      // console.error('No cards found');
      return;
    }

    const firstCard = cards[0];
    // console.log('Updating progress for first card:', firstCard.id);

    await updateUserCardProgress({
      userId,
      cardId: firstCard.id,
      quality: 4,
    });
  });
}

runExampleWhenReady();
