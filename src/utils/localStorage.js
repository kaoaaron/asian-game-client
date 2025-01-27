export function setItem(key, value) {
  const data = typeof value === "object" ? JSON.stringify(value) : value;
  localStorage.setItem(key, data);
}

export function getItem(key) {
  const data = localStorage.getItem(key);
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
}

export function hasKey(key) {
  return localStorage.getItem(key) !== null;
}
