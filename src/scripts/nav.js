// Sidebar navigation: page groups, read ticks, and the in-page outline of the current page.
import { pages, groups, currentId, findPage } from './guide.js';
import { isRead } from './readState.js';
import { toggleMenu } from './menu.js';

const OUTLINE_MAX_ITEMS = 60;
const WIDE_LAYOUT_MIN_WIDTH = 1180; // sidebar is always visible at this width, so don't auto-close it

function homeLinkHtml() {
  return '<a class="pl" href="index.html" style="padding-left:.5rem;font-family:var(--f-head)">' +
    '<svg class="ic"><use href="#i-cloud"/></svg>Home &amp; progress</a>';
}

function pageLinkHtml(page) {
  const classes = ['pl'];
  if (page.id === currentId) classes.push('cur');
  if (isRead(page.id)) classes.push('read');
  // The outline placeholder sits right under the current page's link.
  const outline = page.id === currentId ? '<div class="outline" id="outline"></div>' : '';
  return `<a class="${classes.join(' ')}" href="${page.file}" data-id="${page.id}">` +
    `<span class="tick"></span><span>${page.title}</span></a>${outline}`;
}

function groupHtml(group, currentGroupId) {
  const groupPages = pages.filter((p) => p.group === group.id);
  const readCount = groupPages.filter((p) => isRead(p.id)).length;
  const open = group.id === currentGroupId ? ' open' : '';
  return `<details${open}><summary><svg class="ic"><use href="#i-${group.icon}"/></svg>${group.title}` +
    `<span class="cnt">${readCount}/${groupPages.length}</span></summary>` +
    groupPages.map(pageLinkHtml).join('') +
    '</details>';
}

/** Fill the placeholder under the current page with links to its headings. */
function fillOutline() {
  const outline = document.getElementById('outline');
  if (!outline) return;

  const headings = [...document.querySelectorAll('.prose h2,.prose h3,.prose h4:not(.tier)')]
    .filter((h) => h.id)
    .slice(0, OUTLINE_MAX_ITEMS);
  const levelClass = { H2: 'l2', H3: 'l3', H4: 'l4' };
  outline.innerHTML = headings
    .map((h) => `<a class="${levelClass[h.tagName]}" href="#${h.id}">${h.textContent}</a>`)
    .join('');

  outline.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && window.innerWidth < WIDE_LAYOUT_MIN_WIDTH) toggleMenu(false);
  });
}

export function buildNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const currentGroupId = findPage(currentId)?.group;
  nav.innerHTML = homeLinkHtml() + groups.map((g) => groupHtml(g, currentGroupId)).join('');

  fillOutline();
  nav.querySelector('.pl.cur')?.scrollIntoView?.({ block: 'center' });
}

/** Rebuild the nav without the sidebar jumping back to the current page. */
export function rebuildNavKeepScroll() {
  const side = document.getElementById('side');
  const scrollTop = side ? side.scrollTop : 0;
  buildNav();
  if (side) side.scrollTop = scrollTop;
}
