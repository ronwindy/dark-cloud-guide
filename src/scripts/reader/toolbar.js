// "Reading aids" toolbar: collapse / expand all panels and switch back to the original layout.
import { markAdded } from './dom.js';
import { KEYS, getItem, setItem } from '../storage.js';
import { setAllPanelsOpen } from './panels.js';

function toolbarHtml(hasPanels) {
  const panelButtons = hasPanels
    ? '<button type="button" data-a="collapse">Collapse all</button><button type="button" data-a="expand">Expand all</button>'
    : '';
  return '<span class="rlabel">Reading aids</span>' + panelButtons +
    '<button type="button" data-a="plain" aria-pressed="false">Original layout</button>';
}

/**
 * Insert the toolbar above `prose`.
 * `originalHtml` is the prose markup before any enhancement; `onLayoutChange(plain)` runs after each switch.
 * Returns { setPlain(flag), restoreSavedLayout() }.
 */
export function createToolbar({ prose, originalHtml, hasPanels, onLayoutChange }) {
  const bar = markAdded(document.createElement('div'));
  bar.className = 'rbar';
  bar.innerHTML = toolbarHtml(hasPanels);
  prose.parentNode.insertBefore(bar, prose);

  let plain = false;
  let enhancedHtml = null;

  function setPlain(flag) {
    if (flag === plain) return;
    if (flag) {
      enhancedHtml = prose.innerHTML;
      prose.innerHTML = originalHtml;
    } else {
      prose.innerHTML = enhancedHtml;
    }
    plain = flag;

    document.body.classList.toggle('r-plain', flag);
    const button = bar.querySelector('[data-a=plain]');
    button.setAttribute('aria-pressed', flag ? 'true' : 'false');
    button.textContent = flag ? 'Reading aids on' : 'Original layout';
    setItem(KEYS.plainLayout, flag ? '1' : '0');
    onLayoutChange(flag);
  }

  bar.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;
    const action = button.dataset.a;
    if (action === 'plain') setPlain(!plain);
    else setAllPanelsOpen(prose, action === 'expand');
  });

  return {
    bar,
    setPlain,
    restoreSavedLayout() {
      if (getItem(KEYS.plainLayout) === '1') setPlain(true);
    },
  };
}
