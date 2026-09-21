/**
 * Header / navigation for Destination Pet.
 * Single-row header: social strip, logo (left), hamburger toggle (right).
 * The hamburger opens a nav panel with nested (accordion) dropdowns.
 * Content is read from /content/nav.plain.html — never hardcoded here.
 */

// Fetch the nav fragment: /content first (localhost/aem up), then root (DA/EDS prod).
async function fetchNav() {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return null;
  const html = await resp.text();
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp;
}

// Wire each list item that has a nested <ul> as an expandable accordion node.
function decorateDropdowns(listRoot) {
  listRoot.querySelectorAll('li').forEach((li) => {
    const sublist = li.querySelector(':scope > ul');
    if (!sublist) return;
    li.classList.add('nav-drop');
    const link = li.querySelector(':scope > a');
    if (!link) return;
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'nav-drop-toggle';
    toggle.setAttribute('aria-label', `Toggle ${link.textContent.trim()} submenu`);
    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const open = li.classList.toggle('nav-drop-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    link.after(toggle);
  });
}

export default async function decorate(block) {
  const fragment = await fetchNav();
  block.textContent = '';
  if (!fragment) return;

  const sections = [...fragment.children];
  // Section order in nav.plain.html: [social], [logo], [nav list]
  const socialSection = sections[0];
  const brandSection = sections[1];
  const navListSection = sections[2];

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-expanded', 'false');

  // --- Social strip (thin top bar) ---
  if (socialSection) {
    socialSection.classList.add('nav-social');
    nav.append(socialSection);
  }

  // --- Brand row: logo + hamburger ---
  const brandRow = document.createElement('div');
  brandRow.className = 'nav-brand-row';
  if (brandSection) {
    brandSection.classList.add('nav-brand');
    brandRow.append(brandSection);
  }

  const hamburger = document.createElement('button');
  hamburger.type = 'button';
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-controls', 'nav');
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span class="nav-hamburger-icon"></span>';
  brandRow.append(hamburger);
  nav.append(brandRow);

  // --- Nav panel (list with nested dropdowns) ---
  if (navListSection) {
    navListSection.classList.add('nav-sections');
    decorateDropdowns(navListSection);
    nav.append(navListSection);
  }

  const toggleMenu = (forceClose) => {
    const open = forceClose ? false : nav.getAttribute('aria-expanded') !== 'true';
    nav.setAttribute('aria-expanded', open ? 'true' : 'false');
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    hamburger.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    document.body.style.overflowY = open ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => toggleMenu());

  // Close on Escape
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && nav.getAttribute('aria-expanded') === 'true') toggleMenu(true);
  });

  // Reset panel state cleanly on viewport change (prevents stuck-open on resize)
  const bp = window.matchMedia('(min-width: 900px)');
  bp.addEventListener('change', () => {
    toggleMenu(true);
    nav.querySelectorAll('.nav-drop-open').forEach((li) => li.classList.remove('nav-drop-open'));
    nav.querySelectorAll('.nav-drop-toggle[aria-expanded="true"]').forEach((t) => t.setAttribute('aria-expanded', 'false'));
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
