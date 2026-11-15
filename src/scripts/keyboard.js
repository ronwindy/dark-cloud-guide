// Keyboard shortcuts: ←/→ page, x read, t theme, m menu, / filter, h home, Esc close.
import { pages, currentId } from './guide.js';
import { toggleTheme } from './theme.js';
import { toggleMenu } from './menu.js';
import { toggleCurrentPageRead } from './readSeal.js';

function goToNeighbour(offset) {
  const i = pages.findIndex((p) => p.id === currentId);
  const target = pages[i + offset];
  if (i > -1 && target) location.href = target.file;
}

function onKeyDown(e) {
  const tag = e.target.tagName;

  if (e.key === 'Escape') {
    if (tag === 'INPUT') e.target.blur();
    else toggleMenu(false);
    return;
  }
  if (tag === 'INPUT' || tag === 'TEXTAREA' || e.ctrlKey || e.metaKey || e.altKey) return;

  const filterInput = document.getElementById('filter');
  switch (e.key.toLowerCase()) {
    case 'arrowright': goToNeighbour(1); break;
    case 'arrowleft': goToNeighbour(-1); break;
    case 'x': toggleCurrentPageRead(); break;
    case 't': toggleTheme(); break;
    case 'm': toggleMenu(); break;
    case 'h': location.href = 'index.html'; break;
    case '/':
      if (filterInput) {
        e.preventDefault();
        filterInput.focus();
      }
      break;
  }
}

export function initKeyboard() {
  document.addEventListener('keydown', onKeyDown);
}
