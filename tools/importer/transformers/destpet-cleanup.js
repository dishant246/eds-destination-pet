/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: destinationpet.com site-wide cleanup.
 * Removes non-authorable global chrome (header, ribbon, primary nav, footer)
 * and non-authorable leftover elements (clientlib <link>/<noscript>, tracking).
 * All selectors verified against migration-work/cleaned.html.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Dynamic Media clientlib <link> stylesheets embedded in the hero markup
    // (cleaned.html lines 329-331). Removed early so they don't interfere with
    // block parsing/matching. Bare <link> also caught in afterTransform.
    WebImporter.DOMUtils.remove(element, ['link']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome.
    // .headerRedesign wraps the entire top chrome: ribbon (social links,
    //   contact, CTA button), sticky <header>, logo, and primary <nav>
    //   (cleaned.html line 4).
    // .footer is the site footer block: logo, category link columns,
    //   contact content-fragment, copyright, social share (cleaned.html line 671).
    WebImporter.DOMUtils.remove(element, [
      '.headerRedesign',
      'header',
      'nav',
      '.footer',
      'link',
      'noscript',
      'iframe',
    ]);
  }
}
