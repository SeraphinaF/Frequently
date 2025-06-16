import { getDocs } from 'firebase/firestore';
import { shuffle } from 'lodash';

export default async function generateSessionCards(userCardProgressRef, cardCollectionRef, userId) {
  const now = new Date();
  console.log('generateSessionCards started for user:', userId);

  const allProgress = await getDocs(userCardProgressRef);
  console.log(`Fetched ${allProgress.size} progress documents`);

  const allCards = await getDocs(cardCollectionRef);
  console.log(`Fetched ${allCards.size} cards`);

  // Map progress keyed by progress doc id (assumed to be cardId)
  const progressMap = new Map();
  allProgress.forEach(doc => {
    progressMap.set(doc.id, doc.data());
  });

  console.log('Progress keys:', Array.from(progressMap.keys()).slice(0, 10)); // first 10 keys

  const newCards = [];
  const dueCards = [];

  allCards.forEach(doc => {
    const cardId = doc.id;
    const cardData = doc.data();

    // Lookup progress by cardId only, not userId_cardId
    const progress = progressMap.get(cardId);

    if (!progress) {
      newCards.push({ id: cardId, ...cardData });
      console.log(`Card ${cardId} is new (no progress found)`);
    } else {
      if (progress.nextReviewDate) {
        const nextReviewDate = progress.nextReviewDate.toDate();
        console.log(`Card ${cardId} next review date: ${nextReviewDate}, now: ${now}`);
        if (nextReviewDate <= now) {
          dueCards.push({ id: cardId, ...cardData });
          console.log(`Card ${cardId} is due`);
        }
      } else {
        // Missing nextReviewDate means treat as due
        console.log(`Card ${cardId} has progress but no nextReviewDate - treating as due`);
        dueCards.push({ id: cardId, ...cardData });
      }
    }
  });

  console.log(`New cards count: ${newCards.length}`);
  console.log(`Due cards count: ${dueCards.length}`);

  // Select up to 10 new and 10 due cards
  const selectedNew = shuffle(newCards).slice(0, 10);
  const selectedDue = shuffle(dueCards).slice(0, 10);

  let sessionCards = [...selectedNew, ...selectedDue];

  // Fill up to 20 cards with other cards (new or due)
  if (sessionCards.length < 20) {
    const filler = shuffle([...newCards, ...dueCards])
      .filter(c => !sessionCards.some(sel => sel.id === c.id))
      .slice(0, 20 - sessionCards.length);
    sessionCards = [...sessionCards, ...filler];
    console.log(`Added ${filler.length} filler cards`);
  }

  console.log(`Returning ${sessionCards.length} session cards`);

  return shuffle(sessionCards);
}
