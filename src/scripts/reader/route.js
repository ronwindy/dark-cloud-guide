// Route stepper: a sticky strip of dots/labels for walkthrough, village and boss pages.
import { markAdded } from './dom.js';

const ROUTE_GROUPS = new Set(['g3', 'g4', 'g7']);
const MIN_STEPS = 4;
const MAX_LABEL_CHARS = 20;
const ACTIVE_LINE_PX = 150; // a step becomes "on" once its heading scrolls above this line
const SCROLL_PADDING_PX = 128;
const RECENTER_THRESHOLD_PX = 40;

/** Short label for a heading: drops "CHAPTER x -", shortens "Floor 3F", trims long text. */
function stepLabel(fullText) {
  let label = fullText.replace(/^CHAPTER\s+\w+\s*[-–:]\s*/i, '');
  const floor = /^Floor\s+(B?\d+F?)\b/i.exec(label);
  if (floor) label = floor[1].toUpperCase();
  if (label === label.toUpperCase()) label = label.toLowerCase();
  if (label.length > MAX_LABEL_CHARS) label = label.slice(0, MAX_LABEL_CHARS - 1) + '…';
  return label;
}

function createStep(heading) {
  const fullText = heading.textContent.trim();
  const step = document.createElement('a');
  step.className = 'st ' + (heading.tagName === 'H4' ? 'sm' : 'big');
  step.href = '#' + heading.id;
  step.title = fullText;
  step.innerHTML = '<i></i><span></span>';
  step.lastChild.textContent = stepLabel(fullText);
  step.dataset.t = heading.id;
  return step;
}

/** Keep the active step visible when the strip itself scrolls horizontally. */
function centerStep(track, step) {
  if (!step || track.scrollWidth <= track.clientWidth) return;
  const wanted = step.offsetLeft - track.clientWidth / 2 + step.offsetWidth / 2;
  if (Math.abs(track.scrollLeft - wanted) > RECENTER_THRESHOLD_PX) track.scrollLeft = wanted;
}

/**
 * Build the stepper above `beforeEl` if this page qualifies.
 * Returns an `update()` function (no-op when there is no stepper) to call on scroll.
 */
export function createRouteStepper({ prose, beforeEl, page }) {
  const noop = () => {};
  if (!page || !ROUTE_GROUPS.has(page.group)) return noop;

  const headings = [...prose.querySelectorAll('h2[id],h3[id],h4[id]')];
  if (headings.length < MIN_STEPS) return noop;

  const nav = markAdded(document.createElement('nav'));
  nav.className = 'route';
  nav.setAttribute('aria-label', 'Route through this page');
  const track = document.createElement('div');
  track.className = 'track';
  nav.appendChild(track);

  const steps = headings.map(createStep);
  steps.forEach((step) => track.appendChild(step));
  beforeEl.parentNode.insertBefore(nav, beforeEl);
  document.documentElement.style.scrollPaddingTop = SCROLL_PADDING_PX + 'px';

  return function update() {
    let active = -1;
    steps.forEach((step, i) => {
      const heading = document.getElementById(step.dataset.t);
      if (!heading || !heading.getClientRects().length) return; // hidden (inside a closed panel)
      if (heading.getBoundingClientRect().top < ACTIVE_LINE_PX) active = i;
    });
    steps.forEach((step, i) => {
      step.classList.toggle('done', i < active);
      step.classList.toggle('on', i === active);
    });
    centerStep(track, steps[active]);
  };
}
