/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-feature.
 * Base block: cards (container block). xwalk child model "card".
 * Source: destinationpet.com feature grid (.columncontainer... with .infocards)
 * Each card row has 2 cells:
 *   cell 1 -> image (field:image); imageAlt collapses into <img alt>.
 *   cell 2 -> text (field:text) as richtext: heading(s) + description.
 *
 * IMPORTANT: the source section also contains a section heading (e.g.
 * "We work together to be...") BEFORE the cards and a CTA link (e.g.
 * "More about us") AFTER them. Those are default content and must survive.
 * So we build the block, insert it at the cards' position inside the section,
 * and remove only the card nodes — leaving the heading and CTA in place.
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('.infocards'));

  // Empty-block guard: unwrap the element, keep its children.
  if (cards.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cards.forEach((card) => {
    const image = card.querySelector('.info-card__asset img, .cmp-image__image, img');
    const textParts = Array.from(
      card.querySelectorAll('.info-card__text .cmp-title__text, .info-card__text .cmp-text > p'),
    );

    const imageCell = document.createDocumentFragment();
    if (image) {
      imageCell.appendChild(document.createComment(' field:image '));
      imageCell.appendChild(image);
    }

    const textCell = document.createDocumentFragment();
    if (textParts.length) {
      textCell.appendChild(document.createComment(' field:text '));
      textParts.forEach((n) => textCell.appendChild(n));
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });

  // Determine the cards group's insertion point: the highest ancestor of the
  // first card that is still a descendant of the section (element) and that
  // contains every card. Insert the block before it, then remove that group —
  // preserving the section heading/CTA that live as siblings.
  let group = cards[0];
  while (
    group.parentElement
    && group.parentElement !== element
    && cards.every((c) => group.parentElement.contains(c))
  ) {
    group = group.parentElement;
  }

  if (group && group.parentElement) {
    group.parentElement.insertBefore(block, group);
    // remove any remaining card nodes not inside the removed group
    group.remove();
    cards.forEach((c) => { if (c.isConnected) c.remove(); });
  } else {
    element.replaceWith(block);
  }
}
