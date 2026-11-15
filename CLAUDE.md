# Dark Cloud Chronicle — Project Notes

Re-presents the unofficial _Dark Cloud_ (PS2) strategy guide by AdrenalineSL & Azaroth (v2.0, 14 Aug 2002, via GameFAQs) as a static Astro site on GitHub Pages (`https://ronwindy.github.io/dark-cloud-guide`). The guide's fixed-width ASCII text is shown as written, split into 48 pages.

## Structure
- `raw-sources/dark_cloud_guide_raw.txt` — the untouched original FAQ, kept for reference only. `raw-sources/art/` — the original, unoptimised logo, favicon and background images. Both are gitignored.
- `src/data/pages/<id>.txt` — **the content.** Created once from the original by a throwaway splitter; from then on these files are hand-edited freely (no extract/verify pipeline, nothing regenerates them). Only the dashed sub-header that repeated each page's title was dropped; the boxed section banners ("01. C O N T R O L S & G A M E P L A Y" etc.) stay at the top of the first page of each section.
- `src/data/manifest.json` — page order, titles, sidebar groups. Edit by hand when adding, moving or renaming pages. Each page is `{ id, title, group, file }`. Sidebar groups are consecutive runs of the same `group` name.
- `src/lib/guideData.ts` — reads the manifest and page files; `renderText` HTML-escapes the text and hides leading/trailing blank lines.
- `src/pages/index.astro` (contents), `src/pages/guide/[id].astro` (every page, built to `guide/<id>.html`), `src/layouts/BaseLayout.astro`, `src/components/{Navigation,SidebarNav,SidebarEntry,MobileNavDrawer}.astro`, `src/styles/global.css`, `tailwind.config.mjs`.
- `project.config.json` — site URL, base path, titles and descriptions. `astro.config.mjs` reads it. Look and feel: `DESIGN.md`.
- `public/` — `logo.png`, `background.jpg` (+ `background-mobile.jpg`), `favicon-32.png`, `favicon-512.png`, `apple-touch-icon.png`; all optimised copies of `raw-sources/art/`.

## Features
Night-only theme (deep indigo/violet ink, lavender-silver headings, moon-gold ornaments; see `DESIGN.md`) with the night-village background and Dark Cloud logo; collapsible sidebar and mobile drawer; prev/next links; per-page "Mark as read", sidebar checkmarks and "Continue reading" on the home page (localStorage only; keys `dark-cloud-sidebar-state`, `dark-cloud-progress-v1`, sessionStorage `dark-cloud-sidebar-cat-<n>`).

## Mobile (primary use: iPhone 13, Safari, mostly landscape ~844x390)
- Below 1024px the ASCII `<pre>` font is computed (`clamp` in `global.css`) so the longest source line (77 cols) fits without sideways scroll.
- The mobile header auto-hides on scroll down (`html[data-header-hidden]`, script in `BaseLayout.astro`); a floating menu button (`.float-menu`, in `MobileNavDrawer.astro`) opens the drawer meanwhile.
- `viewport-fit=cover` + `env(safe-area-inset-*)` padding, `min-h-dvh`, `text-size-adjust: 100%`; 44px tap targets on coarse pointers.
- Small/touch screens drop the fixed background (a static, smaller `background-mobile.jpg` fades out behind the top of the page).

## Rules
- Stack: Astro + Tailwind + Lucide (same as `radiant-historia-guide`). Monospace is used only for the ASCII text.
- Pages render as `<pre class="guide-text font-source-art">`; keep that so ASCII maps stay aligned.
- Links between pages are base-aware (`${baseUrl}/guide/<id>`, base from `project.config.json`); keep that for GitHub Pages.
- Build: `cmd /c npm run build` (output `dist/`). One-off scripts go in `scratch/` (gitignored).
- Deploy: push to `main`; `.github/workflows/deploy.yml` builds and publishes to GitHub Pages.
- Ask before adding new components or features beyond the list above.
- Out of scope: map/progress trackers, per-chapter cards, highlight or reader layers, light mode, crawling, backends.
