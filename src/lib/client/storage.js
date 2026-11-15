// Safe localStorage wrappers (storage can be blocked, e.g. private mode).

export const KEYS = {
  theme: 'dc_theme',
  read: 'dc_read',
  last: 'dc_last',
  scrollPositions: 'dc_pos',
  plainLayout: 'dc_plain',
};

export function getItem(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable: ignore */
  }
}

/** Read a JSON value; returns `fallback` if missing or unparsable. */
export function getJSON(key, fallback) {
  try {
    const raw = getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function setJSON(key, value) {
  setItem(key, JSON.stringify(value));
}
