function supermemoFrom1to4(prevEF: number, prevReps: number, prevInterval: number, score: number) {

  const quality = Math.min(score + 1, 5);

  let newEF = prevEF;
  let newReps = prevReps;
  let newInterval = 1;

  if (quality >= 3) {
    if (prevReps === 0) newInterval = 1;
    else if (prevReps === 1) newInterval = 6;
    else newInterval = Math.round(prevInterval * prevEF);

    newEF = prevEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (newEF < 1.3) newEF = 1.3;

    newReps += 1;
  } else {
    newReps = 0;
    newInterval = 1;
  }

  const now = new Date();
  const nextReviewDate = new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000);

  return {
    easinessFactor: newEF,
    repetitionCount: newReps,
    interval: newInterval,
    nextReviewDate: nextReviewDate.toISOString(),
    lastReviewedDate: now.toISOString(),
  };
}
