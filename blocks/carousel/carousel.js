import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/*
 * Carousel block — image slider with numbered indicators.
 * Matches destinationpet.com "Our Impact" gallery: one image visible at a
 * time, numbered dot navigation (1..N) below. Each authored row = one slide
 * (an image cell).
 */

function showSlide(block, index) {
  const slides = block.querySelectorAll('.carousel-slide');
  const indicators = block.querySelectorAll('.carousel-indicator');
  const total = slides.length;
  const active = ((index % total) + total) % total;
  slides.forEach((s, i) => {
    s.setAttribute('aria-hidden', i !== active);
  });
  indicators.forEach((btn, i) => {
    btn.setAttribute('aria-current', i === active ? 'true' : 'false');
  });
  block.dataset.activeSlide = active;
}

export default function decorate(block) {
  const rows = [...block.children];
  const slidesWrapper = document.createElement('div');
  slidesWrapper.className = 'carousel-slides';

  rows.forEach((row, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.dataset.slideIndex = i;
    slide.setAttribute('aria-hidden', i !== 0);
    moveInstrumentation(row, slide);
    while (row.firstElementChild) slide.append(row.firstElementChild);
    slidesWrapper.append(slide);
  });

  // optimize images
  slidesWrapper.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '900' }]);
    moveInstrumentation(img, optimized.querySelector('img'));
    img.closest('picture').replaceWith(optimized);
  });

  block.textContent = '';
  block.append(slidesWrapper);

  const slideCount = slidesWrapper.children.length;
  if (slideCount > 1) {
    const nav = document.createElement('div');
    nav.className = 'carousel-indicators';
    for (let i = 0; i < slideCount; i += 1) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'carousel-indicator';
      btn.setAttribute('aria-label', `Show slide ${i + 1} of ${slideCount}`);
      btn.setAttribute('aria-current', i === 0 ? 'true' : 'false');
      btn.textContent = i + 1;
      btn.addEventListener('click', () => showSlide(block, i));
      nav.append(btn);
    }
    block.append(nav);
  }

  block.dataset.activeSlide = 0;
}
