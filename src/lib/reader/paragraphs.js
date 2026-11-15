// Paragraph handling: note/warning/hint styling, splitting long paragraphs into one line per sentence.
import { ACTION_WORDS } from './vocab.js';
import { textNode } from './dom.js';
import { decorate, decorateIn } from './decorate.js';

const LONG_PARAGRAPH_MIN_CHARS = 150;
const SHORT_SENTENCE_MAX_CHARS = 38; // shorter sentences get merged into the previous line
const ABBREVIATION = /(?:^|[\s(])(?:Mr|Mrs|Ms|Dr|St|vs|Lv|approx|e\.g|i\.e)\.$/;
const SENTENCE_END = /[.!?]+["'”’)\]]*\s+(?=["'“‘(\[]?[A-Z0-9])/g;
const SKIPPED_CONTAINERS = 'pre,.mapframe,.origbox,table,summary,.filterbar';

export function isInSkippedContainer(el) {
  return el.closest(SKIPPED_CONTAINERS);
}

function splitSentences(text) {
  const sentences = [];
  const regex = new RegExp(SENTENCE_END.source, 'g');
  let start = 0;
  let match;
  while ((match = regex.exec(text))) {
    const end = match.index + match[0].replace(/\s+$/, '').length;
    const candidate = text.slice(start, end);
    const endsInAbbreviation = ABBREVIATION.test(candidate) || /(?:^|\s)[A-Z]\.$/.test(candidate);
    if (endsInAbbreviation) continue;
    sentences.push(candidate.trim());
    start = match.index + match[0].length;
  }
  if (start < text.length) sentences.push(text.slice(start).trim());
  return sentences.filter(Boolean);
}

function mergeShortSentences(sentences) {
  const merged = [];
  sentences.forEach((s) => {
    const previous = merged.length - 1;
    if (previous >= 0 && merged[previous].length < SHORT_SENTENCE_MAX_CHARS) merged[previous] += ' ' + s;
    else merged.push(s);
  });
  return merged;
}

function firstWord(sentence) {
  return sentence
    .replace(/^[^A-Za-z]+/, '')
    .split(/[\s,.!?;:]/)[0]
    .replace(/’/g, "'")
    .toLowerCase();
}

/** Rewrite a long paragraph as one <span class="ln"> per sentence; action sentences get class "act". */
function splitIntoLines(p) {
  const text = p.textContent.replace(/\s+/g, ' ').trim();
  const sentences = mergeShortSentences(splitSentences(text));
  if (sentences.length < 2) {
    decorateIn(p);
    return;
  }

  p.textContent = '';
  p.classList.add('lined');
  const actionLines = [];
  sentences.forEach((sentence, i) => {
    const line = document.createElement('span');
    line.className = 'ln';
    if (ACTION_WORDS[firstWord(sentence)]) {
      line.classList.add('act');
      actionLines.push(line);
    }
    line.appendChild(decorate(sentence));
    if (i < sentences.length - 1) line.appendChild(textNode(' '));
    p.appendChild(line);
  });
  // A single action line isn't a list of steps: don't highlight it.
  if (actionLines.length < 2) actionLines.forEach((line) => line.classList.remove('act'));
}

function markCallout(p) {
  const text = p.textContent;
  if (/^\s*(Note|NOTE)\s*[:\-]/.test(text)) p.classList.add('note');
  else if (/^\s*(Warning|WARNING|Caution|CAUTION|Beware|BEWARE)\b/.test(text)) p.classList.add('warn');
  else if (/^\s*(Tip|TIP|Hint|HINT)\s*[:!]/.test(text)) p.classList.add('hint');
}

/** Style notes/warnings/hints, split long paragraphs into lines, and highlight terms in list items. */
export function improveParagraphs(prose) {
  [...prose.querySelectorAll('p')].forEach((p) => {
    if (isInSkippedContainer(p)) return;
    markCallout(p);
    const isPlainLongParagraph = !p.children.length && p.textContent.trim().length >= LONG_PARAGRAPH_MIN_CHARS;
    if (isPlainLongParagraph) splitIntoLines(p);
    else decorateIn(p);
  });
  [...prose.querySelectorAll('li')].forEach((li) => {
    if (!isInSkippedContainer(li)) decorateIn(li);
  });
}
