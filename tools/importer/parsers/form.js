/* eslint-disable */
/* global WebImporter */
/**
 * Parser for form.
 * Base block: form (store-locator, simple block, xwalk model "form").
 * Source: destinationpet.com store locator (.centerlocator)
 * Model fields (each a row, with field hint before content):
 *   heading (richtext)      <- search panel heading
 *   description (richtext)  <- intro paragraph
 *   placeholder (text)      <- search input placeholder label
 *   toggleLabel (text)      <- map-view toggle label
 * Live map DOM is trimmed out; only authored panel fields are parsed.
 */
export default function parse(element, { document }) {
  const panel = element.querySelector('.search_section') || element;

  // INPUT EXTRACTION (validated against source.html)
  const heading = panel.querySelector('.cmp-text h1, .cmp-text h2, h1, h2');
  const description = panel.querySelector('.richtext1 .cmp-text p, .cmp-text p');

  // Search placeholder: use the input's placeholder if authored, else a default label.
  const searchInput = panel.querySelector('#searchBar, .input_field');
  const placeholderText = (searchInput && (searchInput.getAttribute('placeholder') || '').trim())
    || 'Search by city or ZIP code';

  // Map-view toggle label.
  const toggleLabelText = 'Map view';

  // Empty-block guard
  if (!heading && !description) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row: heading (field:heading)
  const headingCell = document.createDocumentFragment();
  headingCell.appendChild(document.createComment(' field:heading '));
  if (heading) headingCell.appendChild(heading);
  cells.push([headingCell]);

  // Row: description (field:description)
  const descCell = document.createDocumentFragment();
  descCell.appendChild(document.createComment(' field:description '));
  if (description) descCell.appendChild(description);
  cells.push([descCell]);

  // Row: placeholder (field:placeholder)
  const placeholderCell = document.createDocumentFragment();
  placeholderCell.appendChild(document.createComment(' field:placeholder '));
  placeholderCell.appendChild(document.createTextNode(placeholderText));
  cells.push([placeholderCell]);

  // Row: toggleLabel (field:toggleLabel)
  const toggleCell = document.createDocumentFragment();
  toggleCell.appendChild(document.createComment(' field:toggleLabel '));
  toggleCell.appendChild(document.createTextNode(toggleLabelText));
  cells.push([toggleCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'form', cells });
  element.replaceWith(block);
}
