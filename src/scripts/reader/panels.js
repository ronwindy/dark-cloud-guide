// Collapsible panels: every heading (and every FAQ question) becomes a <details> wrapping its section.
import { NUMBER_WORD_VALUES, ATLA_COUNT_PATTERN } from './vocab.js';
import { makeEl, markAdded } from './dom.js';
import { getJSON, setJSON } from '../storage.js';

const MIN_HEADINGS_FOR_PANELS = 3;
const FAQ_LEVEL = 5;

function headingLevel(el) {
  const m = /^H([2-4])$/.exec(el.tagName);
  return m ? +m[1] : 0;
}

function isElement(node, tag) {
  return node && node.nodeType === 1 && (!tag || node.tagName === tag);
}

function createPanel(head, className) {
  const details = document.createElement('details');
  details.className = 'panel ' + className;
  details.open = true;
  const summary = document.createElement('summary');
  summary.appendChild(head);
  details.appendChild(summary);
  const body = document.createElement('div');
  body.className = 'pbody';
  details.appendChild(body);
  return { details, body };
}

/**
 * Re-parent prose children into nested panels (h2 > h3 > h4, plus FAQ question panels).
 * Returns the FAQ panels in document order.
 */
function wrapSectionsInPanels(prose) {
  const children = [...prose.childNodes];
  const root = document.createDocumentFragment();
  const stack = [{ level: 0, body: root }];
  const faqPanels = [];
  const currentBody = () => stack[stack.length - 1].body;

  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    const level = isElement(node) ? headingLevel(node) : 0;

    if (level) {
      while (stack.length > 1 && stack[stack.length - 1].level >= level) stack.pop();
      const panel = createPanel(node, 'lv' + level);
      currentBody().appendChild(panel.details);
      stack.push({ level, body: panel.body });
    } else if (isElement(node, 'P') && node.classList.contains('faq-q')) {
      const panel = createPanel(node, 'faq');
      currentBody().appendChild(panel.details);
      // The answer paragraphs that follow belong inside this panel.
      while (isElement(children[i + 1]) && children[i + 1].classList.contains('faq-a')) {
        panel.body.appendChild(children[++i]);
      }
      faqPanels.push(panel.details);
    } else {
      currentBody().appendChild(node);
    }
  }

  prose.textContent = '';
  prose.appendChild(root);
  return faqPanels;
}

/** Small badges ("3 Atla", "Limited Zone", "Boss") summarising a panel's content. */
function summaryChips(body) {
  if (body.querySelector('.panel')) return [];
  const chips = [];
  const text = body.textContent;

  const atla = ATLA_COUNT_PATTERN.exec(text);
  if (atla) {
    const count = isNaN(+atla[1]) ? NUMBER_WORD_VALUES[atla[1].toLowerCase()] : +atla[1];
    if (count) chips.push(['atla', count + ' Atla']);
  }
  if (/Limited Zone/i.test(text)) chips.push(['zone', 'Limited Zone']);
  if (body.querySelector('.callout.boss')) chips.push(['boss', 'Boss']);
  return chips;
}

function addChips(panel, chips) {
  if (!chips.length) return;
  const holder = markAdded(makeEl('span', 'chips', ''));
  chips.forEach(([kind, label]) => holder.appendChild(makeEl('span', 'chip2 ' + kind, label)));
  panel.querySelector('summary').appendChild(holder);
}

/** Replace a panel that has no content with just its heading. */
function unwrapEmptyPanel(panel) {
  const heading = panel.querySelector('summary').firstChild;
  panel.parentNode.insertBefore(heading, panel);
  panel.parentNode.removeChild(panel);
}

/**
 * Build the panels for a page. Returns the panel list, FAQ panels first and then heading panels in
 * document order (the order matters: it is how the open/closed state is saved).
 */
export function buildPanels(prose) {
  const headingCount = prose.querySelectorAll('h2,h3,h4').length;
  const faqCount = prose.querySelectorAll('p.faq-q').length;
  if (headingCount < MIN_HEADINGS_FOR_PANELS && faqCount < MIN_HEADINGS_FOR_PANELS) return [];

  const panels = wrapSectionsInPanels(prose);
  prose.querySelectorAll('details.panel').forEach((panel) => {
    if (panel.classList.contains('faq')) return;
    const body = panel.querySelector(':scope>.pbody');
    if (!body.childNodes.length) {
      unwrapEmptyPanel(panel);
      return;
    }
    panels.push(panel);
    addChips(panel, summaryChips(body));
  });
  return panels.filter((p) => document.contains(p));
}

/** Give each panel an id, re-close the ones the reader closed last time, and save future changes. */
export function rememberFoldState(prose, getPanels, pageId) {
  const key = 'dc_fold_' + pageId;
  const closedIds = getJSON(key, []);
  getPanels().forEach((panel, i) => {
    panel.dataset.pid = i;
    if (closedIds.includes(i)) panel.open = false;
  });

  prose.addEventListener('toggle', (e) => {
    if (!e.target.classList || !e.target.classList.contains('panel')) return;
    const closed = [];
    getPanels().forEach((panel, i) => {
      if (!panel.open) closed.push(i);
    });
    setJSON(key, closed);
  }, true);
}

export function setAllPanelsOpen(prose, open) {
  prose.querySelectorAll('details.panel').forEach((panel) => {
    panel.open = open;
  });
}
