# Vitae principle cards — scoped visual review

Source: user-supplied Screenshot 2026-09-13 at 10.37.11 PM.png (1480 × 696), showing the existing homepage help cards. The source is a cropped, high-density reference, not a complete viewport.

Implementation: http://127.0.0.1:4000/vitae/#design-leadership-principles. Browser screenshots were returned inline; no local screenshot path was provided.

## Review

- Typography: reused homepage label size, weight, tracking, and line height; body uses the same responsive size and 600 weight. Preserved all Vitae wording, numbering, and foreground colors.
- Spacing: reused 20px radius, 24px/25.6px/48px padding, 288px minimum height, and responsive gap. Wider screens use two columns; smaller screens use one.
- Colors: transparent card backgrounds and the subnav's white 12%-opacity border. These intentionally differ from the source's white background and colored text.
- Assets: no new imagery or icons are required.
- Earlier finding: three columns made long body copy too narrow relative to the reference. Changed to two columns above 897px.

## Verification limits

Inline captures show the revised cards at 709 CSS px and an earlier three-column version at 1091 CSS px. The browser viewport changed during verification. The revised two-column layout has not yet received a matching-viewport screenshot comparison, and no combined source/implementation image was saved. Mobile-width review also remains outstanding.

final result: blocked

Remaining gate: capture the revised two-column and mobile layouts at stable viewports and compare with the source's intended card proportions. This is a visual-verification limitation, not a build failure.
