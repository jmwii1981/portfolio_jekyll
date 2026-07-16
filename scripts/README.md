# Site scripts

`initializeScripts.js` is the browser entry point. It progressively enhances contact-form validation and submission, consent and analytics loading, the fixed header, mobile navigation, reveal effects, project galleries, logo motion, the company-logo carousel, recommendations, and the Perspectives feed.

The `perspectives/` modules fetch the latest Medium item once, convert it into a structured object, sanitize externally supplied markup, and render it into the reserved article container. If the module or request fails—or JavaScript is unavailable—the static Medium fallback remains visible.

`audit-site.rb` checks generated HTML after a Jekyll build:

```bash
bundle exec jekyll build
node --check scripts/initializeScripts.js
for file in scripts/perspectives/*.mjs; do node --check "$file"; done
ruby scripts/audit-site.rb
```

The audit enforces the site’s single branded `h1`, landmark and skip-link structure, unique IDs and valid ARIA references, image alternatives and intrinsic dimensions, valid local `srcset` candidates, safe new-tab links, contact-form fallbacks, 404 indexing rules, valid JSON-LD/XML, and sitemap hygiene. These checks also run in GitHub Actions when code is pushed.
