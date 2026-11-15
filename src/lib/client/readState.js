// Which pages the reader has marked as read (persisted). Read fresh each time, so every
// component script sees the same state even if bundled separately.
import { KEYS, getJSON, setJSON } from './storage.js';

/** Fired on document after the read state changes. */
export const READ_CHANGE_EVENT = 'dc:read-change';

export function readIds() {
  return getJSON(KEYS.read, []);
}

export function isRead(id) {
  return readIds().includes(id);
}

export function toggleRead(id) {
  const ids = readIds();
  const i = ids.indexOf(id);
  if (i > -1) ids.splice(i, 1);
  else ids.push(id);
  setJSON(KEYS.read, ids);
  document.dispatchEvent(new CustomEvent(READ_CHANGE_EVENT, { detail: { id } }));
}

