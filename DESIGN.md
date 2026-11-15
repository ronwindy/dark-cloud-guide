# Design

Night-only reader theme for *Dark Cloud* (moonlit village, dark genie, lavender "Dark Cloud" logo). Tailwind tokens in `tailwind.config.mjs` (indigo-ink `void`/`obsidian`, lavender-silver `slate` lights, `moon-*` gold ornaments, `lavender-*` links/active states, `violet-*` glows, Cinzel headings, Jost body, Courier Prime for the ASCII text) and component classes in `src/styles/global.css`. `color-scheme: dark`; there is no light mode or toggle.

- **Background:** `public/background.jpg` (night village) fixed behind a dark violet overlay gradient so text stays readable (`.site-bg` in `BaseLayout.astro` / `global.css`). On small or touch screens it is not fixed: `background-mobile.jpg` sits behind the top 75% of the page and fades into the plain page colour.
- **Branding:** `public/logo.png` (transparent PNG) in the sidebar, mobile header and home page; favicons are `favicon-32.png`, `favicon-512.png` and `apple-touch-icon.png`. Glows are violet/lavender.
- **Navigation:** solid indigo-ink sidebar (`.ink-sidebar`, no blur) with a gold edge; collapsible, state in localStorage; mobile drawer; groups collapsible and auto-open on the current page. Active entry is lavender on a violet tint. Ornaments are plain gold lines with a small diamond.
- **Page body:** lavender-silver `.ink-heading` titles over a gold rule with a small diamond, dark ink `<pre>` with a thin gold frame, moon-gold/violet prev/next cards, green "read" states.
- **Originals:** the unoptimised art lives in `raw-sources/art/` (gitignored); `public/` holds the compressed copies.
