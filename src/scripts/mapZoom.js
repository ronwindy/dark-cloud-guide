// A− / A+ zoom buttons on the ASCII map frames.

const START_SIZE_PX = 12.5;
const MIN_SIZE_PX = 7;
const MAX_SIZE_PX = 24;
const STEP_PX = 1.5;

function addZoomButton(bar, label, direction, zoomBy) {
  const button = document.createElement('button');
  button.textContent = label;
  button.title = 'Zoom';
  button.addEventListener('click', () => zoomBy(direction * STEP_PX));
  bar.appendChild(button);
}

export function initMapZoom() {
  document.querySelectorAll('.mapframe .mapbar').forEach((bar) => {
    const pre = bar.parentNode.querySelector('pre');
    let size = START_SIZE_PX;
    const zoomBy = (delta) => {
      size = Math.max(MIN_SIZE_PX, Math.min(MAX_SIZE_PX, size + delta));
      pre.style.fontSize = `${size}px`;
    };
    addZoomButton(bar, 'A−', -1, zoomBy);
    addZoomButton(bar, 'A+', 1, zoomBy);
  });
}
