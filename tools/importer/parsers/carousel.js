/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel (Our Impact image gallery).
 *
 * EDS carousel convention: a container block whose first row is just the block
 * name; each subsequent row is ONE slide. A slide row may contain an image cell
 * (mandatory) and an optional text-content cell. Here the source slides are
 * image-only, so each row has a single image cell tagged field:image
 * (model field media_image).
 *
 * Source: destinationpet.com foundation page — a slick carousel
 * (.carousel.panelcontainer). Slick duplicates slides as .slick-cloned; we skip
 * those and de-dupe by image pathname so each real slide appears once.
 */
export default function parse(element, { document }) {
  const seen = new Set();
  const imgs = [];
  element.querySelectorAll('img').forEach((img) => {
    if (img.closest('.slick-cloned')) return;
    const src = img.getAttribute('src') || '';
    if (!src) return;
    let key = src;
    try { key = new URL(src, 'https://x/').pathname; } catch { /* keep raw */ }
    if (seen.has(key)) return;
    seen.add(key);
    imgs.push(img);
  });

  if (imgs.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // One row per slide; each row = [ image cell ] (field:image / media_image).
  const cells = imgs.map((img) => {
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    imageCell.appendChild(img);
    return [imageCell];
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel', cells });
  element.replaceWith(block);
}
