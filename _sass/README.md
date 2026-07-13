# Sass Architecture

This folder is organized by responsibility:

- `components/`: reusable UI patterns that can appear in multiple places.
- `fonts/`: local font-face declarations.
- `global/`: design tokens, document defaults, and shared typography.
- `includes/`: styles for Jekyll includes such as the header, nav, and footer.
- `layouts/`: page-level structure, content width, and reusable layout helpers.
- `pages/`: page-specific composition and one-off authored sections.
- `resets/`: browser normalization rules.

When adding styles, start with the narrowest durable home:

1. Use `global/` only for site-wide primitives.
2. Use `layouts/` for structure shared by pages or sections.
3. Use `components/` for reusable interface pieces.
4. Use `includes/` when the style belongs to a matching `_includes` template.
5. Use `pages/` for one-off page sections and page composition.

Write responsive styles mobile-first: place the smallest-screen behavior in the
base rule, then add enhancements with `min-width` media or container queries.
