---
published: false
---

# Vitae button reference comparison

Scope: `/vitae/` primary and secondary text buttons only. Existing markup, label casing, icons, responsive sizes, destinations, keyboard focus, and shared motion are preserved.

## Sources and evidence

- Sources: `/Users/jmwii1981/Desktop/primary dark.png` and `/Users/jmwii1981/Desktop/secondary dark.png`, each 776 × 260 pixels.
- Combined reference/render capture: `/private/tmp/vitae-button-qa/comparison.png`, 800 × 840 pixels, at an 800 × 840 CSS viewport. Each reference appears directly above its matching rendered state row.
- Actual page capture: `/private/tmp/vitae-button-qa/desktop.png`, 800 × 630 pixels. The live page retains its normal component sizes and labels.
- Comparison fixture uses the compiled site stylesheet and copies of the rendered button markup. Hover and active pseudo-selectors are mechanically mapped to fixture-only classes to render all six states simultaneously, without triggering external links. This verifies state styling, not physical pointer-event delivery.
- Fixture normalizes the reference component frames to 222 × 90 pixels (216 × 90 for pressed), with a 32px root for the existing rem-based typography and motion. These fixture size/label changes are not applied to the site.

## Comparison history

1. Existing implementation: translucent layered faces, blur, gradient shine and inset highlights differed from the supplied flat-color references. Replaced these with sampled face colors and thin outlines.
2. First combined comparison: hover was missing its inset contour; pressed state lost the lower outline due to the shared clipping treatment. Added scoped pseudo-element contours without changing markup or shared motion.
3. Re-rendered combined comparison: all six face and label colors match the sampled RGB values. Hover contours and clipped lower pressed outlines now correspond visually to the references.

## Fidelity checks

- Colors: primary rest `#24262f`, hover `#303340`, pressed `#1c1e24`; secondary rest/hover `#040405`, pressed `#101013`. Labels `#cecece` at rest and `#fffffe` during interaction. Computed values verified in the rendered fixture.
- Typography: existing Heebo family, weight, spacing, and proportional sizing retained. Reference wording is used only in the fixture; approved live labels are unchanged.
- Layout: pill shape, shared raised-hover/pressed translation, and button structure retained. No page layout edits in this pass.
- Assets: no raster assets added or altered. Existing live arrow icons remain; references omit arrows, so fixture removes them only for comparison.
- Content: no live copy or link changes.
- Accessibility: existing focus-visible and reduced-motion treatments retained. Full site audit passed; no errors reported by the live page console check.

## Findings and limitations

- No remaining P0/P1/P2 styling differences in the normalized six-state comparison.
- P3: exact raster identity is not claimed. Browser antialiasing and the site's retained responsive sizing/letter spacing produce minor edge/text differences from the supplied raster images.
- A requested mobile viewport override did not apply to the existing live tab (reported width remained 815px). Mobile was not independently render-verified in this pass; no sizing or breakpoint rules were changed by this button-style implementation.
- Live mouse-down/hover events were not captured directly; their CSS state rules were rendered in the isolated fixture instead.

## Implementation checklist

- [x] Scope changes to the Vitae overview, excluding project detail pages.
- [x] Match sampled faces and label colors in all six states.
- [x] Compare reference and implementation together and correct contour differences.
- [x] Preserve shared markup, content, accessibility, and motion.
- [x] Build, site audit, and whitespace checks.

final result: passed

## Subsequent desktop contact-section reference pass

- Target: user-attached `lets.png` (830 × 419), artwork on the left and contact copy/actions on the right. The attachment was available inline; the stated Desktop file path was not available at final inspection.
- Implementation: `_sass/pages/_about.scss`, scoped to desktop widths starting at 44.3125rem. Preserved the existing flex markup rather than reverting earlier grid-to-flex work.
- Desktop evidence: `/private/tmp/contact-desktop.png`; live desktop checked at 815px and 1280px wide. At 815px, artwork measures 361 × 349, copy 344px wide, and gap 16px. No horizontal document overflow.
- Composition matches the reference's two-column balance, centered square-ish artwork crop, two-line heading, and adjacent buttons. Original raster remains unmodified; crop is CSS-only.
- Typography: retained Heebo, label/body styles, and button typography; heading now scales to its own column to avoid unwanted line breaks.
- Colors, copy, icons, and shared button treatment unchanged. No unrelated sections edited.
- Mobile evidence: `/private/tmp/contact-mobile.png`, verified 390px CSS viewport. Existing hidden artwork, text-first presentation, and stacked buttons remain intact.
- Build, site audit and diff whitespace checks passed. Minor differences in surrounding gutters and responsive scale are intentional because the supplied image is a section-only reference rather than a full-page viewport.
- No actionable P0/P1/P2 findings in the desktop section check.

Contact-section final result: passed

## Release approval — September 12, 2026

Jan approved the buttons and authorized committing and publishing all current working-tree changes. The final site-wide visual/responsive review is explicitly deferred and remains on the follow-up list; automated release checks do not replace that review.
