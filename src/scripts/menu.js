// Mobile / collapsible sidebar menu.

/** Toggle the menu; pass true/false to force open/closed. */
export function toggleMenu(force) {
  document.body.classList.toggle('menu-open', force);
}

export function initMenu() {
  document.getElementById('menuBtn')?.addEventListener('click', () => toggleMenu());
  document.getElementById('shade')?.addEventListener('click', () => toggleMenu(false));
}
