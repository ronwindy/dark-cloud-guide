// Readability layer: restructures the layout only, never the wording.
// Loaded by <ReaderLayer> on pages that do not opt out with <GuidePage reader={false}>.
// Steps: group submissions -> highlight paragraphs -> collapsible panels -> toolbar -> route strip -> link reveal.
import { currentId, findPage } from '../client/guide.js';
import { groupSubmissions } from './callouts.js';
import { improveParagraphs } from './paragraphs.js';
import { buildPanels, rememberFoldState } from './panels.js';
import { createToolbar } from './toolbar.js';
import { createRouteStepper } from './route.js';
import { initReveal } from './reveal.js';

function enhancePage(prose) {
  const originalHtml = prose.innerHTML;

  groupSubmissions(prose);
  improveParagraphs(prose);

  let panels = buildPanels(prose);
  rememberFoldState(prose, () => panels, currentId);

  // The route strip is created after the toolbar, so it can sit above it.
  let updateRoute = () => {};
  const toolbar = createToolbar({
    prose,
    originalHtml,
    hasPanels: panels.length > 0,
    onLayoutChange(plain) {
      // Switching back re-creates the panel DOM, so look the panels up again.
      if (!plain) panels = [...prose.querySelectorAll('details.panel')];
      updateRoute();
    },
  });
  updateRoute = createRouteStepper({ prose, beforeEl: toolbar.bar, page: findPage(currentId) });

  let frame = 0;
  window.addEventListener('scroll', () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      updateRoute();
    });
  }, { passive: true });

  initReveal();
  toolbar.restoreSavedLayout();
  updateRoute();
}

export function initReader() {
  const prose = document.querySelector('article.prose');
  if (!prose) return;
  try {
    enhancePage(prose);
  } catch (err) {
    console.error('reader', err);
  }
}
