import type { Tendency } from '../data/mockData';

/**
 * Calculate match rate between two users based on tendency and play tags.
 *
 * - Tendency compatibility: S-M = best, SW-any = good, S-S or M-M = low
 * - Play overlap: shared plays increase match rate
 * - Returns 0-100
 */
export function calcMatchRate(
  t1: Tendency,
  t2: Tendency,
  plays1: string[],
  plays2: string[],
): number {
  // Tendency score (0-50)
  let tendencyScore = 0;
  if ((t1 === 'S' && t2 === 'M') || (t1 === 'M' && t2 === 'S')) {
    tendencyScore = 50; // Perfect match
  } else if (t1 === 'SW' || t2 === 'SW') {
    tendencyScore = 35; // Switch is versatile
  } else if (t1 === t2) {
    tendencyScore = 15; // Same tendency = lower
  } else {
    tendencyScore = 25;
  }

  // Play overlap score (0-50)
  const shared = plays1.filter(p => plays2.includes(p));
  const totalUnique = new Set([...plays1, ...plays2]).size;
  const playScore = totalUnique > 0
    ? Math.round((shared.length / totalUnique) * 50)
    : 0;

  // Bonus for 3+ shared plays
  const bonus = shared.length >= 3 ? 10 : shared.length >= 2 ? 5 : 0;

  return Math.min(100, tendencyScore + playScore + bonus);
}
