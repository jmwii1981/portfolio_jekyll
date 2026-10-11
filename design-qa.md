# Contact page — Frame 67 implementation review

## Vega screen revision 3 — local review

- Reviewed two Dribbble dashboard presentations and the official Vega gallery; stronger sales hierarchy and coordinated light/dark views.
- Replaced only four Vega screen concepts. Preserved lineup, other projects, dock styling and original frames.
- Calibrated laptop inner-bevel bounds, tablet opening and elliptical phone corners.
- Jekyll build passed. Desktop 1857×942 and stacked 634px screenshots reviewed; 390×844 checked with no horizontal document overflow. All four assets load. Desktop device bleed remains intentional; mock text is not all readable at small presentation sizes.
- Evidence: `vega-v3-desktop.png`, `vega-v3-mobile.png`, `vega-v3-narrow.png` in the thread visualization directory. The mobile full-section capture includes a testing-focus skip-link overlay, not part of the artwork.
- Local only; no publication.

Source visual truth: `/Users/jmwii1981/Downloads/Frame 67.png` (1483 × 1410).

Implementation: `http://127.0.0.1:4000/contact/`.

Evidence directory: `/Users/jmwii1981/.codex/visualizations/2026/09/12/01a09402-094d-7d53-96b4-b83132322fc2/`.

- Initial capture: `contact-frame67-v1.png`.
- Final desktop capture: `contact-frame67-final.png` (1483 × 1383).
- Mobile capture: `contact-frame67-mobile.png` (390px wide).
- Desktop viewport: 1483 × 1000 CSS pixels, device scale factor 1. Source and implementation compared together at native pixel density in the same image output. Additional 1024 × 900 and 390 × 844 viewports inspected.
- State: empty form, closed navigation. No actual message submitted.

## Comparison history

1. P1: Background pseudo-element exceeded viewport width. Limited it to the remaining viewport; final document scroll width equals viewport width (1483).
2. P2: Artwork and pills were 16px left of reference, and form 6px too low. Start-aligned composition and reduced form top gap. Final capture re-compared with the source together.
3. P1: Existing compact contact navigation was hidden by a no-section-dots rule. Scoped display correction restores its menu button. Menu opened successfully at 390px and Follow me was visible; Escape closed it.

## Required fidelity surfaces

- Typography: same existing Heebo heading, 83.2px/700 at desktop with matching four-line wrapping, tight tracking and line height. Existing form text preserved; pill labels bold 16px.
- Layout: heading and form begin at x185.5; split at approximately x779.5; portrait at approximately x822 and y30. Warm portrait panel has a 280px top-left curve; white form panel ends in a 140px bottom-right curve. Bubble and direct-link pills follow reference placement. Mobile stacks the composition and form without horizontal overflow.
- Colors: warm off-white #f5f2ef, white form panel and pills, original neutral input borders, warm gray pill labels. Footer divider removed on contact only.
- Image fidelity: reused original portrait and generated transparent clay bubble from the reference; envelope PNG reused, Apple-style phone receiver PNG added. No replacement illustration or synthetic portrait.
- Copy: heading, field labels, email and telephone match the mock. Required-fields note now beside submit on desktop. Telephone uses tel:+14155069867; email uses mailto:hello@janmichael.io.
- Focused review: form labels/inputs, note/submit alignment, portrait/bubble overlap and pill icons were readable in the native-resolution comparison and inspected there.

## Interactions and checks

- Empty form submission shows all five required-field errors; no external submission made.
- Direct-contact hrefs verified.
- Mobile menu opens and closes; navigation retained intentionally although absent from supplied mock.
- No browser console errors observed.
- Jekyll build and git diff whitespace check pass.

## Follow-up polish / P3

- Existing footer remains functional and its responsive spacing differs slightly from the static mock (full page 27px shorter). Existing dock intentionally retained.
- Minor raster/font antialiasing and pill width differences remain; main layout and hierarchy match.
- Live successful message delivery was not tested, to avoid sending a test message.

final result: passed

## Vitae project composition — Frame 72, October 10

- Source: `/Users/jmwii1981/Downloads/Frame 72.png` (1857 × 942).
- Implementation: `/Users/jmwii1981/.codex/visualizations/2026/09/12/01a09402-094d-7d53-96b4-b83132322fc2/vitae-frame72-desktop.png` (1857 × 942, CSS viewport 1857 × 942, density 1).
- State: Vega project, settled layout with reduced motion used for static comparison. Reference and implementation displayed together in the same comparison tool result.
- First pass P2: story copy undersized, devices too high, heading wrapping differed. Fixed by increasing desktop paragraph scale, balancing headline wrapping, adding centered section spacing and narrowing the composition slightly.
- Second comparison: matching left story column and right device grouping, phone layered over tablet's left side, device baseline aligned with actions. No remaining actionable P0/P1/P2 differences for the requested “something like” adaptation.
- Typography: existing site font and weights retained; headline approximately 63px and paragraph 24px at reference width. Existing button sizes retained rather than raster mock scaling (P3 difference).
- Layout: reference composition retained; small device-position differences intentional responsive adaptation. Desktop composition changes to a single story column above the imagery below 1200px to prevent narrow copy columns.
- Colors: existing dark page and muted text tokens unchanged.
- Assets: original glass PNGs reused, no resampling or replacement; overlap changed to match reference.
- Copy: all project wording and CTA labels preserved.
- Mobile: 390px screenshot inspected; heading, copy/actions, then vertically stacked laptop/tablet/phone. No horizontal overflow.
- Full-size comparison was readable, so separate focused crops were unnecessary.
- Existing navigation and actions were not changed; build passes. No deployment performed.

final result: passed

## Vitae responsive compositions — updated Frames 72, 73, 74

- Applied to Vega, AvenaPay, and LedgerFlow only. Existing copy, colors, hero, docks, and button behavior retained.
- References: Frame 72 (1857 × 942), Frame 73 (1151 × 1569), Frame 74 (634 × 1976), from Downloads. Reference and implementation images compared visually at corresponding viewport sizes.
- Wide: unified story column beside an oversized layered device stage with intentional right-edge cropping. Medium: story above the overlapping stage. Narrow: laptop above a tablet/portrait-phone row, with landscape phone centered below.
- Original glass PNGs reused without optimization. Landscape phone uses a rotated copy of the existing phone asset and its own entrance wrapper.
- Corrected P2 findings during comparison: wide artwork stretching the text rows; medium/narrow typography too small; narrow stage spacing too compressed. Final layouts follow the three reference compositions.
- Typography and colors retain existing site families and tokens; headline and paragraph scale match the reference hierarchy. Existing desktop button sizing is preserved (minor P3 difference from the mock).
- Captures: vitae-responsive-wide.png, vitae-responsive-medium.png, vitae-responsive-narrow.png in /Users/jmwii1981/.codex/visualizations/2026/09/12/01a09402-094d-7d53-96b4-b83132322fc2/.
- Additional 390 × 844 check: readable wrapping, no horizontal page overflow; visible actions fully opaque. All three projects have four device items. Static comparisons used reduced motion; normal media preference restored afterward.
- No actionable P0/P1/P2 layout differences remain in the inspected states. Existing scroll logic preserved, not redesigned or exhaustively re-tested in this layout pass. No deployment performed.

final result: passed
# Vega screen concepts — October 10

final result: passed

- Source visual: `/Users/jmwii1981/Desktop/Working Assets/Screenshot 2026-09-22 at 12.02.04 AM.png` (1250 × 834). This is an art-direction reference, not an exact viewport target.
- Implementation: `http://127.0.0.1:4000/vitae/#project-vega`.
- Evidence: `/Users/jmwii1981/.codex/visualizations/2026/09/12/01a09402-094d-7d53-96b4-b83132322fc2/vega-screen-concepts-desktop.png` and `vega-screen-concepts-mobile.png`.
- Browser checks at 1857 × 942, 634 × 1000, and 390 × 844; CSS pixels at 1× density. Full section screenshots include offscreen content. Source and mobile rendering opened together for visual comparison; generated individual screens inspected at native resolution for detail.
- Typography: crisp sans-serif hierarchy retained in generated screens; small interface text is illustrative at portfolio device scale, not interactive UI.
- Spacing: screens contained within original glass bezels. Laptop, tablet, and both phone orientations retain their preexisting responsive arrangement.
- Colors: reference's electric blue, navy, white, pale gray and mint chart accents retained.
- Assets: four generated static concept screens, independently tailored to device orientation. Original device images unchanged; no custom icon approximations.
- Content: illustrative demo workspace data, not shipped Vega product claims. Accessible device descriptions identify concepts.
- First pass found inherited image aspect ratio, max-height and lighten blending causing frame mismatch and washed-out UI. Fixed those properties for Vega screen images only. Second desktop capture and mobile comparison confirm correction.
- No browser console errors observed; Jekyll build and diff whitespace checks passed.
- Other projects and surrounding copy unchanged. Existing scroll-reveal wrappers remain; mock interface controls are intentionally noninteractive raster artwork.
- Follow-up: generated mock screens are a visual direction for user review, not a source-of-truth product UI or functional dashboard.

## Vega revision 2 and dock shadow refinement

final result: passed

- Sources: official Vega Components and Design pages, Color guidance, Button example. Captured official gallery at `vega-components-reference.png` in the existing visualization directory.
- Evidence: `vega-v2-desktop.png` (1857 × 942) and `vega-v2-mobile.png` (634px-wide full section). Browser CSS viewports 1857 × 942 and 634 × 1000 at 1× density. Reference gallery and mobile implementation opened in the same comparison call; individual generated screens inspected at native resolution. Comparison is style-based, not an exact documentation-page clone.
- Typography: restrained Inter-like raster typography, larger and less dense than revision 1. Intended as miniature screen artwork, not functional controls.
- Spacing: expanded portrait/tablet screen openings, orientation-specific rounded corners, cover fit without letterboxing. All artwork remains inside device bezels. Existing art arrangement retained, including intentional desktop right-edge bleed.
- Colors: blue-violet pill actions and teal status chips follow observed Vega component styling; neutral flat surfaces replace decorative navy/blue panels.
- Asset quality: four orientation-specific generated PNGs; no stretching. Phone islands included as permitted. Original glass frame assets unchanged.
- Content: consistent primary sample-account metrics across devices; generated transaction details vary and remain conceptual. Accessible descriptions identify demo concepts.
- Dock: rest outer shadows reduced from 85%/65% black to 18%/12%, with smaller offsets and blur. Hover and pressed shadows also reduced. Actual computed styles verified in browser; glass bevel retained.
- Build successful; no browser console errors observed. No publication. No remaining blocking screen-fit issues in reviewed sizes.

## Vega native Figma reconstruction — 2026-10-11

<!-- Contact slider QA is appended below; existing Vega evidence retained. -->

- Replaced the four generated screen images at runtime with native, shadow-scoped UI based on Figma frame 40000010:290. Original icons and illustrations exported from the source; Inter loaded locally. Existing glass frames and device composition preserved.
- Desktop dashboard follows the supplied Payments Manager+ screen. Mobile and tablet layouts, secondary pages, and interactive forms are adaptations rather than supplied production components.
- Verified at 1857px and 390px widths: four native screens initialized, no internal horizontal overflow, no page horizontal overflow at 390px. Captured `vega-native-devices.png` and `vega-native-mobile.png` in the task visualization folder.
- Checked reporting-period changes, sample payment creation and records, quick-action management, task creation, dialog dismissal and focus return. Expanded preview makes the miniature UI usable at reading size.
- Touch-only emulation: screens inert, pointer events disabled, expanded-demo button hidden. Cursor interaction restored after test. Temporary viewport overrides cleared.
- JavaScript syntax check and Jekyll build pass. No browser console errors observed. Sample data is memory-only; no real transactions or external submissions. Local review only; not committed or published.

## Contact budget slider — 2026-10-11

### Superseding iteration: budget selector and timeline

- Replaced amount/slider with required native select: $5k+, $10k+, $25k+, $50k+, $100k+, $250k+, Let’s figure it out. Empty initial selection; subtle ballpark helper.
- Added optional start and handoff/launch date inputs in a Timeline fieldset. Browser calendar controls use existing warm field styling. Side-by-side on desktop; stacked on narrow screens. These use native browser popup styling, not a custom calendar overlay.
- Validated start 2026-11-01 / end 2026-10-30 shows inline error; end 2026-12-15 clears it. Optional dates are included in existing pre-submit validation. No actual message submitted.
- Evidence: contact-budget-timeline.png in task visualization directory. Desktop and 390px layouts inspected; no horizontal overflow. Build and syntax checks passed; no browser console errors. Test entries reset and emulation cleared.
- final result: passed

### Follow-up: precise amount input and revised upper endpoint

- Added synchronized exact currency input beneath the slider, including cents. Invalid values below $5,000 block form validation and show an inline correction; no forced value replacement mid-entry. $12,345.67 remains exact while the slider approximates its position in $100 steps.
- Latest user direction supersedes infinity: final position is $250,000+, preceded by $250,000. Browser verified both endpoints. Input supports the same top-end value.
- Helper uses required-note typography/color. Thumb reuses primary button surface, edge and bevel tokens with smaller shadows; 44px-high slider interaction area. Preserved existing field styling.
- Desktop evidence: `contact-budget-input-desktop.png` and `contact-budget-input-detail.png` in the task visualization directory. Visually checked at 1483px and 390px; no narrow overflow. Syntax/build checks pass and no browser console errors. No form submitted.
- Guidance consulted: NN/g Slider Design: Rules of Thumb and W3C APG Slider Pattern, for precise-entry alternative, native keyboard operation and meaningful value announcements.
- final result: passed

- Source: `/Users/jmwii1981/Downloads/Frame 1000003223.png` (551 × 641). Implementation: `/Users/jmwii1981/.codex/visualizations/2026/09/12/01a09402-094d-7d53-96b4-b83132322fc2/contact-budget-desktop.png` (1483 × 1409, 1× density). Compared 551 × 650 form crop at the same 494px form width alongside source.
- Typography and colors: preserved existing warm labels and fields; thin warm-neutral track and 25px slate thumb match supplied styling. Budget label and $5,000 / ∞ endpoints present. Default thumb intentionally starts at minimum instead of mock's unspecified intermediate value.
- Spacing: first pass found Subject and remaining fields 10px too high relative to mock; added 10px beneath slider and recaptured. Final form rhythm matches. No new raster assets; removed speech-bubble markup and retained its file.
- Interaction: Home gives $5,000; End announces no upper limit; previous steps give $100,000 then $99,900. Selected value appears on focus/hover. Hidden Budget field maintained for existing form submission; reset listener restores default. No live message submitted.
- Responsive: 390px viewport has 390px document width and a 269px slider; no horizontal overflow. Existing form typography retained. JavaScript syntax and Jekyll build pass, no observed browser console errors. Viewport override cleared.
- Findings: no remaining P0/P1/P2 issues in scoped change. Existing page design unchanged outside requested bubble removal. Real delivery not tested to avoid sending a message.
- final result: passed
