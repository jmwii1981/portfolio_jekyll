# Sass Architecture

This folder is organized by responsibility:

- `global/`: design tokens, document defaults, and shared typography.
- `layouts/`: page-level structure, content width, and reusable layout helpers.
- `components/`: reusable UI patterns that can appear in multiple places.
- `includes/`: styles for Jekyll includes such as the header, nav, and footer.
- `content_blocks/`: page-specific sections and authored content blocks.
- `fonts/` and `resets/`: font declarations and browser reset styles.

When adding styles, start with the narrowest durable home:

1. Use `global/` only for site-wide primitives.
2. Use `layouts/` for structure shared by pages or sections.
3. Use `components/` for reusable interface pieces.
4. Use `includes/` when the style belongs to a matching `_includes` template.
5. Use `content_blocks/` for one-off page sections.
