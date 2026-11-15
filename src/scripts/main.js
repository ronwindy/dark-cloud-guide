// Entry point: wires up every client-side feature of the guide.
import { injectIconSprite } from './icons.js';
import { initTheme } from './theme.js';
import { initMenu } from './menu.js';
import { buildNav } from './nav.js';
import { initReadSeal } from './readSeal.js';
import { initScrollMemory } from './scrollMemory.js';
import { initHome } from './home.js';
import { initMapZoom } from './mapZoom.js';
import { initTableSort } from './tableSort.js';
import { initFilter } from './filter.js';
import { initReader } from './reader/index.js';
import { initKeyboard } from './keyboard.js';

injectIconSprite();
initTheme();
initMenu();
buildNav();
initReadSeal();
initScrollMemory();
initHome();
initMapZoom();
initTableSort();
initFilter();
initReader();
initKeyboard();
