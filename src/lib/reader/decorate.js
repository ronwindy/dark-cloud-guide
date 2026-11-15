// Wraps names, numbers and key terms in <b> tags (text only; wording is never changed).
import {
  STOP_WORDS,
  ACTION_WORDS,
  DECORATE_PATTERN,
  SIMPLE_PATTERN,
  KEY_TERM_FILLER,
} from './vocab.js';
import { makeEl, textNode } from './dom.js';

/** Elements whose text must be left alone. */
const UNDECORATED = 'pre,.mapframe,.origbox,table,.kt,.nm,.num,h1,h2,h3,h4,h5,summary,code,a';

/**
 * Run `pattern` over `text` and build a fragment: plain text between matches,
 * and whatever `buildMatch(match)` returns for each match.
 */
function replaceMatches(text, pattern, buildMatch) {
  const fragment = document.createDocumentFragment();
  const regex = new RegExp(pattern, 'g');
  let last = 0;
  let match;
  while ((match = regex.exec(text))) {
    if (match.index > last) fragment.appendChild(textNode(text.slice(last, match.index)));
    fragment.appendChild(buildMatch(match));
    last = match.index + match[0].length;
  }
  if (last < text.length) fragment.appendChild(textNode(text.slice(last)));
  return fragment;
}

/** Names and numbers only. */
function decorateSimple(text) {
  return replaceMatches(text, SIMPLE_PATTERN, (m) => makeEl('b', m[1] ? 'nm' : 'num', m[0]));
}

function isLeadingFiller(word) {
  const lower = word.toLowerCase();
  return STOP_WORDS[lower] || ACTION_WORDS[lower] || word.length < 2 || KEY_TERM_FILLER.has(word);
}

/** A run of capitalised words: bold it as a key term, minus any leading filler words. */
function decorateCapitalisedRun(run) {
  const words = run.split(' ');
  let leading = '';
  while (words.length && isLeadingFiller(words[0])) leading += words.shift() + ' ';

  const allCaps = words.length && words.every((w) => w === w.toUpperCase() && /[A-Z]/.test(w));
  if (words.length < 2 || allCaps) return decorateSimple(run);

  const fragment = document.createDocumentFragment();
  if (leading) fragment.appendChild(textNode(leading));
  fragment.appendChild(makeEl('b', 'kt', words.join(' ')));
  return fragment;
}

function decorateMatch(m) {
  const [text, name, spelledCount, digits, keyword] = m;
  if (name) return makeEl('b', 'nm', text);
  if (spelledCount || digits) return makeEl('b', 'num', text);
  if (keyword) return makeEl('b', 'kt', text);
  return decorateCapitalisedRun(text);
}

/** Text -> fragment with names, numbers and key terms highlighted. */
export function decorate(text) {
  return replaceMatches(text, DECORATE_PATTERN, decorateMatch);
}

/** Decorate every text node inside `el`, in place. */
export function decorateIn(el) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) textNodes.push(node);

  textNodes.forEach((t) => {
    if (!t.nodeValue.trim()) return;
    const parent = t.parentNode;
    if (parent.closest && parent.closest(UNDECORATED)) return;
    parent.replaceChild(decorate(t.nodeValue), t);
  });
}
