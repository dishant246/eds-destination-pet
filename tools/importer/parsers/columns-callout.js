/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-callout.
 * Base block: columns (1 column, 1 row). xwalk "columns" resourceType.
 * Source: destinationpet.com centered callout (.columncontainer.spacing__top--40px)
 * Columns blocks use ONLY default content in cells — NO field hints.
 * Structure: one content row with 1 cell holding image + text + CTA.
 */
export default function parse(element, { document }) {
  // INPUT EXTRACTION (validated against source.html)
  // The authored content lives inside the info-card__text container.
  const content = element.querySelector('.info-card__text') || element;

  const image = content.querySelector('.cmp-image__image, img');
  const heading = content.querySelector('.cmp-title__text, h1, h2, h3');
  const paras = Array.from(content.querySelectorAll('.cmp-text > p'));
  const cta = content.querySelector('.button a, a.button__bdl');

  // Empty-block guard
  if (!image && !heading && paras.length === 0 && !cta) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // 1-column block: all content goes in one cell (one row, one cell).
  const contentCell = [];
  if (image) contentCell.push(image);
  if (heading) contentCell.push(heading);
  paras.forEach((p) => contentCell.push(p));
  if (cta) contentCell.push(cta);

  const cells = [[contentCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-callout', cells });
  element.replaceWith(block);
}
