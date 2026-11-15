// "Mark as read" seal button on each page.
import { currentId } from './guide.js';
import { isRead, toggleRead } from './readState.js';
import { rebuildNavKeepScroll } from './nav.js';

const seal = document.getElementById('sealBtn');

function paintSeal() {
  if (!seal) return;
  const read = isRead(currentId);
  seal.classList.toggle('on', read);
  seal.querySelector('span').textContent = read ? 'Read ✓' : 'Mark as read';
  document.querySelector('#nav .pl.cur')?.classList.toggle('read', read);
}

/** Toggle the current page's read state (button and the "x" shortcut). Does nothing on pages without a seal. */
export function toggleCurrentPageRead() {
  if (!seal) return;
  toggleRead(currentId);
  paintSeal();
  rebuildNavKeepScroll();
}

export function initReadSeal() {
  if (!seal) return;
  seal.addEventListener('click', toggleCurrentPageRead);
  paintSeal();
}
