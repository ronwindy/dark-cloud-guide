# Design

Storybook-parchment reader theme for *Dark Cloud* (rebuilding the world, a book you can alt-tab to). All tokens are CSS variables at the top of `src/styles/global.css`; each component's own styles sit in its `<style>` block.

- **Palette:** day = warm parchment (`--paper #f1e4c3`, ink brown, crimson `--accent`, `--gold`); night = violet-ink parchment (`:root[data-theme=dark]`, `--paper #241a2e`). Theme toggle stores `dc_theme` in localStorage; an inline script in `BaseLayout.astro` applies it before paint (the toggle lives in `Topbar.astro`).
- **Type:** Cinzel Decorative (display), Cinzel (headings), IM Fell English / Cormorant Garamond (body), Cascadia/Consolas monospace for ASCII maps (`--f-mono`, size `--asc`). Loaded from Google Fonts in the layout head.
- **Illustration:** each page has an original inline SVG "scene" in its header (`src/components/scenes/`, picked by the page's `scene` in the manifest), colored through `--sc-bg`/`--sc1..5` so it follows the theme. Icons are a Lucide-style stroke sprite rendered by `IconSprite.astro` (`#i-<name>`).
- **Layout:** sticky top bar, collapsible sidebar with per-group read counts and an on-page outline, page header + `.prose` article, prev/next pager with a "Mark as read" seal button, home page with hero, progress bar and group cards.
- **Behavior:** read state and last position in localStorage (`dc_read`), keyboard shortcuts (m menu, t theme, x mark read, h home, arrow keys prev/next).
