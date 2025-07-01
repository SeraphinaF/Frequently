import { getDocs } from 'firebase/firestore';
import { shuffle } from 'lodash';

export default async function generateSessionCards(userCardProgressRef, cardCollectionRef, userId) {
  const now = new Date();

  const allProgress = await getDocs(userCardProgressRef);
  const allCards = await getDocs(cardCollectionRef);

  const progressMap = new Map();
  allProgress.forEach(doc => {
    progressMap.set(doc.id, doc.data());
  });

  const newCards = [];
  const dueCards = [];

  allCards.forEach(doc => {
    const cardId = doc.id;
    const cardData = doc.data();
    const progress = progressMap.get(cardId);

    if (!progress) {
      newCards.push({ id: cardId, ...cardData });
    } else {
      if (progress.nextReviewDate) {
        const nextReviewDate = progress.nextReviewDate.toDate();
        if (nextReviewDate <= now) {
          dueCards.push({ id: cardId, ...cardData });
        }
      } else {
        dueCards.push({ id: cardId, ...cardData });
      }
    }
  });

  const selectedNew = shuffle(newCards).slice(0, 10);
  const selectedDue = shuffle(dueCards).slice(0, 10);
  let sessionCards = [...selectedNew, ...selectedDue];

  if (sessionCards.length < 20) {
    const filler = shuffle([...newCards, ...dueCards])
      .filter(c => !sessionCards.some(sel => sel.id === c.id))
      .slice(0, 20 - sessionCards.length);
    sessionCards = [...sessionCards, ...filler];
  }

  const queue = shuffle(sessionCards);

  return {
    getNextCard() {
      return queue.length > 0 ? queue.shift() : null;
    },

    getFeedback(cardId, quality, cardData) {
      if (quality === 4 || quality === 6) {
        const position = quality === 4 ? 4 : 6;
        const insertAt = Math.min(position, queue.length);
        queue.splice(insertAt, 0, cardData); // insert card at the desired index
      }
    },

    getQueueLength() {
      return queue.length;
    },
  };
}
