import { fetchTextWithRetry } from "../utils/http.js";
import { buildSubscriptionCacheKey } from "./keys.js";

export async function getCachedSubscription(env, hash) {
  return env.CACHE.get(buildSubscriptionCacheKey(hash), "json");
}

export async function putCachedSubscription(env, hash, payload) {
  const ttl = Number(env.SUB_CACHE_TTL_SECONDS || 300);
  await env.CACHE.put(buildSubscriptionCacheKey(hash), JSON.stringify(payload), {
    expirationTtl: ttl
  });
}

export async function fetchSubscription(env, url, options = {}) {
  const result = await fetchTextWithRetry(url, {
    headers: options.userAgent ? { "User-Agent": options.userAgent } : {},
    retries: options.retries ?? 2,
    timeoutMs: options.timeoutMs ?? 10_000,
    maxBytes: options.maxBytes ?? Number(env.MAX_REMOTE_FILE_SIZE || 1_048_576),
    noStore: options.noStore
  });

  return {
    body: result.text,
    subscriptionUserinfo: result.headers.get("subscription-userinfo") || ""
  };
}
