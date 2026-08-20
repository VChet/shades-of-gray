function isValidJSON(payload) {
  try {
    JSON.parse(payload);
    return true;
  } catch {
    return false;
  }
}

export function readValue(key, defaultValue) {
  const value = localStorage.getItem(key);
  if (!value || !isValidJSON(value)) return defaultValue;
  return JSON.parse(value);
}

export function writeValue(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeValue(key) {
  localStorage.removeItem(key);
}
