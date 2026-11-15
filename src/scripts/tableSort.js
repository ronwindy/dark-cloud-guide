// Click a header cell of a table.sortable to sort by that column (numeric when both values are numbers).

const NUMERIC_TEXT = /^[\d.\s-]+$/;

function compareCells(a, b, column) {
  const x = a.cells[column].textContent.trim();
  const y = b.cells[column].textContent.trim();
  const nx = parseFloat(x);
  const ny = parseFloat(y);
  const numeric = !isNaN(nx) && !isNaN(ny) && NUMERIC_TEXT.test(x + y);
  return numeric ? nx - ny : x.localeCompare(y, undefined, { numeric: true });
}

function sortTable(table, headers, th, column) {
  const ascending = !th.classList.contains('asc');
  headers.forEach((h) => h.classList.remove('asc', 'desc'));
  th.classList.add(ascending ? 'asc' : 'desc');

  const body = table.tBodies[0];
  const rows = [...body.rows].sort((a, b) => {
    const result = compareCells(a, b, column);
    return ascending ? result : -result;
  });
  rows.forEach((row) => {
    row.classList.remove('sep');
    body.appendChild(row);
  });
}

export function initTableSort() {
  document.querySelectorAll('table.sortable').forEach((table) => {
    const headers = [...table.querySelectorAll('th')];
    headers.forEach((th, column) => {
      th.addEventListener('click', () => sortTable(table, headers, th, column));
    });
  });
}
