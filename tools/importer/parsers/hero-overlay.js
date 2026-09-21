/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-overlay.
 * Base block: hero (simple block, xwalk model "hero-overlay").
 * Source: destinationpet.com landing hero (.hero.teaser)
 * Model fields: image (reference), imageAlt (collapsed -> img alt), text (richtext).
 * Structure: 1 column. One row per non-collapsed field with a field hint.
 */
export default function parse(element, { document }) {
  // INPUT EXTRACTION (validated against source.html)
  // Background/hero image lives in the dynamicmedia/cq-dd-image area.
  const image = element.querySelector('.hero__image img, .cmp-image__image, img');

  // Overlay text: the headline (h1) plus any description paragraph.
  const heading = element.querySelector('.hero__content .cmp-title__text, .hero__content h1, .hero__content h2');
  const descParas = Array.from(
    element.querySelectorAll('.hero__content-description p'),
  ).filter((p) => p.textContent.trim());

  // Empty-block guard
  if (!image && !heading && descParas.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row: image (field:image). imageAlt is collapsed into the <img alt> attribute.
  if (image) {
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    imageCell.appendChild(image);
    cells.push([imageCell]);
  }

  // Row: text (field:text) - heading + optional description as richtext.
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));
  if (heading) textCell.appendChild(heading);
  descParas.forEach((p) => textCell.appendChild(p));
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-overlay', cells });
  element.replaceWith(block);
}
