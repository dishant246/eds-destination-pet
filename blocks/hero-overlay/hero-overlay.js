/*
 * Hero Overlay block
 * Full-bleed background photograph with a centered heading overlaid on top.
 *
 * Expected authored structure (standalone model):
 *   an image (background) and a heading/text block.
 * The image is positioned behind the text via CSS; decorate() only ensures the
 * picture and text are tagged so the CSS can layer them.
 */

const OPTION_CLASSES = [];

export default function decorate(block) {
  // tolerate extra/unknown option tokens; branch only on known ones (none yet)
  [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  const picture = block.querySelector('picture');
  if (picture) {
    const pictureWrapper = picture.closest('div');
    if (pictureWrapper) pictureWrapper.classList.add('hero-overlay-image');
  }

  // the remaining content (heading/paragraph) is the text overlay
  [...block.children].forEach((row) => {
    if (!row.querySelector('picture')) row.classList.add('hero-overlay-content');
  });
}
