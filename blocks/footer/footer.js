/**
 * Footer for Destination Pet.
 * Navy footer: vertical white logo + link/content columns + copyright bar with
 * social icons. Content is read from /content/footer.plain.html — never hardcoded.
 */

// Fetch the footer fragment: /content first (localhost/aem up), then root (DA/EDS prod).
async function fetchFooter() {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return null;
  const html = await resp.text();
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp;
}

export default async function decorate(block) {
  const fragment = await fetchFooter();
  block.textContent = '';
  if (!fragment) return;

  const sections = [...fragment.children];
  // Section order in footer.plain.html: [logo], [columns], [copyright bar]
  const [brandSection, columnsSection, copyrightSection] = sections;

  const footer = document.createElement('div');
  footer.className = 'footer-inner';

  // --- Top: logo + columns ---
  const top = document.createElement('div');
  top.className = 'footer-top';

  if (brandSection) {
    brandSection.classList.add('footer-brand');
    top.append(brandSection);
  }

  if (columnsSection) {
    columnsSection.classList.add('footer-columns');
    // Wrap each heading (<p>) plus its following block(s) into a column group.
    const groups = [];
    let current = null;
    [...columnsSection.children].forEach((el) => {
      const isHeading = el.tagName === 'P' && !el.querySelector('a[href^="mailto"]');
      const isColumnHeading = el.tagName === 'P'
        && ['Careers', 'About', 'Contact Information'].includes(el.textContent.trim());
      if (isColumnHeading) {
        current = document.createElement('div');
        current.className = 'footer-column';
        groups.push(current);
        current.append(el);
      } else if (current) {
        current.append(el);
      } else if (isHeading) {
        // stray leading paragraph — keep it
        current = document.createElement('div');
        current.className = 'footer-column';
        groups.push(current);
        current.append(el);
      }
    });
    columnsSection.textContent = '';
    groups.forEach((g) => columnsSection.append(g));
    top.append(columnsSection);
  }

  footer.append(top);

  // --- Bottom: copyright + social icons ---
  if (copyrightSection) {
    copyrightSection.classList.add('footer-copyright');
    footer.append(copyrightSection);
  }

  block.append(footer);
}
