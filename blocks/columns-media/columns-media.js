/*
 * Columns Media block
 * Two-column media split: image on one side, text (eyebrow + subheading +
 * paragraph) on the other. Stacks on mobile, side-by-side from 900px.
 */

const OPTION_CLASSES = [];

export default function decorate(block) {
  [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  const firstRow = block.firstElementChild;
  const cols = firstRow ? [...firstRow.children] : [];
  block.classList.add(`columns-media-${cols.length}-cols`);

  // tag image-only columns so CSS can order the image first on mobile
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-media-img-col');
        }
      }
    });
  });
}
