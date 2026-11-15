// Word lists and regexes the reader uses to spot names, numbers, key terms and instructions.

const wordSet = (words) => Object.fromEntries(words.split(' ').map((w) => [w.toLowerCase(), true]));

/** Capitalised words that are NOT part of a key term (sentence openers, pronouns, fillers...). */
export const STOP_WORDS = wordSet(
  "The A An I He She It We You They This That These Those There Then Now But And Or So If When While As After Before Once Just Also Note Thanks Remember For To In On At With Not What Why How Who Where Which Your My Our His Her Its Their Some Every Each All Any No Yes Well Oh Ok Okay Anyway Er Hey Meet Here Next First Finally Afterwards Upon From Since Because Although Though Even Still Only Both Either Neither Unfortunately Basically Personally Obviously Again Sorry Please Thank Much"
);

/** Imperative verbs: a sentence starting with one is treated as an action step. */
export const ACTION_WORDS = wordSet(
  "speak talk go head use check pick collect find build rebuild look take get buy equip save visit give open climb jump run press defeat return leave enter place fight make try fill stock gather switch hit keep watch start wait set move examine search tell ask read sell grab follow choose select mix walk exit stop continue proceed avoid upgrade attach repair rest sleep fish catch trade bring put drop throw dig pull push fly break load link click be never don't do remember beat kill destroy defend dodge"
);

const NUMBER_WORDS =
  'one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty'.split(' ');

/** "three" -> 3 */
export const NUMBER_WORD_VALUES = Object.fromEntries(NUMBER_WORDS.map((w, i) => [w, i + 1]));

const NUMBER_WORD_ALTERNATIVES = NUMBER_WORDS
  .concat(NUMBER_WORDS.map((w) => w.charAt(0).toUpperCase() + w.slice(1)))
  .join('|');

const CHARACTER_NAMES = String.raw`\b(Toan|Xiao|Goro|Ruby|Ungaga|Osmond)\b`;
const NUMBER = String.raw`\b(\d[\d,]*(?:\.\d+)?%?)(?![\w])`;

/**
 * Finds, in priority order (capture groups):
 *  1 character name   2 spelled-out count before "Atla"   3 digits / percentages
 *  4 game keyword (Atla, Georama, Gilda)   5 run of capitalised words (a key term)
 */
export const DECORATE_PATTERN = String.raw`${CHARACTER_NAMES}|\b(` + NUMBER_WORD_ALTERNATIVES + String.raw`)(?= (?:[A-Za-z]+ )?Atlas?\b)|${NUMBER}|\b(Atlas?|Georama|Gilda)\b|\b([A-Z][A-Za-z0-9'’+]*(?: (?:of |the |de )?[A-Z][A-Za-z0-9'’+]*)+)`;

/** Names and numbers only (used where key terms must not be bolded). */
export const SIMPLE_PATTERN = `${CHARACTER_NAMES}|${NUMBER}`;

/** Leading words skipped before a key term starts ("of", "the", "de", single letters). */
export const KEY_TERM_FILLER = new Set(['of', 'the', 'de']);

/** Matches "<count> [word] Atla" so panels can show an "N Atla" chip. */
export const ATLA_COUNT_PATTERN =
  /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen)\s+(?:[A-Za-z]+\s+)?Atlas?\b/i;
