# Dark Cloud Chronicle — Project Notes

A reformatted, readable web edition of the unofficial _Dark Cloud_ (PS2) strategy guide by AdrenalineSL & Azaroth (v2.0, 14 Aug 2002, via GameFAQs). Static Astro site for GitHub Pages (`https://ronwindy.github.io/dark-cloud-guide`). It was ported from a hand-built claude.ai artifact ("Dark Cloud Chronicle"), so the page markup is already finished prose, tables and Q&A blocks; the ASCII maps and charts are kept as in the original.

## Structure

- `raw-sources/dark_cloud_guide_raw.txt` — the untouched original FAQ (gitignored, reference only). Use it to check or fix wording against the source.
- `src/data/manifest.json` — `{ groups, pages }`. Page order, titles and sidebar groups; the sidebar, pager, page header and home cards are all built from it. Edit by hand when adding, moving or renaming a page. Page: `{ id, group, title, heading?, file, scene, filter? }` — `file` is `<id>.html`; `heading` is the h1 when it differs from `title`; `scene` names a header illustration in `src/components/scenes/`; `filter: true` shows the filter bar. Group: `{ id, title, icon }`.
- `src/pages/<id>.astro` — **the content.** One file per guide page: `<GuidePage id="...">` around the article body. Prose is plain HTML (`p`, `h2.hash`, `h3`, `h4.tier`, `ul.dclist`, `p.lines`, `p.faq-q`/`p.faq-a`, `hr.orn`); repeated blocks use the components below. Hand-edit freely. Adding a page = a manifest entry + `src/pages/<id>.astro`. Pages with their own layouts pass `reader={false}`. ASCII art sits in `is:raw` blocks (`<MapFrame is:raw>`, `<OrigBox is:raw>`) so braces and spacing are kept verbatim.
- `src/pages/index.astro` — home page: `Hero` (with `ReadProgress`) and one `GroupCard` per manifest group.
- `src/layouts/BaseLayout.astro` — html shell: theme pre-paint script, `IconSprite`, `Topbar`, `Sidebar`, `<main>` slot, `KeyboardShortcuts`. `src/layouts/GuidePage.astro` — guide page shell: `PageHead` (scene, crumb, h1), `FilterBar`, `<article class="prose">`, `ReaderLayer`, `Pager`, `CreditFooter`; its script saves the last page and scroll position.
- `src/components/` — each component keeps its own markup, `<style>` and `<script>`. Styles are scoped unless they target markup from slots or scripts, which use `is:global`. Shell: `Topbar` (theme, menu), `Sidebar` (groups, read ticks, outline, scroll spy), `IconSprite` (`#i-<name>` icons), `KeyboardShortcuts`, `PageHead` + `Scene` (+ `scenes/*.astro`), `FilterBar`, `Pager` ("Mark as read"), `CreditFooter`, `ReaderLayer`. Body blocks in `guide/`: `Callout` (`kind="tip" | "boss"`), `ChapterHeading`, `MapFrame` (zoom buttons), `OrigBox` ("Show original ASCII"), `DcTable` (`sortable`), `Entry` (bestiary/boss entry), `WeaponGrid` + `WeaponCard` (stats as `rows` data). Home: `home/Hero`, `home/ReadProgress`, `home/GroupCard`.
- `src/lib/guideData.ts` — build-time manifest helpers (`getPage`, `getGroup`, `neighbours`). `src/lib/client/` — modules shared by component scripts: `guide.js` (manifest + current page id), `storage.js` (localStorage keys `dc_theme`, `dc_read`, `dc_last`, `dc_pos`, `dc_plain`, `dc_fold_<page>`), `readState.js` (fires `dc:read-change`), `menu.js`. `src/lib/reader/` — the readability layer (highlighting, sentence lines, collapsible panels, toolbar, route strip), loaded by `ReaderLayer`.
- `src/styles/global.css` — design tokens (CSS variables for day/night parchment), base styles, page width and prose typography, with Tailwind `@tailwind components/utilities` on top. Look and feel: `DESIGN.md`.
- `project.config.json` — site URL, base path, titles. `astro.config.mjs` reads it.

## Rules

- Stack: Astro + Tailwind (same toolchain as `radiant-historia-guide`). `applyBaseStyles` is off; the site styling is plain CSS in `global.css` and the components' `<style>` blocks.
- Links between pages are relative (`faq.html`) because `build.format` is `file` and pages sit at the base root. Keep that; do not switch to absolute `/` links.
- Page text is the guide's wording. Fix typos and layout, but do not paraphrase or add strategy that is not in the source unless asked.
- Build: `npm run build` (output `dist/`, gitignored). On Windows PowerShell use `cmd /c npm run build` if script policy blocks npm. One-off scripts go in `scratch/` (gitignored).
- Ask before adding new components, features or dependencies beyond the list above.
- Deploy: push to `main`; `.github/workflows/deploy.yml` builds and publishes to GitHub Pages.
- Out of scope: backends, accounts, crawling.
