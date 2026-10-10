# Reference map

The screenshots are a pattern library, not a single-page wireframe. Select only what supports the current screen's primary task.

| File | Keep | Avoid |
| --- | --- | --- |
| `01-notes-sheet.png` | Quiet overlay, simple rows, soft backdrop | Browser chrome and washed-out contrast |
| `02-editorial-hero.png` | Compact editorial hierarchy, restrained proof blocks | Tiny body copy and excessive empty canvas |
| `03-painted-project-cards.png` | Full-field media cards, bottom-aligned light type | Copying logos or using unreadable art without a tone treatment |
| `04-how-it-works.png` | Four concise sequential cards | Decorative icons unrelated to the step |
| `05-gather-ideas.png` | Capability grouping inside one clear workspace | Putting every content type in a visually identical card |
| `06-refer-panel.jpg` | One focused promotion, icon rows, copy action | Saturated full-page gradients and credit claims |
| `07-mood-phone.png` | Purpose-built mobile spotlight and thumb navigation | Recreating the exact mood tracker or unlabeled controls |
| `08-place-card.png` | Metadata chips, strong media frame, location row | Heavy floating shadow and copied travel content |
| `09-profile-cards.png` | Structured metadata and paired actions | Tiny low-contrast type and fashion photography assumptions |
| `10-product-sheets.png` | Compact technical metadata and controlled rhythm | Ticket notches as decoration, copied typography, and all-caps paragraphs |
| `11-image-card-carousel.png` | Editorial media rail, category label, partial next card | Copying OpenAI branding, art, text, or navigation |
| `13-character-card.png` | One character paired with one short explanation | Copying the coral field, the hand drawing, or Anthropic's mark |

## Canonical Multiverse baselines

- `14-canonical-phone-390.png`: approved phone hero, typography, and bottom navigation.
- `15-canonical-laptop-1024.png`: approved laptop section rhythm and three-card-plus-preview rail density.
- `16-canonical-desktop-1440.png`: approved desktop research heading, record geometry, and technical hierarchy.
- Use these three screenshots to verify Multiverse-specific implementation. They take precedence over external references for component geometry and page composition.

## Recommended combinations

- Public product overview: `05` + `11` + local mascot, adapted to tasks, evidence, and verification.
- Guided creation flow: `04` + `01` + local mascot.
- Mobile home: `07` + `05` + local mascot.
- Project detail: `08` + `10`, with real project media.

Do not combine more than three screenshot patterns on one screen without a specific content reason.

References may contribute density, hierarchy, or interaction principles, but never the combined component silhouette. Controls use rounded rectangles, media uses the asymmetric corner, and labels use the twin-oval signal regardless of the source screenshot. Pages use the name Multiverse.

Files in `reference-media/` are never live product assets. They document composition and interaction patterns only. Install original or licensed artwork under `public/media/` before describing a media-card implementation as complete.
