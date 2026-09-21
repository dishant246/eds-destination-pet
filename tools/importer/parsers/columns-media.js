/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-media.
 * Base block: columns (2 columns, 1 row). xwalk "columns" resourceType.
 * Source: destinationpet.com media-info split (.mediainfo)
 * Columns blocks use ONLY default content in cells — NO field hints.
 * Structure: one content row with 2 cells: [media/image] | [text content].
 */
export default function parse(element, { document }) {
  // INPUT EXTRACTION (validated against source.html)
  const left = element.querySelector('.media-info__left');
  const right = element.querySelector('.media-info__right');

  // Left column: image/media.
  const image = (left || element).querySelector('.cmp-image__image, img');

  // Right column: titles (h2/h3) + richtext paragraphs.
  const textNodes = Array.from(
    (right || element).querySelectorAll(
      '.media-info__content .cmp-title__text, .media-info__content .cmp-text > p, .media-info__content .cmp-text',
    ),
  );

  // Empty-block guard
  if (!image && textNodes.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const leftCell = [];
  if (image) leftCell.push(image);

  const rightCell = [];
  textNodes.forEach((n) => rightCell.push(n));

  // Single content row, 2 columns. No field hints for columns blocks.
  const cells = [[leftCell, rightCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-media', cells });
  element.replaceWith(block);
}
