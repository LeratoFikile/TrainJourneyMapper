export const MAX_HEARTS = 3;
export const HEART_REGENERATION_MS = 60 * 60 * 1000;

export function getActiveHeartLosses(lossTimestamps = [], now = Date.now()) {
  return (Array.isArray(lossTimestamps) ? lossTimestamps : [])
    .filter((timestamp) => Number.isFinite(timestamp) && timestamp <= now && now - timestamp < HEART_REGENERATION_MS)
    .sort((first, second) => first - second)
    .slice(-MAX_HEARTS);
}
