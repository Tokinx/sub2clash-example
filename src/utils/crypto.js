import { encodeBase64UrlBytes } from "./base64url.js";

function toHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function sha256Hex(value) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return toHex(new Uint8Array(digest));
}

export async function hmacSha256(secret, value) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return new Uint8Array(signature);
}

export function constantTimeEqualBytes(left, right) {
  if (left.length !== right.length) {
    return false;
  }
  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left[index] ^ right[index];
  }
  return result === 0;
}

export async function constantTimeEqualStrings(left, right) {
  const [leftDigest, rightDigest] = await Promise.all([sha256Hex(left), sha256Hex(right)]);
  return constantTimeEqualBytes(
    new TextEncoder().encode(leftDigest),
    new TextEncoder().encode(rightDigest)
  );
}

export function randomId(length = 18) {
  const raw = crypto.getRandomValues(new Uint8Array(length));
  return encodeBase64UrlBytes(raw).slice(0, length);
}
