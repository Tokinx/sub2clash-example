export function deepClean(value) {
  if (Array.isArray(value)) {
    const cleaned = value
      .map((item) => deepClean(item))
      .filter((item) => item !== undefined);
    return cleaned;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value)
      .map(([key, item]) => [key, deepClean(item)])
      .filter(([, item]) => {
        if (item === undefined || item === null) {
          return false;
        }
        if (Array.isArray(item) && item.length === 0) {
          return false;
        }
        if (
          typeof item === "object" &&
          !Array.isArray(item) &&
          Object.keys(item).length === 0
        ) {
          return false;
        }
        return true;
      });

    return Object.fromEntries(entries);
  }

  return value;
}

export function stableStringify(value) {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }
  const keys = Object.keys(value).sort();
  return `{${keys
    .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
    .join(",")}}`;
}
