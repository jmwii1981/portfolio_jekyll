# Portfolio code review — October 13, 2026

## Follow-up implementation after review

The original findings below are retained as the reviewed baseline. In the subsequent authorized local pass:

- Isolated optional content-scroll, profile-preview and glass imports. With all three module requests blocked in Chrome, navigation, enhanced contact validation and the testimonial carousel still initialized.
- Added the requested pause/play icon button between the desktop testimonial arrows. Verified that pausing holds a quote beyond the ten-second interval and playing resumes advancement. Reduced motion starts paused; keyboard focus within the quote pauses rotation. Mobile remains manual with hidden controls and swipe/arrow-key navigation.
- Changed Project Detail disclosure to a native checkbox and CSS `:has(:checked)` rule. Verified keyboard opening/closing with scripting disabled. No JavaScript controls its visibility. Submission validation still requires project fields when checked and omits their data when unchecked. CSS cannot conditionally enforce native required attributes; the no-script fallback reveals the fields but cannot enforce that conditional requirement.
- Fixed the endorsements target and added internal fragment validation, including redirects.
- Expanded CI syntax discovery to all authored JS/MJS files, and added structural audit checks for control order and native disclosure markup.
- Left screen enlargement unchanged pending clarification. Deferred product-preview fallback work and portfolio-piece page changes for the planned redesign. Remote publishing configuration and broad stylesheet/module reorganization were not changed.

Follow-up checks: build, HTML audit, authored JavaScript syntax, five network tests and diff whitespace checks passed. Desktop and 390px mobile Testimonials inspected. Contact validation tested without sending a message. Real iOS Safari, end-to-end email delivery and remote deployment gating remain unverified. Work remains local and uncommitted.

## Outcome and scope

Local working-tree review following the published `d43be63` checkpoint. No commit or publication performed in this pass. The three middle Vitae sections now share their section template, four-device template, geometry data, and layout selectors. Project copy and screen implementations remain project-specific.

Reviewed the authored page/layout/include structure, styles, navigation and enhancement initialization, contact form/calendar, testimonials, in-screen demos, Perspectives loading, generated HTML audit, and quality workflow. Existing archived project requirements were used as a quality baseline alongside current repository guidance and the user's newer explicit decisions. Newer design decisions take precedence over outdated requirements (including search removal and intentional artwork overlap).

This is a source review with targeted runtime checks, not an exhaustive accessibility certification, penetration test, or complete cross-browser visual sign-off. Third-party library internals were not exhaustively reviewed. Findings below are recommendations, not changes silently implemented in this pass.

## Findings, ordered by priority

### 1. High — Optional module failures can interrupt unrelated functionality

Evidence: `scripts/initializeScripts.js:44` awaits the content-scroll import before navigation, form and consent setup. The profile-preview and dock-glass imports at lines 1938–1941 are also awaited outside the individual initializer guards.

If one of these files fails to download or evaluate, the enclosing flow exits before subsequent independent features initialize. The existing synchronous `safelyInitialize` helper does not catch those import rejections. This conflicts with the requirement that enhancement failures be isolated.

Recommendation: independently guard imports and initialization, and make each feature's ready state conditional on success. Add blocked-module browser tests for navigation, consent, forms and static content.

### 2. Medium — The project-details toggle has no working native fallback

Evidence: `contact.markdown` renders the Have a project switch but keeps `#contact-project-details` hidden; only `scripts/initializeScripts.js:434–448` reveals and enables the fields.

Confirmed with scripting disabled: the switch remains visible while its details stay hidden. The ordinary contact form still has a native submission action, but a visitor cannot provide the promised project information through this toggle.

Recommendation: use an accessible native disclosure baseline or provide visible optional project fields before enhancement. Preserve the approved enhanced toggle appearance. Test native submission separately from enhanced validation and actual email delivery.

### 3. Medium — Desktop testimonials advance without a pause control

Evidence: `scripts/initializeScripts.js:1412–1515` advances testimonials every ten seconds. It respects reduced motion, page visibility and the mobile state, but provides no pause control or hover/focus pause.

A visitor reading a longer quote can lose their place. Recommendation: provide a persistent pause mechanism and pause during interaction; retain the approved mobile swipe behavior and fixed control positions.

### 4. Medium — An enlarged-screen dialog conflicts with the earlier in-device-only direction

Evidence: `scripts/screenEnlargement.mjs:6–38` creates a modal screen viewer; lines 53–62 add enlargement controls to the device lineups on smaller viewports.

This should be reconciled with the explicit preference for interactions within the glass devices rather than a separate pop-out experience. It may have been introduced as a readability accommodation, so this is an intent mismatch to review, not proof that the dialog itself is broken.

Recommendation: confirm whether enlargement remains desired. Otherwise remove this secondary mode while preserving in-screen interactions and dedicated project-page experiences.

### 5. Medium — LedgerFlow has no static screen fallback

Evidence: `_includes/vitae-device-lineup.html:9–10` renders empty LedgerFlow screen hosts. The screen contents depend on its JavaScript demo. Vega has fallback images.

With script failure or disabled scripting, LedgerFlow's glass frames remain but its product preview is blank. AvenaPay's overview also currently has bare glass devices; that pre-existing state was preserved rather than silently expanded in this refactor.

Recommendation: add representative static LedgerFlow previews and replace them only after successful demo initialization. Decide separately whether AvenaPay's overview devices should be populated.

### 6. Medium — The endorsements redirect and its audit share a stale target

Evidence: `endorsements-redirect.html:4` points to `/#recommendations`; `scripts/audit-site.rb:22` expects that same old target. The current section is `#testimonials`.

The redirect can reach the home page without landing on the intended section, while the audit still passes. Recommendation: update both and extend internal-link validation to verify fragment targets, not only destination files.

### 7. Medium — Automated quality coverage is narrower than the release requirements

Evidence: `.github/workflows/quality.yml:22–30` checks the main initializer, glass and Perspectives modules, the glass vendor script, network tests and generated HTML. It omits syntax checks for several authored modules, including the calendar and product demos. The workflow itself does not define a deployment dependency on successful checks.

Recommendation: discover and check all authored JavaScript modules, add browser regression checks for the contact form, testimonial swipe, consent and shared responsive compositions, and verify/enforce that publishing waits for the checks. Remote branch-protection/deployment settings were not changed in this pass.

### 8. Lower priority — Broad override layers make visual changes fragile

Evidence: the main initializer is roughly 1,960 lines; `_sass/components/_responsive-repair.scss` mixes page-specific rules in a shared repair layer, alongside a large Vitae stylesheet.

The shared Vitae refactor reduces one source of drift, but late overrides and many responsibilities in one initializer still make adjacent regressions easier to introduce.

Recommendation: incrementally move approved rules to their owning component/page and extract independent initializers. Establish screenshot baselines first; do not use this finding as a reason to redesign approved layouts.

## Changes completed in this pass

- Extracted one shared Vitae project-section include and one shared device-lineup include backed by common geometry data.
- Removed duplicated per-project layout rules and switched to common layout/device classes.
- Kept project-specific copy, destinations and interactive demos separate from shared layout.
- Added intrinsic dimensions to the Vega fallback images.
- Corrected active Vitae navigation for AvenaPay's custom page layout.
- Updated the Links audit to recognize its approved mobile dock rather than require no header at all.
- Excluded internal asset-reference documents from generated public pages.
- Preserved the Chart.js license as a published plain-text notice rather than a rendered HTML page.
- Moved responsive artwork interpolation from the Web Animations API into CSS keyframes; JavaScript still selects states and supplies measured transforms.
- Added HTML regression checks for the shared three-section/four-device structure.

## Verification

- Jekyll build and generated HTML audit passed locally.
- Syntax checks passed for 18 authored JavaScript entry points/modules/tests.
- Network unit tests: five passed.
- Computed Vitae layout compared at widths 320, 390, 680, 768, 920, 1199, 1200 and 1440 pixels. All three project sections matched in heading size, copy width and device-stage width at each viewport. No page-level horizontal overflow was detected in those checks.
- Desktop and mobile Vitae screenshots inspected; no browser page errors observed in the tested preview.
- No-JavaScript contact state inspected and the fallback issue above confirmed.
- These checks do not establish full-site visual equivalence in every browser. Real iOS Safari, complete keyboard/screen-reader flows, email delivery, and blocked-resource combinations still need a dedicated acceptance pass.

## Suggested sequence

Fix module-failure isolation and contact fallback first, then testimonial pause and the stale redirect. Resolve the screen-enlargement design decision and static previews next. Strengthen release gates before undertaking incremental stylesheet/initializer cleanup.
