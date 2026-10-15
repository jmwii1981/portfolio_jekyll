# Vega local review — October 13, 2026

Scope: compact interactive component playground replacing the decorative cover on Explore Vega, plus one static PaymentsManager+ transaction workspace replacing the full-dashboard interactive embed in Experience. The shared demo source, Vitae device-screen interactions, and other project pages are unchanged. This is a current portfolio reinterpretation, not a historically shipped product or an attribution of team output to Jan alone. No production data or backend.

## Component provenance

Inspected original Figma file: `n2YK8r1OQiGmfSgJ47tcOa`. Retrieved October 13, 2026. An immutable revision identifier was not available; this is a retrieval date, not a release number. No Code Connect mapping was returned.

| Component | Source node | Applied details |
| --- | --- | --- |
| Primary button | `4294:128237` | Inter Bold 16/24; #1362E2; #FCFCFC; 8px/24px padding; pill radius |
| Switch off/on | `2598:81299`, `2598:81309` | 56×32 track, 24px thumb, 4px inset; gray 70%/action blue |
| Input default/focus | `14004:276512`, `14004:276607` | Inter 16/24; 8px radius; #ABC6D8 border; blue focus border and ring |
| Slider | `25953:367640` | 6px gray/blue track, original downloaded 30×30 handle SVG including shadow, representing 20px visible thumb; source page labels this light-mode component “in review” |
| Left navigation | `26446:370563` | Inter Medium 16/24, 12px/8px item padding, 8px radius, #FCFCFC surface, #ABC6D8 dividers; downloaded source icons at their native dimensions |
| Table | `5825:182770` | Inter 14/18, #F0F3F7 header, #F5F7F7 alternating rows, rounded row ends, #1362E2 action text |

These are original-library values. They deliberately do not mix in the present-day public documentation's #262AFF action token.

## Deliberate adaptations

- New composition and generic content; no original company logo, customer identities, or financial records.
- Native HTML controls, readable labels, touch target wrappers, focus treatment, and tiny independent JS state synchronization. No score, payment flow, stored information, or network submission.
- Placeholder is #6B747D rather than source #B0B4B5 for readable contrast. Labels wrap responsively. Source geometry is preserved within responsive specimens, not as absolute-positioned Figma frames.
- Product navigation hierarchy, header, summary strip, filters/tabs, and semantic status labels are authored composition. Do not describe them as exact exported Vega components.
- Static proof uses spans rather than dead buttons. `vega-proof.html` and `styles/vega-proof.css` remain editable sources; `images/projects/vega/vega-transaction-proof.png` is a high-resolution browser capture used in the case study.
- Full-size proof is noindex and omitted from sitemap. It is a desktop composition; on small screens it can be inspected horizontally. The case-study image fits its containing width without introducing page overflow.
- Composition reference: Nuvelabs Infra.Email workspace, https://dribbble.com/shots/27307318-Infra-Email-Inbox-Warmup-Email-Marketing-Dashboard-UI-Design. Borrowed hierarchy and restraint, no downloaded or copied reference assets.

## Dock correction

`data-dock-all-sections` opts Vega into showing all four explicit chapter landmarks. Shared defaults elsewhere are unchanged. The selected chapter remains keyboard-available; navigation sets focus and URL hash. Mobile utility buttons retain their icons so they are not mistaken for extra dots.

## Review boundary

Local only. No commit, push, or publication. Browser-emulated mobile testing is not an actual iOS Safari verification.
