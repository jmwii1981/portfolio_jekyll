# Site scripts

`initializeScripts.js` is the browser entry point. It progressively enhances heading line endings, static site search, contact-form validation and submission, consent and analytics loading, the fixed header, mobile navigation, project galleries, the company-logo carousel, recommendations, and the Perspectives feed.

`glass/initializeLiquidGlassNavigation.mjs` progressively enhances the fixed
header with the vendored liquidGL 2.0.1 renderer. The sticky Work project index
uses a stable CSS-only glass treatment so scrolling content cannot introduce
refraction artifacts along its shallow rectangular edges.
The vendored renderer includes a local `edgeOnly` option that confines WebGL
refraction, frost, and specular light to its existing bevel band. The
enhancement runs only on supported desktop browsers with a fine pointer, motion
enabled, data saver disabled, and WebGL available. Safari, mobile,
reduced-motion, data-saver, and initialization-failure paths retain the native
CSS glass treatment. The library never owns the interactive navigation
elements; it renders through separate pointer-free decorative layers. Its MIT
license is stored beside the source in `third-party/` and copied into the
generated site.

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
