import manifest from '../data/manifest.json';

export type GroupEntry = { id: string; title: string; icon: string };
export type PageEntry = {
  id: string;
  group: string;
  title: string;
  /** Page h1 when it differs from the sidebar title. */
  heading?: string;
  file: string;
  /** Header illustration: a component in src/components/scenes/. */
  scene: string;
  /** Show the "Filter this page" bar. */
  filter?: boolean;
};

export const pages: PageEntry[] = manifest.pages;
export const groups: GroupEntry[] = manifest.groups;

export function getPage(id: string): PageEntry {
  const page = pages.find((p) => p.id === id);
  if (!page) throw new Error(`Unknown page id "${id}" (not in src/data/manifest.json)`);
  return page;
}

export function getGroup(id: string): GroupEntry {
  const group = groups.find((g) => g.id === id);
  if (!group) throw new Error(`Unknown group id "${id}"`);
  return group;
}

/** Previous and next page in reading order (undefined at the ends). */
export function neighbours(id: string): { prev?: PageEntry; next?: PageEntry } {
  const i = pages.findIndex((p) => p.id === id);
  return { prev: pages[i - 1], next: pages[i + 1] };
}

