/*
 * Form (store-locator) block
 * Structural layout: a search/intro panel beside a map region.
 *
 * Expected authored structure (standalone model), each row optional:
 *   row 1: heading (e.g. "Look us up, we're in the neighborhood.")
 *   row 2: description text
 *   row 3: search input placeholder text (falls back to "Enter a location")
 *   row 4: map view toggle label (falls back to "Map view")
 *
 * The live map is a third-party integration and is rendered as a labelled
 * placeholder region here; a design/integration pass wires the real map in.
 */

const OPTION_CLASSES = [];

export default function decorate(block) {
  // read the known option tokens (none defined yet, but tolerate extras)
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  const rows = [...block.children];
  const cellText = (row) => (row ? row.textContent.trim() : '');

  const headingText = cellText(rows[0]);
  const descriptionRow = rows[1];
  const placeholder = cellText(rows[2]) || 'Enter a location';
  const toggleLabel = cellText(rows[3]) || 'Map view';

  // Left panel: intro + search + toggle
  const panel = document.createElement('div');
  panel.className = 'form-panel';

  if (headingText) {
    const heading = document.createElement('h2');
    heading.className = 'form-heading';
    heading.textContent = headingText;
    panel.append(heading);
  }

  if (descriptionRow && descriptionRow.textContent.trim()) {
    const description = document.createElement('div');
    description.className = 'form-description';
    // preserve authored inline markup where present
    description.innerHTML = descriptionRow.innerHTML;
    panel.append(description);
  }

  const search = document.createElement('div');
  search.className = 'form-search';
  const searchLabel = document.createElement('label');
  searchLabel.className = 'form-search-label';
  searchLabel.setAttribute('for', 'form-location-search');
  searchLabel.textContent = placeholder;
  const input = document.createElement('input');
  input.className = 'form-search-input';
  input.id = 'form-location-search';
  input.type = 'search';
  input.placeholder = placeholder;
  input.setAttribute('aria-label', placeholder);
  search.append(searchLabel, input);
  panel.append(search);

  const toggle = document.createElement('div');
  toggle.className = 'form-toggle';
  const toggleText = document.createElement('span');
  toggleText.className = 'form-toggle-label';
  toggleText.textContent = toggleLabel;
  const control = document.createElement('label');
  control.className = 'form-toggle-switch';
  const toggleInput = document.createElement('input');
  toggleInput.type = 'checkbox';
  toggleInput.setAttribute('aria-label', toggleLabel);
  toggleInput.checked = true;
  const slider = document.createElement('span');
  slider.className = 'form-toggle-slider';
  control.append(toggleInput, slider);
  toggle.append(toggleText, control);
  panel.append(toggle);

  // Right region: map placeholder
  const mapRegion = document.createElement('div');
  mapRegion.className = 'form-map';
  mapRegion.setAttribute('role', 'region');
  mapRegion.setAttribute('aria-label', 'Location map');

  block.replaceChildren(panel, mapRegion);

  // keep any recognized option classes on the element (no-op branch retained
  // so future options fold in cleanly)
  active.forEach((token) => block.classList.add(token));
}
