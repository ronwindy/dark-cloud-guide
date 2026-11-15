// Tiny DOM helpers shared by the reader modules.

/** Create an element with a class and text. */
export function makeEl(tag, className, text) {
  const el = document.createElement(tag);
  el.className = className;
  el.textContent = text;
  return el;
}

export function textNode(text) {
  return document.createTextNode(text);
}

/** Mark an element as added by the reader (so the original layout can be restored). */
export function markAdded(el) {
  el.setAttribute('data-added', '');
  return el;
}
