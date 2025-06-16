export function supermemo(
  userQuality: number, // 1 (easiest) to 4 (hardest)
  prevEF: number,
  prevRepetition: number,
  prevInterval: number
) {
  const now = new Date();
  let interval: number;
  let repetition = prevRepetition;
  let ef = prevEF;

  const quality = (() => {
    switch (userQuality) {
      case 1: return 5;
      case 2: return 4;
      case 3: return 3;
      case 4: return 1;
      default: return 3; // fallback to neutral
    }
  })();

  if (quality < 3) {
    repetition = 0;
    interval = 1;
  } else {
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(prevInterval * ef);
    }
    repetition += 1;
  }

  ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (ef < 1.3) ef = 1.3;

  const nextReviewDate = new Date();
  nextReviewDate.setTime(now.getTime() + interval * 24 * 60 * 60 * 1000);

  return {
    easinessFactor: parseFloat(ef.toFixed(2)),
    repetitionCount: repetition,
    interval,
    nextReviewDate,
    lastReviewedDate: now,
  };
}
