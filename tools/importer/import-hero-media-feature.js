/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroOverlayParser from './parsers/hero-overlay.js';
import columnsCalloutParser from './parsers/columns-callout.js';
import columnsMediaParser from './parsers/columns-media.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/destpet-cleanup.js';
import sectionsTransformer from './transformers/destpet-sections.js';
import dmImagesTransformer from './transformers/destpet-dm-images.js';

// PARSER REGISTRY
const parsers = {
  'hero-overlay': heroOverlayParser,
  'columns-callout': columnsCalloutParser,
  'columns-media': columnsMediaParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  "name": "hero-media-feature",
  "urls": [
    "https://www.destinationpet.com/about-us/destination-pet-foundation/"
  ],
  "coverageGaps": [],
  "description": "Landing variant with hero, media-info split, and 2-column plus 3-column feature sections",
  "blocks": [
    {
      "name": "hero-overlay",
      "instances": [
        ".hero.teaser"
      ]
    },
    {
      "name": "columns-callout",
      "instances": [
        ".columncontainer.spacing__top-bottom--40px:nth-of-type(2)",
        ".columncontainer.spacing__top--16px.spacing__top-bottom--40px"
      ]
    },
    {
      "name": "columns-media",
      "instances": [
        ".mediainfo"
      ]
    }
  ],
  "sections": [
    {
      "id": "rc1",
      "name": "hero",
      "selector": [
        ".hero.teaser"
      ],
      "style": null,
      "blocks": [
        "hero-overlay"
      ],
      "defaultContent": []
    },
    {
      "id": "rc2",
      "name": "mission",
      "selector": [
        ".columncontainer.spacing__top-bottom--40px:nth-of-type(2)"
      ],
      "style": null,
      "blocks": [
        "columns-callout"
      ],
      "defaultContent": []
    },
    {
      "id": "rc3",
      "name": "about-image",
      "selector": [
        ".image.image__center"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        ".image.image__center"
      ]
    },
    {
      "id": "rc4",
      "name": "our-impact",
      "selector": [
        ".mediainfo"
      ],
      "style": null,
      "blocks": [
        "columns-media"
      ],
      "defaultContent": []
    },
    {
      "id": "rc5",
      "name": "donate-callout",
      "selector": [
        ".columncontainer.spacing__top--16px.spacing__top-bottom--40px"
      ],
      "style": null,
      "blocks": [
        "columns-callout"
      ],
      "defaultContent": []
    },
    {
      "id": "rc6",
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
