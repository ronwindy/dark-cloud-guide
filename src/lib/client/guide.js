// Guide data for client scripts: page order from manifest.json (bundled) and the current page id.
import manifest from '../../data/manifest.json';

export const pages = manifest.pages;
export const groups = manifest.groups;
export const currentId = document.documentElement.dataset.page;

export function findPage(id) {
  return pages.find((p) => p.id === id);
}
