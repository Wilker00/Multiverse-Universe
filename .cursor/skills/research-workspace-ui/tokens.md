# Design Tokens — Research Workspace UI

Design tokens for Notion + Cognition research paper interfaces.

---

## 1. Color Palette

| Token | Value | Description |
| :--- | :--- | :--- |
| `--canvas` | `#ffffff` | Primary document page background |
| `--surface` | `#ffffff` | Card surfaces, modals, popovers |
| `--surface-secondary`| `#f8fafc` | Secondary inspector dock, code backgrounds |
| `--ink` | `#0f172a` | Primary text, titles, active navigation |
| `--muted` | `#64748b` | Secondary descriptions, dates, annotations |
| `--hairline` | `#e2e8f0` | Dividers, uniform borders (1px) |
| `--icon-field` | `#f1f5f9` | Background behind utility icons and telemetry chips |
| `--callout-bg` | `#f8f9fa` | Neutral background for abstract boxes |
| `--code-bg` | `#f1f5f9` | Inline code chips and code blocks |

Strict rule: No neon accents, no pastels for utility badges, and no colored edge stripes.

---

## 2. Typography

### Font Families
- Reading Text & UI: `"Inter", "Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;`
- Telemetry, Code & Citations: `"JetBrains Mono", "SF Mono", Menlo, Consolas, monospace;`

### Font Scale & Metrics
- Paper Title: `2.4rem` (`38px`), weight 600, line height 1.18, tracking `-0.035em`
- Section H1: `1.6rem` (`25.6px`), weight 600, line height 1.25, tracking `-0.025em`
- Section H2: `1.25rem` (`20px`), weight 600, line height 1.35, tracking `-0.015em`
- Section H3: `1.05rem` (`16.8px`), weight 600, line height 1.45, tracking `-0.01em`
- Reading Body: `1.0rem` (`16px`), weight 400, line height 1.68, measure `68ch`
- Metadata & Telemetry: `0.78rem` (`12.5px`), weight 500, font family monospace
- Caption & Eyebrow: `0.72rem` (`11.5px`), weight 600, letter-spacing `0.08em`, uppercase

---

## 3. Spatial Scale (8px Base)

- `--space-1`: `4px`
- `--space-2`: `8px`
- `--space-3`: `12px`
- `--space-4`: `16px`
- `--space-5`: `24px`
- `--space-6`: `32px`
- `--space-7`: `48px`
- `--space-8`: `64px`

---

## 4. Radii

- `--radius-card`: `12px` (Surface cards, figures, abstract callout)
- `--radius-control`: `8px` (Buttons, dropdowns, search inputs)
- `--radius-chip`: `6px` (Telemetry badges, DOI tags, code blocks)
- `--radius-pill`: `999px` (Status indicators, author tags)

---

## 5. Elevation & Borders

- Default Surface: Uniform 1px `--hairline` border around all four edges.
- Floating Popovers & Menus: `0 12px 30px rgba(15, 23, 42, 0.08)` plus uniform 1px hairline.
- Prohibition: Never use vertical side bars, thick left accent borders, or neobrutalist offset drop shadows. Elevation is soft and symmetrical.
