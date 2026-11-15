import fs from 'node:fs';
import path from 'node:path';

export interface PageEntry {
  id: string;
  title: string;
  group: string;
  file: string;
}

export interface TocGroup {
  /** Position in the sidebar; keeps repeated group names apart. */
  key: string;
  group: string;
  entries: PageEntry[];
}

const DATA_DIR = path.resolve(process.cwd(), 'src/data');

/** Pages in reading order, as listed (and hand-editable) in src/data/manifest.json. */
export function getPages(): PageEntry[] {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'manifest.json'), 'utf-8')).pages;
}

export function readPageFile(file: string): string {
  return fs.readFileSync(path.join(DATA_DIR, 'pages', file), 'utf-8');
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Escapes text for a <pre>. Hides leading/trailing blank lines. */
export function renderText(text: string): string {
  return escapeHtml(text.replace(/^\s*\n/, '').trimEnd());
}

/** Sidebar data: pages grouped by consecutive group name. */
export function getToc(): TocGroup[] {
  const groups: TocGroup[] = [];
  for (const page of getPages()) {
    let g = groups[groups.length - 1];
    if (!g || g.group !== page.group) {
      g = { key: String(groups.length), group: page.group, entries: [] };
      groups.push(g);
    }
    g.entries.push(page);
  }
  return groups;
}

export function getNeighbours(id: string): { prev?: PageEntry; next?: PageEntry } {
  const pages = getPages();
  const at = pages.findIndex((p) => p.id === id);
  return at < 0 ? {} : { prev: pages[at - 1], next: pages[at + 1] };
}
