# Jan Michael Wallace Portfolio

Personal portfolio site for [janmichael.io](https://janmichael.io), built with Jekyll and published from the `gh-pages` branch.

The site presents selected work, perspectives, contact information, client/company logos, recommendations, and legal/privacy content. It is intentionally lightweight: authored Markdown, Jekyll includes/layouts, Sass partials, local fonts, SVG assets, and a small amount of JavaScript for progressive interactions.

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

Current behaviors include progressive enhancements such as nav underline behavior, carousel behavior, recommendation rotation, consent handling, and related page interactions. The site should remain readable and navigable without JavaScript.

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

Pushing to `gh-pages` also runs the site-quality workflow. It builds the site, checks JavaScript syntax, and verifies heading identity, image alternatives, external-link safety, JSON-LD validity, and sitemap hygiene.

Run the same checks locally before committing:

```bash
bundle exec jekyll build
node --check scripts/initializeScripts.js
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
