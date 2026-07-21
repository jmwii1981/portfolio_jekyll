# Jan Michael Wallace Portfolio

Personal portfolio site for [janmichael.io](https://janmichael.io), built with Jekyll and published from the `gh-pages` branch.

The site presents selected work, perspectives, contact information, client/company logos, recommendations, and legal/privacy content. It is intentionally lightweight: authored Markdown, Jekyll includes/layouts, Sass partials, local fonts, SVG assets, and a small amount of JavaScript for progressive interactions.

The project’s durable design, accessibility, engineering, content, and release requirements are maintained in [PROJECT_REQUIREMENTS.md](PROJECT_REQUIREMENTS.md).

## Tech Stack

- **Jekyll / GitHub Pages** for static site generation
- **Sass** via `master.scss` and `_sass/`
- **Vanilla JavaScript** in `scripts/`
- **Local fonts** in `fonts/`
- **SVG assets** for icons, logos, and favicons

## Getting Started

Install Ruby dependencies:

```bash
bundle install
```

Run the site locally with live reload:

```bash
bundle exec jekyll serve --livereload
```

Build the production site:

```bash
bundle exec jekyll build
ruby scripts/build-search-index.rb
bundle exec jekyll build
```

The generated site is written to `_site/`.

## Project Structure

```text
.
├── _config.yml              # Jekyll site settings
├── _includes/               # Reusable Liquid includes
├── _layouts/                # Page templates
├── _posts/                  # Blog/post content
├── _sass/                   # Sass architecture
├── assets/                  # Static asset folder
├── favicons/                # Browser/device icons
├── fonts/                   # Local web fonts
├── images/                  # Image and logo assets
├── scripts/                 # Site JavaScript
├── index.markdown           # About/home page
├── work.markdown            # Work page
├── perspectives.markdown    # Perspectives page
├── contact.markdown         # Contact page
└── terms.markdown           # Terms and privacy page
```

## Sass Organization

Styles live in `_sass/` and are organized by responsibility:

- `global/`: tokens, base styles, typography
- `layouts/`: page-level structure
- `components/`: reusable UI pieces
- `includes/`: header, nav, footer, and other include-specific styles
- `pages/`: page and section-specific styles
- `fonts/`: font declarations
- `resets/`: browser normalization

Before adding a new style, use the narrowest durable home. Shared primitives belong in `global/`; one-off page sections belong in `pages/`.

## Assets

Company logo SVGs live in:

```text
images/company-logos/
```

Most SVG logo and icon fills use:

```css
var(--color-icon-muted, #7F8490)
```

This keeps brand/logo treatments visually consistent with the site palette while still providing a fallback color if CSS variables are unavailable.

## JavaScript

The main entry point is:

```text
scripts/initializeScripts.js
```

Current behaviors include the static site search, progressive contact-form validation and submission, an optional sliding desktop-navigation indicator, user-controlled carousels and recommendations, consent handling, and related page interactions. The site remains readable and navigable without JavaScript.

### Progressive-enhancement standard

Native HTML and CSS are the default implementation layer for this project. JavaScript is added only when a behavior cannot be delivered reliably and accessibly with those layers alone.

- Authored content, navigation, links, contact details, and form submission must remain available without JavaScript.
- Authored HTML—not JavaScript—must provide the baseline semantics, hierarchy, labels, relationships, and reading order.
- Layout, responsive presentation, visual states, transitions, and animations belong in CSS whenever CSS can express them.
- Interactive enhancements must begin from a usable static state. A script-dependent control remains hidden until its own enhancement has initialized successfully; a generic `js` class is not enough.
- Newer CSS features must retain a readable fallback through source order, fallback declarations, or `@supports` rules.
- Motion must respect `prefers-reduced-motion`, and forced-color modes must retain visible controls and focus states.
- JavaScript may manage data retrieval, generated search results, persisted consent, carousel state, focus movement, `inert`, live regions, and synchronization of a working enhancement’s dynamic ARIA state. It must never be the sole source of essential semantics or operability.
- CSS-only state techniques must not replace native or scripted controls when doing so would weaken keyboard behavior, focus management, semantics, or assistive-technology support.

For example, the mobile navigation remains an ordinary list of links unless its accessible overlay enhancement initializes. Its line motion and menu transitions are CSS; its script synchronizes open/closed state, scroll locking, focus containment, background inertness, and ARIA state. On desktop, each link always has CSS active, hover, and focus underlines; after successful measurement, JavaScript may replace them with one continuous sliding indicator whose interpolation remains in CSS. Search remains hidden until its modal, index, keyboard behavior, and result announcements are ready.

### Static search database

`search-index.json` is a generated, committed data file used by the navigation search. It includes the meaningful rendered text and useful image descriptions from the site’s public pages while excluding navigation, controls, decorative SVGs, hidden content, and loading placeholders. The browser downloads it only when search is opened.

When authored content changes, rebuild the database before committing:

```bash
bundle exec jekyll build
ruby scripts/build-search-index.rb
bundle exec jekyll build
```

Add `data-search-section` to an anchored content container when it deserves a precise result. Optional `data-search-title`, `data-search-category`, `data-search-summary`, and `data-search-keywords` attributes improve presentation and ranking. The page-level record still makes unannotated meaningful content searchable.

The Medium article body on Perspectives remains dynamic and is deliberately not copied into the static database.

## Deployment

This project is deployed through GitHub Pages from the `gh-pages` branch.

Typical release flow:

```bash
git status
bundle exec jekyll build
git add <changed-files>
git commit -m "Describe the change"
git push origin gh-pages
```

Pushing to `gh-pages` also runs the site-quality workflow. It builds the site, checks JavaScript syntax, and verifies page structure, ARIA references, responsive image delivery, contact fallbacks, metadata, external-link safety, JSON-LD/XML validity, and sitemap hygiene.

Run the same checks locally before committing:

```bash
bundle exec jekyll build
ruby scripts/build-search-index.rb --check
node --check scripts/initializeScripts.js
for file in scripts/perspectives/*.mjs; do node --check "$file"; done
for file in scripts/search/*.mjs; do node --check "$file"; done
node scripts/search/searchIndex.test.cjs
ruby scripts/audit-site.rb
```

Avoid committing generated or local system files such as `.DS_Store`, temporary PDFs, or `_site/` output unless intentionally required.

## Maintenance Notes

- Keep spacing and width decisions tied to existing site tokens where possible.
- Use `--site-frame-gutter` for the visible page edge shared by the header, hero, content sections, and footer.
- Use `--site-max-width` for the overall site container.
- Keep nav/header styles consolidated in `_sass/includes/`.
- Keep authored page content in Markdown files unless a reusable include is warranted.

## License

See [LICENSE](LICENSE).
