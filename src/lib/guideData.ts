import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import manifest from '../data/manifest.json';

export type PageEntry = { id: string; group: string; title: string; file: string };
export const pages: PageEntry[] = manifest.pages;
export const groups = manifest.groups;

// Resolved from the project root (import.meta.url points into dist/ during build).
const dir = join(process.cwd(), 'src', 'data');

/** Page body HTML (everything inside <main>): header scene, article, pager, credit. */
export function pageHtml(id: string): string {
  return readFileSync(join(dir, 'pages', `${id}.html`), 'utf8');
}
export function homeHtml(): string {
  return readFileSync(join(dir, 'home.html'), 'utf8');
}
