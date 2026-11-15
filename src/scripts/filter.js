// Live text filter (#filter) for entries, weapon cards and table rows.

function applyFilter(input, counter, items) {
  const query = input.value.trim().toLowerCase();
  let shown = 0;
  items.forEach((el) => {
    const match = !query || el.textContent.toLowerCase().includes(query);
    el.hidden = !match;
    if (match) shown++;
  });
  counter.textContent = query ? `${shown} / ${items.length} match` : '';
}

export function initFilter() {
  const input = document.getElementById('filter');
  if (!input) return;

  const counter = document.getElementById('filterCount');
  const items = [...document.querySelectorAll('.entry,.wcard,.dctable tbody tr')];
  input.addEventListener('input', () => applyFilter(input, counter, items));
}
