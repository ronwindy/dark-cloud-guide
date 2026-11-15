// Day / night parchment theme. (The saved theme is applied before paint by an inline script in the layout.)
import { KEYS, setItem } from './storage.js';

export function toggleTheme() {
  const root = document.documentElement;
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  setItem(KEYS.theme, next);
}

export function initTheme() {
  document.getElementById('themeBtn')?.addEventListener('click', toggleTheme);
}
