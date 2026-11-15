// Remembers the last page and scroll position per page; keeps the outline's active heading in sync.
import { currentId } from './guide.js';
import { KEYS, getJSON, setItem, setJSON } from './storage.js';

const SAVE_DELAY_MS = 250;
const RESTORE_DELAY_MS = 60;
const SPY_OFFSET_PX = 120; // a heading counts as "current" once it scrolls above this line

function restoreScroll(positions) {
  const y = positions[currentId];
  if (y && !location.hash) setTimeout(() => window.scrollTo(0, y), RESTORE_DELAY_MS);
}

function updateScrollSpy() {
  const outline = document.getElementById('outline');
  if (!outline) return;

  let activeId = null;
  document.querySelectorAll('.prose h2[id],.prose h3[id],.prose h4[id]:not(.tier)').forEach((h) => {
    if (h.getBoundingClientRect().top < SPY_OFFSET_PX) activeId = h.id;
  });
  outline.querySelectorAll('a').forEach((a) => {
    a.classList.toggle('on', a.getAttribute('href') === `#${activeId}`);
  });
}

export function initScrollMemory() {
  if (!currentId || currentId === 'index') return;

  setItem(KEYS.last, currentId);
  const positions = getJSON(KEYS.scrollPositions, {});
  restoreScroll(positions);

  let saveTimer = null;
  window.addEventListener('scroll', () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      positions[currentId] = Math.round(window.scrollY);
      setJSON(KEYS.scrollPositions, positions);
    }, SAVE_DELAY_MS);
    updateScrollSpy();
  }, { passive: true });
}
