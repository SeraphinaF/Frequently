export function supermemo(
  userQuality: number, // 1 (easiest) to 4 (hardest)
  prevEF: number,
  prevRepetition: number,
  prevInterval: number
) {
  const now = new Date();
  let interval: number; // in days, for backwards compatibility
  let repetition = prevRepetition;
  let ef = prevEF;

  // Map your custom intervals (in minutes)
  let intervalMs: number;

  switch (userQuality) {
    case 4: // hardest → 1 minute
      intervalMs = 1 * 60 * 1000;
      repetition = 0;
      break;
    case 3: // medium → 5 minutes
      intervalMs = 5 * 60 * 1000;
      repetition = 0;
      break;
    case 2: // easy → 10 minutes
      intervalMs = 10 * 60 * 1000;
      repetition = 0;
      break;
    case 1: // easiest → +1 day per streak
    default:
      repetition += 1;
      intervalMs = repetition * 24 * 60 * 60 * 1000; // 1 day, 2 days, etc.
      break;
  }

  const nextReviewDate = new Date(now.getTime() + intervalMs);
  interval = intervalMs / (24 * 60 * 60 * 1000); // keep interval in days for compatibility

  return {
    easinessFactor: parseFloat(ef.toFixed(2)), // preserved but not updated
    repetitionCount: repetition,
    interval,
    nextReviewDate,
    lastReviewedDate: now,
  };
}
