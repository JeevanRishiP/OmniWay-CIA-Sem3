import { differenceInDays } from 'date-fns';

export const FRESHNESS_THRESHOLDS = {
  FRESH_DAYS: 30,
  MODERATE_DAYS: 90
};

export const FRESHNESS_TIERS = {
  FRESH: 'fresh',
  MODERATE: 'moderate',
  STALE: 'stale',
  UNVERIFIED: 'unverified'
};

/**
 * Calculates the freshness tier for a single date
 * @param {Date|string|null} lastVerifiedAt
 * @param {Date} [referenceDate=new Date()]
 * @returns {'fresh' | 'moderate' | 'stale' | 'unverified'}
 */
export function calculateFreshnessTier(lastVerifiedAt, referenceDate = new Date()) {
  if (!lastVerifiedAt) {
    return FRESHNESS_TIERS.UNVERIFIED;
  }

  const verifiedDate = new Date(lastVerifiedAt);
  if (isNaN(verifiedDate.getTime())) {
    return FRESHNESS_TIERS.UNVERIFIED;
  }

  const daysElapsed = Math.max(0, differenceInDays(referenceDate, verifiedDate));

  if (daysElapsed < FRESHNESS_THRESHOLDS.FRESH_DAYS) {
    return FRESHNESS_TIERS.FRESH;
  }
  if (daysElapsed <= FRESHNESS_THRESHOLDS.MODERATE_DAYS) {
    return FRESHNESS_TIERS.MODERATE;
  }
  return FRESHNESS_TIERS.STALE;
}

/**
 * Calculates overall freshness score across all four features
 * @param {Record<string, { lastVerifiedAt?: Date|string|null }>} features
 * @param {Date} [referenceDate=new Date()]
 * @returns {'fresh' | 'moderate' | 'stale' | 'unverified'}
 */
export function calculateOverallFreshness(features, referenceDate = new Date()) {
  if (!features || typeof features !== 'object') {
    return FRESHNESS_TIERS.UNVERIFIED;
  }

  const featureKeys = ['ramp', 'lift', 'accessibleToilet', 'stepFreeEntrance'];
  const verifiedDates = [];

  for (const key of featureKeys) {
    const feat = features[key];
    if (feat && feat.lastVerifiedAt) {
      const d = new Date(feat.lastVerifiedAt);
      if (!isNaN(d.getTime())) {
        verifiedDates.push(d);
      }
    }
  }

  if (verifiedDates.length === 0) {
    return FRESHNESS_TIERS.UNVERIFIED;
  }

  // Find most recent verification date
  const mostRecentDate = new Date(Math.max(...verifiedDates.map((d) => d.getTime())));
  return calculateFreshnessTier(mostRecentDate, referenceDate);
}

