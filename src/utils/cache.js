import { getItem, setItem, hasKey } from "./localStorage";

export function getCachedData(key) {
  if (hasKey(key)) {
    const { data, expires } = getItem(key);
    if (expires > Date.now() && data) {
      return data;
    }
  }
  return null;
}

export function setCachedData(key, data, expiryTime) {
  const cacheEntry = {
    data,
    expires: Date.now() + expiryTime,
  };
  setItem(key, cacheEntry);
}
