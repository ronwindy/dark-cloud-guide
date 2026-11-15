// Home page: progress bar, "Resume" link and read / last-visited markers on page cards.
import { pages, currentId, findPage } from './guide.js';
import { KEYS, getItem } from './storage.js';
import { isRead } from './readState.js';

export function initHome() {
  if (currentId !== 'index') return;

  const readCount = pages.filter((p) => isRead(p.id)).length;
  const fill = document.getElementById('barFill');
  const label = document.getElementById('barTxt');
  if (fill) fill.style.width = `${(100 * readCount) / pages.length}%`;
  if (label) label.textContent = `${readCount} of ${pages.length} pages read`;

  const lastId = getItem(KEYS.last);
  const resume = document.getElementById('resume');
  const lastPage = lastId && findPage(lastId);
  if (resume && lastPage) {
    resume.href = lastPage.file;
    resume.textContent = `Resume: ${lastPage.title}`;
  }

  document.querySelectorAll('.pcard').forEach((card) => {
    if (isRead(card.dataset.id)) card.classList.add('read');
    if (card.dataset.id === lastId) card.classList.add('last');
  });
}
