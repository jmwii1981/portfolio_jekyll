# Site scripts

`initializeScripts.js` is the browser entry point. It progressively enhances static site search, contact-form validation and submission, consent and analytics loading, the fixed header, mobile navigation, project galleries, recommendations, and the Perspectives feed. Company logos remain a static, responsive grid and do not depend on JavaScript.

`glass/initializeLiquidGlassNavigation.mjs` enhances the fixed dock with a live
SVG backdrop filter in Chromium when reduced motion is not requested. It builds
a local displacement map for the rounded tray perimeter and frosts the interior,
without copying page content or filtering the interactive controls. The map is
rebuilt when the tray changes size, including the vertical-to-horizontal layout
change. Other browsers and reduced-motion users retain the CSS glass fallback.
The sticky Vitae project index keeps its separate CSS-only glass treatment.

The dock follows the supplied Dock Progressions mockup: hamburger, optional
34px Home button (every page except `/`), conditional 24px back-to-top button,
intermediate-section dots, then a 24px scroll-to-bottom button. The bottom
button and its slot disappear when the final section enters the viewport
(24px inset), or the document bottom is reached, and return when scrolling away.
Pages with fewer than two section landmarks use the footer as the bottom region.
The top button grows in over 240ms beyond the existing scroll threshold; its
slot collapses completely at the top. The tray grows about its center vertically
on desktop and horizontally on mobile. Reduced motion skips the transition.
Section discovery uses explicit `data-dock-section` landmarks, then search
landmarks, then outermost sections; the first and last are excluded from dots.
Long dot lists scroll within the available viewport space, and the active dot
is brought into view. The menu is clamped within the desktop viewport.
The Home mask is Font Awesome Free 6.7.2's solid house (CC BY 4.0), from
https://github.com/FortAwesome/Font-Awesome/blob/6.x/svgs/solid/house.svg.

The same rounded contour generates a separate interior alpha mask. The filter
keeps the dock interior's white tint at 64% (80% for the pop-out menu) with a 2px frosting blur; the bevel uses
1% white and a 0.0325px blur. These tints live in the filter, not a uniform CSS
wash over the whole tray. The displacement band is 8px wide and the interior
mask starts 5px inward, feathered by the existing 1.5px mask blur.

Keep `isolation: isolate` on `.dock-control`. The buttons' multiply-blended clay
grain must stay inside their own stacking contexts: an unisolated grain layer
can suppress the sibling tray's SVG backdrop rendering in Chromium. In
particular, `visibility: hidden` on the arrow does not remove that layer from
the compositing arrangement. See the dock regression checks in `design-qa.md`.

`network.mjs` provides bounded fetch requests and retryable request caching for network-dependent enhancements. `network.test.mjs` verifies timeout, response-body, retry, and in-flight request behavior without adding an npm dependency.

`build-search-index.rb` reads the rendered public pages in `_site/` and generates the committed `search-index.json` database. It indexes meaningful page text and non-empty image alternatives, creates precise records for anchored `data-search-section` containers, and removes interface/decorative content before indexing. The Medium article body remains a dynamic browser enhancement and is not copied into this static database.

The `perspectives/` modules fetch the latest Medium item once, convert it into a structured object, sanitize externally supplied markup, and render it into the reserved article container. If the module or request fails—or JavaScript is unavailable—the static Medium fallback remains visible.

`audit-site.rb` checks generated HTML after a Jekyll build:

```bash
bundle exec jekyll build
ruby scripts/build-search-index.rb --check
node --check scripts/initializeScripts.js
for file in scripts/glass/*.mjs; do node --check "$file"; done
for file in scripts/perspectives/*.mjs; do node --check "$file"; done
for file in scripts/search/*.mjs; do node --check "$file"; done
node --input-type=module --check < scripts/third-party/liquidGL.js
node scripts/network.test.mjs
node scripts/search/searchIndex.test.cjs
ruby scripts/audit-site.rb
```

The audit enforces the site’s single branded `h1`, landmark and skip-link structure, unique IDs and valid ARIA references, image alternatives and intrinsic dimensions, valid local `srcset` candidates, safe new-tab links, contact-form fallbacks, 404 indexing rules, valid JSON-LD/XML, and sitemap hygiene. These checks also run in GitHub Actions when code is pushed.
