// Which pages the reader has marked as read (persisted).
import { KEYS, getJSON, setJSON } from './storage.js';

const readIds = getJSON(KEYS.read, []);

export function isRead(id) {
  return readIds.includes(id);
}

export function toggleRead(id) {
  const i = readIds.indexOf(id);
  if (i > -1) readIds.splice(i, 1);
  else readIds.push(id);
  setJSON(KEYS.read, readIds);
}
