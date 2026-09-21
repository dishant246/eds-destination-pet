/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
// (no block parsers — default-content-only template)

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/destpet-cleanup.js';
import sectionsTransformer from './transformers/destpet-sections.js';
import dmImagesTransformer from './transformers/destpet-dm-images.js';

// PARSER REGISTRY
const parsers = {

};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  "name": "intro-content",
  "urls": [
    "https://www.destinationpet.com/join-our-pack/"
  ],
  "coverageGaps": [],
  "description": "Introductory page with two default-content sections and no blocks",
  "blocks": [],
  "sections": [
    {
      "id": "rc1",
      "name": "content",
      "selector": [
        "main > div:first-child",
        "div.root.responsivegrid"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        "h1",
        "p"
      ]
    },
    {
      "id": "rc2",
      "name": "secondary-nav",
      "selector": [
        "body > div.cmp-container"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": []
    }
  ]
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
  dmImagesTransformer,
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  (template.blocks || []).forEach((blockDef) => {
    if (blockDef.name.startsWith('section-')) return;
    (blockDef.instances || []).forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({ name: blockDef.name, selector, element, section: blockDef.section || null });
      });
    });
  });
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
