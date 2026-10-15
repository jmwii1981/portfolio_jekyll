# Menu emoji assets

## User-supplied replacements — October 14, 2026

- `waving-hand.svg`: supplied `waving hand.svg`; used in the menu and hero.
- `speech-bubble.svg`: supplied `speech bubble.svg`; used in the contact link.
- `briefcase.svg`: supplied `briefcase.svg`; used in the menu.
- `thought-bubble.svg`: supplied `thought bubble.svg`; used for Perspectives in the menu.
- `light-bulb.svg`: supplied asset retained for future use; not displayed.

These supplied SVGs retain their original artwork and viewBoxes. Existing consuming
sizes and placement are unchanged. Superseded hand, speech-bubble, and briefcase
SVG redraws were removed. PNG references remain archived in this directory.

## Earlier redraws and reference provenance

The earlier implementation used hand-authored vector `.svg` redraws for seven emoji
placements. The remaining envelope, telephone, and paper-plane redraws contain only vector
geometry and gradients: no image elements, embedded bitmaps, fonts, or external
resources. Existing consuming CSS is preserved.
The PNGs remain as visual references, not rendered site assets. The redraws aim
to match their silhouettes and shading, not to claim pixel-identical fidelity.
The former raster-wrapper generator has been removed.

Apple iOS 18.4 artwork, obtained from Emojipedia for the requested local menu design.
Original transparent 160px PNGs, displayed at 26px. Apple artwork is not represented
as an open-source icon set; source attribution does not confer a reuse license.

- emoji-briefcase.png: https://emojipedia.org/apple/ios-18.4/briefcase
- emoji-waving-hand.png: https://emojipedia.org/apple/ios-18.4/waving-hand
- emoji-chat-bubble.png: https://emojipedia.org/apple/ios-18.4/speech-balloon
- emoji-envelope.png: https://emojipedia.org/apple/ios-18.4/envelope
