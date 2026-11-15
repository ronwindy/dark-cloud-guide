// Opens any collapsed panels around a heading when it is linked to (outline, route strip, URL hash).

function openAncestorPanels(el) {
  let details = el && el.closest ? el.closest('details') : null;
  while (details) {
    details.open = true;
    details = details.parentElement && details.parentElement.closest('details');
  }
}

function revealHash() {
  openAncestorPanels(document.getElementById(location.hash.slice(1)));
}

export function initReveal() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest && e.target.closest('#outline a,.route a');
    if (link && link.hash) openAncestorPanels(document.getElementById(link.hash.slice(1)));
  }, true);
  window.addEventListener('hashchange', revealHash);
  if (location.hash) revealHash();
}
