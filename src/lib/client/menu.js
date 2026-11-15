// Sidebar menu on narrow screens: opened by a body class.

/** Toggle the menu; pass true/false to force open/closed. */
export function toggleMenu(force) {
  document.body.classList.toggle('menu-open', force);
}
