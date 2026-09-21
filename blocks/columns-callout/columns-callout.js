/*
 * Columns Callout block
 * A centered single-column promotional callout: an illustrated icon, a
 * paragraph of copy, and a centered CTA — grouped as one authored unit.
 */

const OPTION_CLASSES = [];

export default function decorate(block) {
  [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  // tag the icon column (picture-only) so CSS can size/center it distinctly
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic && col.children.length === 1) {
        col.classList.add('columns-callout-icon');
      } else {
        col.classList.add('columns-callout-body');
      }
    });
  });
}
