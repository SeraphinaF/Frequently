export function supermemo(
  quality: number,
  prevEF: number,
  prevRepetition: number,
  prevInterval: number
) {
  const now = new Date();
  let EF = prevEF;
  let repetition = prevRepetition;
  let interval = prevInterval;

  if (quality < 3) {
    repetition = 0;
    interval = 1;
  } else {
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(prevInterval * EF);
    }

    repetition += 1;
  }

  EF = EF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (EF < 1.3) EF = 1.3;

  const nextReviewDate = new Date();
  nextReviewDate.setDate(now.getDate() + interval);

  return {
    easinessFactor: EF,
    repetitionCount: repetition,
    interval,
    nextReviewDate,
    lastReviewedDate: now,
  };
}
