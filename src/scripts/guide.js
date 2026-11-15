// Guide data injected by the layout (window.DC_PAGES / DC_GROUPS) and the current page id.

export const pages = window.DC_PAGES || [];
export const groups = window.DC_GROUPS || [];
export const currentId = document.documentElement.dataset.page;

export function findPage(id) {
  return pages.find((p) => p.id === id);
}
