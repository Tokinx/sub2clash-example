export const SETTINGS_KEY = "settings";

export function buildLinkKey(id) {
  return `link:${id}`;
}

export function buildSubscriptionCacheKey(hash) {
  return `cache:sub:${hash}`;
}
