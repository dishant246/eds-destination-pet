/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-hero-feature-landing.js
  var import_hero_feature_landing_exports = {};
  __export(import_hero_feature_landing_exports, {
    default: () => import_hero_feature_landing_default
  });

  // tools/importer/parsers/hero-overlay.js
  function parse(element, { document }) {
    const image = element.querySelector(".hero__image img, .cmp-image__image, img");
    const heading = element.querySelector(".hero__content .cmp-title__text, .hero__content h1, .hero__content h2");
    const descParas = Array.from(
      element.querySelectorAll(".hero__content-description p")
    ).filter((p) => p.textContent.trim());
    if (!image && !heading && descParas.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (image) {
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      imageCell.appendChild(image);
      cells.push([imageCell]);
    }
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(" field:text "));
    if (heading) textCell.appendChild(heading);
    descParas.forEach((p) => textCell.appendChild(p));
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-overlay", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-media.js
  function parse2(element, { document }) {
    const left = element.querySelector(".media-info__left");
    const right = element.querySelector(".media-info__right");
    const image = (left || element).querySelector(".cmp-image__image, img");
    const textNodes = Array.from(
      (right || element).querySelectorAll(
        ".media-info__content .cmp-title__text, .media-info__content .cmp-text > p, .media-info__content .cmp-text"
      )
    );
    if (!image && textNodes.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const leftCell = [];
    if (image) leftCell.push(image);
    const rightCell = [];
    textNodes.forEach((n) => rightCell.push(n));
    const cells = [[leftCell, rightCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-media", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse3(element, { document }) {
    const cards = Array.from(element.querySelectorAll(".infocards"));
    if (cards.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cards.forEach((card) => {
      const image = card.querySelector(".info-card__asset img, .cmp-image__image, img");
      const textParts = Array.from(
        card.querySelectorAll(".info-card__text .cmp-title__text, .info-card__text .cmp-text > p")
      );
      const imageCell = document.createDocumentFragment();
      if (image) {
        imageCell.appendChild(document.createComment(" field:image "));
        imageCell.appendChild(image);
      }
      const textCell = document.createDocumentFragment();
      if (textParts.length) {
        textCell.appendChild(document.createComment(" field:text "));
        textParts.forEach((n) => textCell.appendChild(n));
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-callout.js
  function parse4(element, { document }) {
    const content = element.querySelector(".info-card__text") || element;
    const image = content.querySelector(".cmp-image__image, img");
    const heading = content.querySelector(".cmp-title__text, h1, h2, h3");
    const paras = Array.from(content.querySelectorAll(".cmp-text > p"));
    const cta = content.querySelector(".button a, a.button__bdl");
    if (!image && !heading && paras.length === 0 && !cta) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const contentCell = [];
    if (image) contentCell.push(image);
    if (heading) contentCell.push(heading);
    paras.forEach((p) => contentCell.push(p));
    if (cta) contentCell.push(cta);
    const cells = [[contentCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-callout", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/destpet-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, ["link"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".headerRedesign",
        "header",
        "nav",
        ".footer",
        "link",
        "noscript",
        "iframe"
      ]);
    }
  }

  // tools/importer/transformers/destpet-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    for (const sel of selectors) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload && payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        const hr = element.ownerDocument.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || querySection(element, section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(element.ownerDocument, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/transformers/destpet-dm-images.js
  function detectDynamicMediaUrl(urlStr) {
    let u;
    try {
      u = new URL(urlStr, "https://x/");
    } catch (e) {
      return false;
    }
    if (u.pathname.startsWith("/is/image/")) {
      return "scene7";
    }
    if (/^delivery-p\d+-e\d+\.adobeaemcloud\.com$/.test(u.hostname) && u.pathname.startsWith("/adobe/assets/urn:")) {
      return "dm-openapi";
    }
    return false;
  }
  var LINKED_DM_INLINE_WRAPPER_TAGS = /* @__PURE__ */ new Set(["PICTURE"]);
  var LINKED_DM_WRAPPER_SIBLING_TAGS = /* @__PURE__ */ new Set(["SOURCE"]);
  function findLinkedDmCarrier(img) {
    if (!img || !img.parentElement) return null;
    let node = img;
    let parent = img.parentElement;
    while (parent && LINKED_DM_INLINE_WRAPPER_TAGS.has(parent.tagName)) {
      let foundNode = false;
      for (const child of parent.children) {
        if (child === node) {
          foundNode = true;
        } else if (!LINKED_DM_WRAPPER_SIBLING_TAGS.has(child.tagName)) {
          return null;
        }
      }
      if (!foundNode) return null;
      node = parent;
      parent = parent.parentElement;
    }
    if (!parent || parent.tagName !== "A") return null;
    if (parent.children.length !== 1 || parent.children[0] !== node) return null;
    if (parent.textContent.trim() !== "") return null;
    return parent;
  }
  var EMPTY_ALT_SENTINEL = "Image without alt text";
  function altToLinkText(alt) {
    return alt || EMPTY_ALT_SENTINEL;
  }
  function transform3(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const doc = element.ownerDocument;
    element.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (!detectDynamicMediaUrl(src)) return;
      const alt = img.getAttribute("alt") || "";
      const linkedAnchor = findLinkedDmCarrier(img);
      if (linkedAnchor) {
        linkedAnchor.setAttribute("title", src);
        linkedAnchor.textContent = altToLinkText(alt);
        return;
      }
      const parent = img.parentElement;
      if (parent && parent.tagName === "A") {
        console.warn("DM image inside mixed-content anchor, skipped:", src);
        return;
      }
      const a = doc.createElement("a");
      a.href = src;
      a.textContent = altToLinkText(alt);
      img.replaceWith(a);
    });
  }

  // tools/importer/import-hero-feature-landing.js
  var parsers = {
    "hero-overlay": parse,
    "columns-media": parse2,
    "cards-feature": parse3,
    "columns-callout": parse4
  };
  var PAGE_TEMPLATE = {
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
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : [],
    transform3
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
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
      if (blockDef.name.startsWith("section-")) return;
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
  var import_hero_feature_landing_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_hero_feature_landing_exports);
})();
