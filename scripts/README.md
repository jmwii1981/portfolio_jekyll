# Site scripts

`initializeScripts.js` is the browser entry point. It progressively enhances inquiry email links, consent and analytics loading, the fixed header, mobile navigation, reveal effects, project galleries, logo motion, the company-logo carousel, recommendations, and the Perspectives feed.

The `perspectives/` modules fetch the latest Medium item once, convert it into a structured object, sanitize externally supplied markup, and render it into the server-authored fallback container. If the request fails or JavaScript is unavailable, the static Medium fallback remains visible.

`audit-site.rb` checks generated HTML after a Jekyll build:

```bash
bundle exec jekyll build
node --check scripts/initializeScripts.js
ruby scripts/audit-site.rb
```

The audit enforces the site’s single branded `h1`, alternative text on images, safe new-tab links, valid JSON-LD, and sitemap hygiene. These checks also run in GitHub Actions when code is pushed.
