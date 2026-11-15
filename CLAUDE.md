# Dark Cloud Chronicle — Project Notes

A reformatted, readable web edition of the unofficial _Dark Cloud_ (PS2) strategy guide by AdrenalineSL & Azaroth (v2.0, 14 Aug 2002, via GameFAQs). Static Astro site for GitHub Pages (`https://ronwindy.github.io/dark-cloud-guide`). It was ported from a hand-built claude.ai artifact ("Dark Cloud Chronicle"), so the page HTML is already finished prose, tables and Q&A blocks; the ASCII maps and charts are kept as in the original.

## Structure

- `raw-sources/dark_cloud_guide_raw.txt` — the untouched original FAQ (gitignored, reference only). Use it to check or fix wording against the source.
- `src/data/manifest.json` — `{ groups, pages }`. Page order, titles and sidebar groups. Edit by hand when adding, moving or renaming a page. Page: `{ id, group, title, file }` (`file` is `<id>.html`). Group: `{ id, title, icon }`.
- `src/data/pages/<id>.html` — **the content.** Each file is the inner HTML of `<main>`: header scene (inline SVG), `<article class="prose">`, the prev/next `<nav class="pager">` and the credit footer. Hand-edit freely; nothing regenerates them.
- `src/data/home.html` — inner HTML of the home page (hero scene, group cards, progress bar). The group cards are hard-coded; update them when the manifest changes.
- `src/pages/index.astro`, `src/pages/[id].astro`, `src/layouts/BaseLayout.astro` — thin shells that inject the fragments. `src/lib/guideData.ts` reads the manifest and fragments.
- `src/scripts/` — client-side ES modules (bundled by Astro via `BaseLayout.astro`; this replaced the single `public/app.js` from the artifact). `main.js` is the entry and calls one `init*()` per feature: `nav.js` (sidebar built from `window.DC_PAGES` / `window.DC_GROUPS`, injected by the layout from `manifest.json`), `icons.js`, `theme.js`, `menu.js`, `readSeal.js` / `readState.js` ("Mark as read"), `scrollMemory.js`, `home.js` (progress), `filter.js`, `tableSort.js`, `mapZoom.js`, `keyboard.js`. `reader/` is the readability layer (highlighting, sentence lines, collapsible panels, toolbar, route strip). localStorage keys live in `storage.js` (`dc_theme`, `dc_read`, `dc_last`, `dc_pos`, `dc_plain`, `dc_fold_<page>`).
- `src/styles/global.css` — the artifact stylesheet (CSS variables for day/night parchment) with Tailwind `@tailwind components/utilities` on top. Look and feel: `DESIGN.md`.
- `project.config.json` — site URL, base path, titles. `astro.config.mjs` reads it.

## Rules

- Stack: Astro + Tailwind (same toolchain as `radiant-historia-guide`). `applyBaseStyles` is off; the site styling is the plain CSS in `global.css`.
- Links between pages are relative (`faq.html`) because `build.format` is `file` and pages sit at the base root. Keep that; do not switch to absolute `/` links.
- Page text is the guide's wording. Fix typos and layout, but do not paraphrase or add strategy that is not in the source unless asked.
- Build: `npm run build` (output `dist/`, gitignored). On Windows PowerShell use `cmd /c npm run build` if script policy blocks npm. One-off scripts go in `scratch/` (gitignored).
- Ask before adding new components, features or dependencies beyond the list above.
- Deploy: push to `main`; `.github/workflows/deploy.yml` builds and publishes to GitHub Pages.
- Out of scope: backends, accounts, crawling.
