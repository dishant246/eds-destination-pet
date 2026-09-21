/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-feature.
 * Base block: cards (container block). xwalk child model "card".
 * Source: destinationpet.com feature grid (.columncontainer... with .infocards)
 * Each card row has 2 cells:
 *   cell 1 -> image (field:image); imageAlt collapses into <img alt>.
 *   cell 2 -> text (field:text) as richtext: heading(s) + description.
 * An image or text cell may be empty but the cell must still exist.
 */
export default function parse(element, { document }) {
  // INPUT EXTRACTION (validated against source.html)
  const cards = Array.from(element.querySelectorAll('.infocards'));

  // Empty-block guard
  if (cards.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  cards.forEach((card) => {
    // Image/icon lives in the card asset area.
    const image = card.querySelector('.info-card__asset img, .cmp-image__image, img');

    // Text content: titles (h2/h3) + description richtext.
    const textParts = Array.from(
      card.querySelectorAll('.info-card__text .cmp-title__text, .info-card__text .cmp-text > p'),
    );

    // Cell 1: image (field:image). Empty cell if no image.
    const imageCell = document.createDocumentFragment();
    if (image) {
      imageCell.appendChild(document.createComment(' field:image '));
      imageCell.appendChild(image);
    }

    // Cell 2: text (field:text). Empty cell if no text.
    const textCell = document.createDocumentFragment();
    if (textParts.length) {
      textCell.appendChild(document.createComment(' field:text '));
      textParts.forEach((n) => textCell.appendChild(n));
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
