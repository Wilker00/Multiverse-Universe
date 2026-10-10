# Quality checklist

Run this checklist before declaring a UI implementation complete.

Start with `python .cursor/skills/multiverse-ui/scripts/validate_ui.py .`.

## Identity

- IBM Plex Sans and IBM Plex Mono load from `public/fonts/` without a remote font dependency.
- No emoji appears in text, icons, generated examples, or accessible labels.
- Mascot SVGs in `public/mascot/` are exact copies of selected files from the supplied Downloads library.
- Selected poses match the simple standing family: round head, two solid oval eyes, one flat off-white body, and one clear gesture, shown on an ink stage.
- On an artwork card, the pose reads a little white with solid eyes, and the glass panel is quieter than the figure.
- Small mascot placements use a portrait or torso crop with visible black eyes.
- Guide poses have distinct roles and remain readable on their state-colored backplates.
- Other companies' logos, text, art, and product names are absent.
- The product name is Multiverse. The header wordmark is the lowercase word multiverse, and the header does not include the mascot.
- Public copy matches `docs/product/PRD.md`; it does not drift into a generic creative tool, unrelated research demo, or unsupported capability claim.
- Local fixture results, measured real-agent results, targets, and future product plans are labeled as different evidence classes.
- The twin-oval signal, asymmetric media corner, and rounded-rectangle actions are present without reproducing another product's composition.
- Artwork shown in the UI resolves from `public/media/`, not `reference-media/` or a download folder.
- No sparkle symbol is used as shorthand for AI; icons describe a concrete task or media type.

## Components

- Page and standard card surfaces are pure white; cream is not used as the global theme.
- Primary actions use the ink rounded rectangle; pills remain limited to segmented controls, status, and metadata.
- No green, gray, pulsing, or decorative circular status indicators appear; statuses use explicit text.
- No card or panel uses side bars, vertical accent stripes, thick one-sided borders, or hard neobrutalist offset drop shadows. Borders are uniform 1px hairline.
- Pastel colors stay inside media or illustration fields.
- Media-card text tone is explicit with `data-tone`.
- Artwork-led rails use real image assets for at least two thirds of visible cards.
- Media cards use the bounded width for the active viewport and remain `4 / 5`.
- Media images declare intrinsic dimensions and offscreen images lazy-load.
- All icons use a consistent monochrome stroke system.
- Standard utility icons sit on one neutral light-gray field; pastel icon tiles are not allowed.
- The page has one clear primary task and no reference-demo filler.
- Agent builders keep knowledge, reviewed memory, and current context visibly separate rather than merging them into one prompt field.
- Agent-builder mock records are labeled as examples, and browser-local saves state that no runtime is connected.
- Add-entry dialogs collect a source and return focus to the control that opened them.
- No randomized decorative dots, floating geometry, generic readiness labels, or self-referential design-system copy appears in the product UI.
- Every visible section maps to a product task or content need rather than demonstrating the design system.
- Standard information cards use compact horizontal internals and do not stretch beyond their content role.
- Three capability cards fit beside the desktop guide without making the section taller than approximately 260px.
- Media-card actions remain momentary and do not expose `aria-pressed` or persistent selected styling.
- Research uses one outer record, underline tabs, ruled information rows, and no nested metric or evidence cards.
- Research labels distinguish concepts and targets from measured results; no invented authors, paper IDs, peer-review claims, or safety guarantees appear.
- IBM Plex Mono is limited to short technical data and never used for body paragraphs.
- Plain language leads every section; unnecessary jargon and unexplained acronyms are absent.
- Necessary technical terms are defined on first use, and formulas or measurements have a nearby everyday-language explanation.

## Motion

- Hover and state transitions complete in 120–220ms.
- Logo fade plays once and completes within 420ms.
- Mascot poses do not autoplay in a loop.
- Pressing a media card gives one short scale response without a jump, bounce, or persistent touch hover.
- Text controls scale to 0.985 while pressed and do not generate random messages, floating chips, or duplicate live announcements.
- Rail arrows use native disabled states at the beginning and end of the scroll range.
- Reduced-motion mode removes movement and smooth scrolling.

## Responsive checks

- 320px: no page-level horizontal scrolling; all controls remain available.
- 390px: phone spotlight and four-item bottom navigation are intact.
- 768px: menu, two-column layout, and dialogs fit without clipping.
- 1024px: inline navigation and three-column groups fit.
- 1280px and 1440px: content stays centered and does not over-stretch.
- Rail density shows one card plus a preview on phone, at least two plus a preview on tablet, and four plus a preview at the desktop content maximum.
- 200% text zoom: content reflows and fixed chrome does not cover focus.
- Page gutters resolve to 16px, 24px, and 32px at the intended ranges.
- Display type stays visually subordinate to the viewport and never forces unrelated content offscreen.
- Mascot stages preserve clear space around the head, torso, and active gesture.
- Section whitespace is larger than component spacing so grouping remains obvious without extra dividers.
- The default research Overview record is no taller than 1,400px at 320px and 1,300px at 390px.
- Technical formulas stack into readable terms at phone widths and never expose a horizontal scrollbar.

## Interaction and accessibility

- Every interactive element works with keyboard input.
- Focus is visible and not clipped.
- Touch targets are at least 44px in phone layouts.
- Dialog focus returns to its trigger.
- Images have useful alt text or empty alt text when decorative.
- Color is not the only signal for state or meaning.
