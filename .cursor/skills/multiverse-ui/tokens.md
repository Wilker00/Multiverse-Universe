# Tokens

Use these values as CSS custom properties. Do not introduce a nearby palette, second font, alternate easing curve, or one-off radius.

## Color

| Token | Value | Use |
| --- | --- | --- |
| `--canvas` | `#ffffff` | Page background |
| `--surface` | `#ffffff` | Cards, menus, sheets, dialogs |
| `--ink` | `#11120f` | Primary text and actions |
| `--on-ink` | `#ffffff` | Text on ink and dark media |
| `--muted` | `#595a54` | Secondary copy and metadata |
| `--hairline` | `#e3e3df` | Borders and dividers |
| `--icon-field` | `#f1f2ef` | Neutral field behind standard utility icons |
| `--field-cream` | `#f4f4f1` | Optional neutral mascot frame only |

Card atmospheres belong to media and illustration areas, never body copy, primary controls, or standard utility-icon fields. Utility icons use `--icon-field`; do not color-code them with pastels.

| Token | Value | Text tone |
| --- | --- | --- |
| `--field-mint` | `#b7decf` | light |
| `--field-peach` | `#efc3a5` | light |
| `--field-lavender` | `#c9b9df` | light |
| `--field-sky` | `#b4d2e8` | light |
| `--field-night` | `#17221b` | dark |

Set `data-tone="light"` or `data-tone="dark"` on media cards. Do not use blend modes to repair contrast.

## Type

Load local IBM Plex Sans and IBM Plex Mono variable fonts. The checked-in Latin files are the production sources; a remote font stylesheet is not required.

```css
@font-face {
  font-family: "IBM Plex Sans";
  font-style: normal;
  font-weight: 100 700;
  font-display: swap;
  src: url("public/fonts/ibm-plex-sans-latin-variable.woff2") format("woff2");
}

@font-face {
  font-family: "IBM Plex Mono";
  font-style: normal;
  font-weight: 100 700;
  font-display: swap;
  src: url("public/fonts/ibm-plex-mono-latin-variable.woff2") format("woff2");
}

--font-ui: "IBM Plex Sans", "Segoe UI", Arial, sans-serif;
--font-mono: "IBM Plex Mono", "SFMono-Regular", Consolas, monospace;
```

| Role | Size | Weight | Tracking | Line height |
| --- | --- | --- | --- | --- |
| Display | `clamp(3.4rem, 6.4vw, 5.25rem)` | 300-400 | `-0.05em` | 0.93 |
| Phone display | `clamp(2.6rem, 12vw, 3.35rem)` | 300-400 | `-0.045em` | 0.95 |
| Section title | `clamp(2.125rem, 4vw, 3.5rem)` | 300-400 | `-0.04em` | 1 |
| Media-card title | `clamp(1.35rem, 2vw, 1.65rem)` | 300-400 | `-0.035em` | 1 |
| Body | `0.9375rem` | 400 | `0` | 1.55 |
| Label, nav, button | `0.8125rem` | 600 | `0` | 1 |
| Caption, metadata | `0.72rem` | 600 | `0.08em` | 1.2 |
| Technical mono | `0.68rem-1.1rem` | 400-500 | `0-0.08em` | 1.35-1.55 |

Keep paragraphs between 42 and 66 characters per line. Weight 600 or 700 is reserved for short emphasis, labels, and controls, never full paragraphs. Use IBM Plex Mono only for identifiers, dates, formulas, measurements, and short technical labels.

## Layout scale

- Build spacing on the 8px rhythm, using 4px only for optical adjustments and compact metadata.
- Keep the content area at a maximum of 1180px, excluding responsive page gutters.
- Use page gutters of 16px on phone, 24px on tablet, and 32px on laptop and desktop.
- Keep general reading copy at or below 60 characters and compact instructional copy near 44 characters.
- Scale mascot artwork inside its stage rather than filling the available box; preserve visible space around the head and gesture.

## Radius

| Token | Value | Use |
| --- | --- | --- |
| `--radius-card` | `16px` | Surface cards |
| `--radius-control` | `14px` | Text buttons, menu controls, and header actions |
| `--radius-media` | `24px 24px 10px 24px` | Media cards and illustration frames |
| `--radius-pill` | `999px` | Status chips, guide roles, and segmented controls only |
| `--radius-sheet` | `26px 26px 0 0` | Phone sheets |

## Spacing

| Token | Value |
| --- | --- |
| `--space-1` | `4px` |
| `--space-2` | `8px` |
| `--space-3` | `12px` |
| `--space-4` | `16px` |
| `--space-5` | `24px` |
| `--space-6` | `32px` |
| `--space-7` | `48px` |
| `--space-8` | `72px` |
| `--space-section` | `64px-96px` by breakpoint |

Section gaps are 64px on phone, 80px on iPad portrait, 88px on laptop, and 96px on desktop. Internal component spacing stays smaller so proximity communicates grouping.

## Elevation

- Surface: `0 12px 32px rgba(9, 11, 6, 0.055)` plus a 1px hairline.
- Floating menu or dialog: `0 18px 50px rgba(9, 11, 6, 0.12)`.
- Media cards use a hairline only. Do not stack decorative shadows.
- Prohibition: Hard offset drop shadows, neobrutalist shadows, and one-sided vertical accent bars (such as thick black left borders) are strictly forbidden. All borders must be uniform 1px `--hairline` and elevation must be soft and symmetrical.

## Motion

| Token | Value | Use |
| --- | --- | --- |
| `--ease` | `cubic-bezier(0.2, 0, 0, 1)` | All motion |
| `--duration-enter` | `180ms` | One-time opacity and 4px rise |
| `--duration-hover` | `120ms` | Color, border, and restrained 1px lift |
| `--duration-logo` | `420ms` | Logo fade, once |
| `--duration-pose` | `210ms` | User-triggered pose crossfade |

No bounce, spring overshoot, parallax, marquee, or autonomous pose loop. Sequential entrance delays may differ by at most 40ms.

Interactive media cards may lift by 1px only on hover-capable devices. Their pressed state scales to no less than `0.992` for 70ms and must not combine a large image zoom with card movement.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
