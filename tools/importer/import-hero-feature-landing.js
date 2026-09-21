/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroOverlayParser from './parsers/hero-overlay.js';
import columnsMediaParser from './parsers/columns-media.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import columnsCalloutParser from './parsers/columns-callout.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/destpet-cleanup.js';
import sectionsTransformer from './transformers/destpet-sections.js';
import dmImagesTransformer from './transformers/destpet-dm-images.js';

// PARSER REGISTRY
const parsers = {
  'hero-overlay': heroOverlayParser,
  'columns-media': columnsMediaParser,
  'cards-feature': cardsFeatureParser,
  'columns-callout': columnsCalloutParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  "name": "hero-feature-landing",
  "urls": [
    "https://www.destinationpet.com/",
    "https://www.destinationpet.com/about-us/about/",
    "https://www.destinationpet.com/about-us/get-in-touch/",
    "https://www.destinationpet.com/about-us/meet-the-team/business-development-leaders/",
    "https://www.destinationpet.com/about-us/meet-the-team/leadership/",
    "https://www.destinationpet.com/join-our-pack/find-a-veterinary-externship/",
    "https://www.destinationpet.com/join-our-pack/life-at-dp/",
    "https://www.destinationpet.com/live-webinar/",
    "https://www.destinationpet.com/live-webinar/webinar-redirect/",
    "https://www.destinationpet.com/live-webinar/webinar-registration/",
    "https://www.destinationpet.com/live-webinar/webinar-viewing-previous/",
    "https://www.destinationpet.com/live-webinar/webinars-for-pet/",
    "https://www.destinationpet.com/our-locations/",
    "https://www.destinationpet.com/sell-your-business/",
    "https://www.destinationpet.com/sell-your-business/sell-your-pet-resort/",
    "https://www.destinationpet.com/sell-your-business/sell-your-veterinary-practice/"
  ],
  "coverageGaps": [],
  "description": "Rich landing page: hero banner, media-info split section, multi-column feature grids, and testimonial cards",
  "blocks": [
    {
      "name": "hero-overlay",
      "instances": [
        ".hero.teaser"
      ]
    },
    {
      "name": "columns-media",
      "instances": [
        ".mediainfo"
      ]
    },
    {
      "name": "cards-feature",
      "instances": [
        ".columncontainer.background-color--tertiary.spacing__top-bottom--40px:nth-of-type(3)"
      ]
    },
    {
      "name": "columns-callout",
      "instances": [
        ".columncontainer.spacing__top--40px"
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
      "name": "media-info",
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
      "id": "rc3",
      "name": "feature-grid",
      "selector": [
        ".columncontainer.background-color--tertiary.spacing__top-bottom--40px:nth-of-type(3)"
      ],
      "style": "grey",
      "blocks": [
        "cards-feature"
      ],
      "defaultContent": []
    },
    {
      "id": "rc4",
      "name": "sell-callout",
      "selector": [
        ".columncontainer.spacing__top--40px"
      ],
      "style": null,
      "blocks": [
        "columns-callout"
      ],
      "defaultContent": []
    },
    {
      "id": "rc5",
      "name": "testimonials",
      "selector": [
        ".columncontainer.background-color--tertiary.spacing__top-bottom--40px:nth-of-type(5)"
      ],
      "style": "grey",
      "blocks": [],
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
