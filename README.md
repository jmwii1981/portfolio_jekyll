# janmichael.io

Source for [janmichael.io](https://janmichael.io), the personal portfolio of Jan Michael Wallace II. The site presents selected product-design work, professional experience, perspectives, recommendations, and contact information.

The site is static, lightweight, and progressively enhanced. Its content and navigation remain available without JavaScript; scripts add search, form feedback, consent handling, navigation behavior, and other optional interactions.

Durable design, accessibility, content, engineering, privacy, and release standards are maintained privately outside the published repository.

## Architecture

- **Jekyll and GitHub Pages** generate and host the site.
- **Markdown and Liquid** provide authored pages and reusable templates.
- **Sass** compiles the design system from `master.scss` and `_sass/`.
- **Vanilla JavaScript** provides progressive enhancements from `scripts/`.
- **YAML data** in `_data/work_projects.yml` supplies shared project summaries.
- **Local fonts and optimized media** avoid unnecessary runtime dependencies.
- **GitHub Actions** builds and audits every pull request and push to `gh-pages`.

There is no application server, database, JavaScript framework, npm build, or client-side router.

## Requirements

- Ruby 3.3.5, matching the GitHub Actions environment
- Bundler
- Node.js for JavaScript syntax and search tests

Install the Ruby dependencies:

```bash
bundle install
```

No npm installation is required.

## Local Development

Run the site with live reload:

```bash
bundle exec jekyll serve --livereload
```

Jekyll serves the site at `http://127.0.0.1:4000/` by default. Generated output is written to `_site/` and must not be committed.

### Production build

Content changes require a two-pass build because the committed search database is generated from rendered pages:

```bash
bundle exec jekyll build
bundle exec ruby scripts/build-search-index.rb
bundle exec jekyll build
```

The first build renders the current content, the generator refreshes `search-index.json`, and the second build includes the refreshed index in `_site/`.

## Project Structure

```text
.
├── .github/workflows/       # Continuous quality checks
├── _config.yml              # Jekyll and site metadata
├── _data/work_projects.yml  # Shared public project summaries
├── _includes/               # Reusable Liquid includes
├── _layouts/                # Page and redirect templates
├── _sass/                   # Design tokens, components, layouts, and pages
├── favicons/                # Browser and device icons
├── fonts/                   # Local web fonts
├── images/                  # Headshots, project media, and company logos
├── scripts/                 # Progressive enhancements and quality tooling
├── work/                    # Focused project pages
├── index.markdown           # Home and about content
├── work.markdown            # Portfolio overview
├── perspectives.markdown    # Writing and Medium integration
├── links.markdown           # Link-in-bio directory
├── contact.markdown         # Contact form and direct contact options
├── terms.markdown           # Terms of use and privacy policy
├── master.scss              # Sass entry point
├── search-index.json        # Generated, committed search database
├── sitemap.xml              # Authored canonical sitemap
└── llms.txt                 # Public machine-readable site summary
```

More detail about the Sass and script architecture is available in [_sass/README.md](_sass/README.md) and [scripts/README.md](scripts/README.md).

## Content Sources

| Content | Source of truth |
| --- | --- |
| Home and professional narrative | `index.markdown` |
| Portfolio overview | `work.markdown` |
| Shared project summaries | `_data/work_projects.yml` |
| Focused project pages | `work/*.markdown` |
| Perspectives fallback and framing | `perspectives.markdown` |
| Link directory and professional profiles | `links.markdown` |
| Contact information and form fields | `contact.markdown` |
| Terms, privacy, attribution, and confidentiality | `terms.markdown` |

Focused project pages intentionally reuse the approved public narrative. They must not expand confidential project scope or imply that complete client work is hosted locally.

## Styling and Assets

Styles belong in the narrowest durable Sass layer:

- `global/` for tokens, base rules, and typography
- `layouts/` for shared page structure
- `components/` for reusable interface patterns
- `includes/` for header, navigation, and footer styles
- `pages/` for page-specific presentation

Use `--site-frame-gutter` for the shared visible page edge and `--site-max-width` for the primary container. Update `_config.yml`’s `asset_version` when changed CSS or JavaScript must bypass deployed caches.

Company logos live in `images/company-logos/`. Their presence is for identification and portfolio context; ownership remains with the respective rights holders.

## JavaScript and Progressive Enhancement

The main entry point is `scripts/initializeScripts.js`. It initializes each enhancement independently so one failure does not disable unrelated behavior.

The baseline HTML must remain usable without JavaScript. Script-dependent controls stay hidden until their behavior, focus management, keyboard support, and accessible state have initialized successfully. Visual layout and motion remain in CSS whenever CSS can express them reliably.

The Perspectives page retrieves recent Medium content at runtime. Its authored fallback remains visible when the request or JavaScript fails, and remote markup is sanitized before rendering.

## Static Search

`search-index.json` is a generated, committed database of meaningful public content. It excludes navigation, controls, decorative media, hidden interface text, and the dynamically retrieved Medium article body. The browser requests the database only when search is opened.

Add `data-search-section` to an anchored container when it deserves a focused result. Optional `data-search-title`, `data-search-category`, `data-search-summary`, and `data-search-keywords` attributes can improve presentation and ranking.

After changing searchable content, run the production build sequence above and commit the resulting `search-index.json` update.

## External Services and Privacy

| Service | Purpose | Boundary |
| --- | --- | --- |
| GitHub Pages | Static hosting | Publishes the `gh-pages` branch at the custom domain in `CNAME` |
| Web3Forms | Contact-form delivery | Receives submitted form data; direct email and phone links remain available |
| Google Tag Manager | Optional analytics | Loads only after the visitor accepts analytics |
| Short.io | Branded redirects and click measurement for `go.janmichael.io` | Processes a redirect before the destination loads; governed by Short.io’s privacy policy |
| Medium | Published perspectives | Remains the source of dynamically retrieved article content |
| RSS2JSON / AllOrigins | Medium-feed retrieval | Used as primary and fallback feed services |

Browser-visible service identifiers are not secrets. Private keys, credentials, restricted source material, and personal or client data must never be committed.

Material changes to data handling, third-party services, attribution, confidentiality language, or portfolio disclosure require a corresponding review of `terms.markdown`, its effective date and `date_modified`, and the generated search index.

## Quality Checks

Run the same release checks used by GitHub Actions:

```bash
bundle exec jekyll build
bundle exec ruby scripts/build-search-index.rb --check
node --check scripts/initializeScripts.js
for file in scripts/perspectives/*.mjs; do node --check "$file"; done
for file in scripts/search/*.mjs; do node --check "$file"; done
node scripts/network.test.mjs
node scripts/search/searchIndex.test.cjs
bundle exec ruby scripts/audit-site.rb
git diff --check
```

The audit covers progressive enhancement, page structure, ARIA references, image delivery, contact fallbacks, metadata, static search, external-link safety, structured data, XML, sitemap integrity, and the required legal sections.

Responsive changes should also be reviewed at narrow, transitional, and wide viewport sizes, with attention to keyboard use, reduced motion, forced colors, zoom, JavaScript-disabled behavior, and content overlap.

## Release Versioning

Milestone releases use [Semantic Versioning](https://semver.org/). `VERSION`
contains the current release number without the `v` prefix, `CHANGELOG.md`
records notable changes, and Git tags and GitHub Releases use the matching
`vMAJOR.MINOR.PATCH` form. Routine pushes to `gh-pages` still deploy
automatically; a release is created when the deployed state represents a
meaningful portfolio milestone.

For a release, move the relevant entries from `Unreleased` into a dated version
section, update `VERSION`, run the quality checks, commit and push the release
state, and then create the matching annotated tag and GitHub Release.

## Deployment

GitHub Pages publishes from the `gh-pages` branch. A typical release is:

```bash
bundle exec jekyll build
bundle exec ruby scripts/build-search-index.rb
bundle exec jekyll build
bundle exec ruby scripts/build-search-index.rb --check
node scripts/network.test.mjs
node scripts/search/searchIndex.test.cjs
bundle exec ruby scripts/audit-site.rb
git diff --check
git status --short
git add <reviewed-files>
git commit -m "Describe the change"
git push origin gh-pages
git tag -a vX.Y.Z -m "Release vX.Y.Z"
git push origin vX.Y.Z
gh release create vX.Y.Z --title "vX.Y.Z" --generate-notes
```

Review the staged diff before committing. Do not commit `_site/`, `.jekyll-cache/`, `.DS_Store`, temporary exports, local environment files, or credentials. `search-index.json` is the intentional generated-file exception.

## Legal and Confidentiality

Portfolio material must identify Jan Michael’s role without claiming sole ownership of work created with clients, employers, or collaborators. Company names, logos, trademarks, interfaces, testimonials, and other third-party material remain subject to their owners’ rights. Nothing in this repository or on the site supersedes an NDA, confidentiality obligation, employment agreement, intellectual-property agreement, or other binding obligation.

See the public [Terms of Use and Privacy Policy](https://janmichael.io/terms/) for the site’s attribution, confidentiality, privacy, and rights-request provisions.

## License

Original site materials are © 2026 Jan Michael Wallace II. Third-party materials and open-source components are excluded and remain governed by their respective owners and licenses. See [LICENSE](LICENSE) for the repository’s complete rights notice.
