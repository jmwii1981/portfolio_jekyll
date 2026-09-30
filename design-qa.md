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

---

# Dock refraction regression — 2026-09-30

Scope: fix the disappearance of live backdrop refraction when the homepage tray
grows to include its return-to-top arrow. Preserve the approved tray, clay
controls, 20% white frosting, section dots, and restrained menu motion.

## Confirmed cause and repair

The arrow's `::before` grain uses `mix-blend-mode: multiply`. The compact
homepage arrow has no transform and had no isolated stacking context. Its blend
layer interfered with the sibling `.dock-glass` SVG backdrop rendering in both
Chrome and the Codex in-app browser. This was not a tray sampling-height issue.

Reversible controls on the actual homepage (in a temporary same-origin iframe):

- Preserve the tall grid and remove only the arrow element: refraction returns.
- Preserve the tall grid and visible arrow, set only `isolation: isolate` on
  the arrow: refraction returns. Change it back to `auto`: failure returns.
- Change only the arrow grain's blend mode to `normal`: refraction returns.
- Hiding the arrow with `visibility: hidden` does not resolve the failure.
- Remove Gaussian blur from the diagnostic filter: diagonal reference lines
  still bend at the perimeter with isolation enabled, proving displacement
  rather than just a blurred backdrop or decorative border.

Repair: isolate each `.dock-control` so its clay grain cannot blend with the
tray. Restore the arrow's normal scroll threshold and remove hidden-arrow
diagnostic rules. The temporary diagnostic page was removed after testing.

## Verification completed

- Chrome and Codex in-app browser: reproducible broken/fixed comparisons with
  tray geometry unchanged, including the visible arrow.
- Chrome native desktop viewport, 1007 × 629 CSS px: 20 visual scroll checks
  from scroll 0 through 2971, covering arrow appearance, both tray heights,
  section boundaries, content cards, illustrations, and the footer.
- Actual homepage in a responsive iframe: 320, 390, 480, 767, and 768 CSS px
  widths; short/expanded horizontal trays and the desktop breakpoint. Used a
  high-contrast diagonal backdrop to inspect edge displacement directly.
- Height stress checks at 178, 222, and 300 CSS px; short and tall production
  trays are 178 and 222 px, respectively. Horizontal equivalents also pass.
- Desktop and 390px mobile: expanded menu, Escape close, return to top, and
  shrinking back to the short tray. No layout redesign was introduced.
- Contact and Vitae shared-dock smoke checks, including the arrow-present tray.
- Jekyll build, both changed-script syntax checks, and `git diff --check` pass.
  The broader site audit still reports existing stale assertions: it expects
  `logo-container` instead of `footer-brand`, `.tab.active` instead of the
  current `aria-current` styling, and an older static-fallback selector. Those
  same source patterns exist in HEAD and are unrelated to this repair; the
  audit was not changed as part of the glass fix.

## Repeatable regression check

1. On the homepage, scroll past the arrow threshold, then cross a curved
   white/gray section boundary beneath the dock. Check actual background
   distortion and frosting, not merely the white rim.
2. Return to the top and repeat, ensuring the smaller tray also refracts.
3. Repeat below 768px with the horizontal dock, and open/close the menu.
4. For an unambiguous diagnostic, put diagonal high-contrast stripes behind
   the real dock in a local-only fixture. Disable Gaussian blur temporarily to
   distinguish displacement from frosting. Keep tray size/position fixed while
   testing `isolation: auto` versus `isolate` on the arrow.

Limits: these are verified Chromium rendering results, not a claim about every
browser/GPU combination or a physical iPhone. Other engines retain the existing
CSS fallback. Refraction remains active over flat backgrounds, but displacement
has no visible detail to bend there. No public deployment was performed.

---

# Dock glass refinement — 2026-09-30

Scope: refine the approved glass only. Preserve control materials, geometry,
spacing, menu styling, and the confirmed `.dock-control` isolation repair.

## Material and geometry changes

- Interior frosting stage: `stdDeviation` 4 → 2; white tint remains 20%.
- Bevel frosting: 0.65 → 0.0325 and white wash 20% → 1%, each 5% of its
  previous strength. Optical highlight and shadow opacity remains unchanged.
- The live filter now applies these separate tints through a rounded interior
  mask generated from the displacement map's contour. The mask's existing
  1.5px feather is retained, without a separate blending/backdrop layer.
- Bevel width: displacement band 9 → 8px, interior inset 6 → 5px, and inset
  rim/shadow extents narrowed by 1px. Corner radius and displacement amplitude
  are unchanged.
- Tray inset: 4 → 6px on all sides. Measured at the same desktop viewport:
  the tall tray changed from 58 × 222 to 62 × 226 CSS px, expanding 2px in each
  direction. All control bounding rectangles remained exactly unchanged.
  Short trays are now 62 × 182px; horizontal equivalents are 182/226 × 62px.

## Rendered verification

- Chrome at 1007 × 685 CSS px: 20 screenshots from scroll 0 through 2916,
  covering illustrations, cards, curved section boundaries, and the footer.
  The short and arrow-present trays both retained live refraction.
- Chrome responsive homepage iframe at 320, 390, 480, 767, and 768px widths:
  checked short and expanded trays at each width, including the horizontal /
  vertical breakpoint. No visible clipping or overflow introduced.
- High-contrast diagonal reference backdrop: before/after visual comparison,
  plus filter enabled/disabled comparison, verified real background bending
  separately from frosting and decorative rim highlights. An oversized
  62 × 326px tray also passed.
- Codex in-app browser: desktop at 1422 × 800 and a 390px responsive iframe,
  short and expanded trays with the reference backdrop, retained refraction.
- Actual unmodified page backgrounds: desktop and 390px menu open/close,
  Escape, keyboard focus, and return to top. Repeated desktop return-to-top
  checks returned scroll to 0 and restored the 62 × 182px tray. Escape returned
  focus to the menu button. Filter resources remained bounded at two (the
  template plus the current size-specific filter).
- Contact and Vitae: shared-dock smoke checks with the arrow present and menu
  open/closed. Vitae's separate glass-control styling is preserved. Chrome
  reported no captured warnings or errors during these checks.
- Temporary diagnostic page and test backdrop removed after verification.
- Final Jekyll build, JavaScript syntax checks, five network tests, search-index
  tests (45 records / 11 queries), and `git diff --check` passed. The full site
  audit reports only the same pre-existing logo, active-page, and static-fallback
  assertions documented above; no new audit category appeared. Confirmed the
  removed diagnostic page is also absent from the generated site.

Limits: responsive checks use the actual homepage in same-origin iframes,
not physical mobile devices. These results cover Chrome and the Codex in-app
browser, not every browser/GPU. Existing reduced-motion and non-Chromium CSS
fallback paths were preserved. The broader audit's pre-existing assertions
listed above remain outside this refinement's scope. No commit or publication.

---

# Approved glass version restored

At the user's request, removed the subsequent Home-button design experiment
and all of its size/spacing changes. Restored the single 24px return arrow,
its original position, scroll-triggered visibility, and mobile layout. The
approved glass refinement documented above and the isolation repair remain
intact. Unrelated working-tree changes were preserved.

---

# Dock centering during size changes — 2026-09-30

- Removed the fixed homepage header offset and unused grid tracks. The header
  now centers the visible tray: vertically on desktop, horizontally on mobile.
  Only visible controls occupy tracks; the existing 6px glass inset is symmetric.
- Preserved the approved tray dimensions, control sizes/gaps, glass treatment,
  and refraction isolation. The desktop menu remains aligned with its toggle;
  the mobile popup is centered above the dock without an obsolete fixed offset.
- In-app-browser check on the actual homepage: tall tray center error improved
  from about 82px to 0.11px; returning to top also remained centered.
- Responsive same-origin iframe checks for Home, Contact, and Vitae at widths
  320, 390, 767, 768, and 1121px, height 640px: two short/tall cycles per width,
  with 24 animation-frame samples per state. Maximum measured center error was
  0.28px (subpixel/browser zoom rounding), across all 60 state checks. Verified
  both horizontal and vertical layouts; 768px remained horizontal at the test
  browser's zoom, while 1121px exercised the vertical layout.
- Visually inspected desktop and mobile short/tall docks, live glass over
  content, menu placement, Escape dismissal, and return-to-top behavior. No
  warnings/errors were captured for the homepage. No physical-device claim.
- Removed the temporary diagnostic page. Final Jekyll build, navigation-script
  syntax checks, and diff whitespace checks passed. Local only; not published.

## Introduction-dot to return-arrow transition — 2026-09-30

- Homepage controls now share a fixed first-section slot. The arrow grows
  from 7px to its existing 24px diameter about the dot center, with a 240ms
  ease-out and crossfade. The existing scroll threshold is unchanged.
- No extra row/column is inserted: the homepage tray remains 62 × 182px on
  desktop and 182 × 62px horizontally. Its centering and current 80% interior
  tint, bevel, refraction, and button material settings are preserved.
- Actual-homepage iframe checks at 320, 390, and 1121px sampled 32 frames in
  each direction: scale grew monotonically from 0.291667 to 1, tray dimensions
  stayed constant, and arrow/dot centers differed by less than 0.005px.
- Verified focus transfers Introduction → Back to top and back when scrolling
  across the threshold; the covered link becomes inert, aria-hidden, and is
  removed from the tab sequence. The inactive arrow has tabindex -1.
- Desktop/mobile screenshots and return-button clicks checked; desktop menu
  opening and Escape dismissal still work. Reduced-motion CSS disables the
  growth/crossfade without changing the shared center. Other pages retain
  their existing independent return button.
- Removed the temporary check page; build, script syntax, and whitespace
  checks passed. Local preview only; no commit or publication.

### Follow-up: remove the Introduction control

Removed the Introduction link entirely rather than showing it before the arrow.
The reserved arrow slot and pop-in animation remain; How I help,
Recommendations, and Scroll to bottom are always present. The last control now
scrolls to the document bottom. No section is marked current while the hero
alone is active. The hidden arrow stays out of the tab order, with focus
returning to the hamburger if it disappears while focused. Glass styling and
fixed desktop/mobile geometry are unchanged.

## Dock Progressions implementation — 2026-09-30

Supersedes the reserved-slot geometry above. Reference:
`/Users/jmwii1981/Desktop/Dock Progressions.png`. Compared the full reference
at 270px wide beside the rendered local site in the browser. Screenshots were
reviewed inline in this task (not saved as a permanent screenshot artifact).

- Layout/spacing: retained the existing hamburger size; Home is 34px and both
  arrows are 24px. Initial state has no top-dot or reserved arrow gap. The tray
  expands when the up-arrow appears and includes Home only away from `/`.
- Typography/copy: existing site typography preserved; meaningful section names
  supply accessible names and hover labels. No new visible marketing copy.
- Colors/surfaces: existing 80% white interior and isolated refractive bevel
  preserved. Found and corrected low-contrast white control ink on Vitae's
  live white lens, without changing its dark fallback treatment.
- Icons/assets: existing up-arrow reused and rotated for down; official filled
  Font Awesome house asset, not a redrawn illustration. Other artwork unchanged.
- Responsive behavior: checked 72 initial/scrolled/returned states across Home,
  Vitae, Contact, Perspectives, Vega, and Terms at 320, 390, 769, and 1121px wide
  with 640px height. All trays contained; maximum measured center error 0.167px.
  Intermediate dots: Home 2, Vitae 3, Contact/Perspectives/Vega 0, Terms 14.
- Interactions: verified AvenaPay navigation/active state, Home return, document
  bottom arrival (within 0.34px), top return, menu Escape, and accessing the last
  Terms dot through its narrow scrollable strip. Hidden top control is inert
  and excluded from tab order; reduced-motion styles skip size/pop transitions.
- Found and corrected a menu-clipping edge case on tall desktop trays. Recheck
  at 769px placed the entire menu below the viewport top (18.26px).
- Glass filter stays attached through tray changes; visually checked desktop
  and mobile surfaces against page content. Physical-device Safari and assistive
  technology testing were not performed in this pass.

Build, JavaScript syntax, and diff whitespace checks pass. Temporary comparison
files removed. Local preview only; no commit, push, or publication.

Final result: passed for the tested local scope.

### Follow-up: hide down-arrow in the bottom region

The down-arrow now becomes hidden/inert as the last section enters the viewport
with a 24px inset, or the document bottom is reached. Its slot collapses, including
the adjacent gap; it returns when scrolling away. Focus returns to the hamburger
if the arrow was focused when hidden. Reduced motion disables the transition.
Verified Home down/up round trip in the local browser and both vertical and
horizontal collapse: slot height/width reached zero, with centered tray alignment.
Glass treatment unchanged. Build, syntax, and whitespace checks passed.

### Contact artwork video — 2026-09-30

Replaced the displayed floating-stones artwork with the supplied shaking-rocks.mov,
losslessly remuxed to images/contact/shaking-rocks.mp4 (H.264, no audio). Retained
the existing image as poster/reduced-motion fallback and preserved the wrapper,
crop, edge fades, and small-screen artwork hiding. The video loops while visible
and pauses off-screen, in hidden tabs, or with reduced motion requested.
Browser verification: readyState 4, paused false and advancing playback on desktop;
tablet keeps artwork visible; narrow layout hides artwork and pauses playback.
The existing document reports horizontal overflow at the tested responsive widths;
this was not broadened into unrelated layout work (the narrow video is hidden).
Build, JavaScript syntax, and whitespace checks pass. Local only.

### Follow-up: scroll-scrub the contact video

Removed looping playback. The paused video's timeline maps from artwork entering
the viewport to the document bottom, reverses with upward scrolling, and resets
to frame zero above the entry point. Loading starts 200px before entry. Reduced
motion retains the still; hidden/mobile artwork is not scrubbed. Scroll work is
coalesced with animation frames and seeks are serialized.
Observed local browser: paused at time 0 before entry (art top 1385.75px against
762px viewport), time 0.4899 at intermediate scroll, and time 1.1928 near the
bottom of a 1.209-second video. All observed states stayed paused.

### Pop-out glass reconstruction

Replaced separate masked face/rim/shadow shapes and asymmetric pointer padding
with a rounded glass surface and equal 6px panel insets. Menu item typography,
icons, padding, spacing, and interaction styles remain unchanged. The shared
refraction renderer creates independent maps/filter IDs for tray and menu;
the menu uses a narrower 4px displacement band and 2.5px interior inset, with
one 1px border and no stacked rim rings. Dock parameters remain unchanged.
Desktop/mobile screenshots on Vitae checked: thin edge and aligned content.
Computed panel insets: 5.998px on every side. Filter rebuilt for mobile width;
Escape dismissal checked. Build, module syntax, and whitespace checks passed.
Local review only.
