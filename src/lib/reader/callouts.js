// Groups reader submissions inside callouts into separate blocks, each ending at its "Thanks ..." line.

const SIGN_OFF = /^\s*(Thanks|Thank you|Much thanks|Submitted by)/i;
const MIN_PARAGRAPHS = 3;

/** Split paragraphs into submissions; a paragraph starting with a sign-off closes its group. */
function groupBySignOff(paragraphs) {
  const groups = [];
  let current = [];
  paragraphs.forEach((p) => {
    current.push(p);
    if (SIGN_OFF.test(p.textContent)) {
      p.classList.add('by');
      groups.push(current);
      current = [];
    }
  });
  if (current.length) groups.push(current);
  return groups;
}

export function groupSubmissions(prose) {
  prose.querySelectorAll('.callout').forEach((callout) => {
    const paragraphs = [...callout.children].filter((el) => el.tagName === 'P');
    if (paragraphs.length < MIN_PARAGRAPHS) return;

    const groups = groupBySignOff(paragraphs);
    if (groups.length < 2) return;

    groups.forEach((group) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'sub';
      callout.insertBefore(wrapper, group[0]);
      group.forEach((p) => wrapper.appendChild(p));
    });
  });
}
