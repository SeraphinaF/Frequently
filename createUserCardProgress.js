import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function App() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        setUserId(uid);

        const cardsSnapshot = await getDocs(collection(db, 'cards'));

        for (const cardDoc of cardsSnapshot.docs) {
          const cardId = cardDoc.id;
          const progressDocRef = doc(db, 'userCardProgress', `${uid}_${cardId}`);
          const progressSnap = await getDoc(progressDocRef);

          if (!progressSnap.exists()) {
            await setDoc(progressDocRef, {
              userId: uid,
              cardId,
              easinessFactor: 2.5,
              repetitionCount: 0,
              interval: 0,
              quality: 0,
              nextReviewDate: null,
              lastReviewedDate: null
            });
            console.log(`Created progress for card ${cardId}`);
          }
        }

        console.log("All progress created.");
      }
    });

    return () => unsubscribe();
  }, []);

  return null; 
}
