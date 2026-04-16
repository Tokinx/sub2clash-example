const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytesToBase64(bytes) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
}

function base64ToBytes(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

export function encodeConfigPayload(config) {
  return bytesToBase64(encoder.encode(JSON.stringify(config)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function decodeConfigPayload(payload) {
  return JSON.parse(decoder.decode(base64ToBytes(payload)));
}

export function createEmptyConfig() {
  return {
    target: "meta",
    sources: {
      subscriptions: [{ url: "", prefix: "" }],
      nodes: []
    },
    template: {
      mode: "builtin",
      value: "meta-default"
    },
    routing: {
      ruleProviders: [],
      rules: []
    },
    transforms: {
      filterRegex: "",
      replacements: []
    },
    options: {
      refresh: false,
      autoTest: false,
      lazy: false,
      sort: "nameasc",
      nodeList: false,
      ignoreCountryGroup: false,
      userAgent: "",
      useUDP: false
    }
  };
}
