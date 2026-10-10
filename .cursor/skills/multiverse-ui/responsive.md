# Responsive layout

Build mobile-first. Use viewport queries for the app shell and major page composition, then use container queries for cards that can appear in different columns.

The ranges are verification targets, not device detection. Break a layout when its content stops fitting, not because a brand released a new screen size.

## Viewport ranges

| Range | Width | Required composition |
| --- | --- | --- |
| Phone | `320px–767px` | Purpose-built phone shell, one column, 16px gutters |
| iPad portrait | `768px–1023px` | Top menu, selective two-column sections, 24px gutters |
| Laptop / iPad landscape | `1024px–1279px` | Inline nav, up to three columns, 32px gutters |
| Desktop | `1280px+` | Centered 1180px content, editorial whitespace |

Always test at 320, 390, 768, 1024, 1280, and 1440 CSS pixels. Also test 200% text zoom at a desktop width.

## Phone

- Show the lowercase multiverse wordmark in a compact top bar. Do not add a mascot mark.
- Replace the desktop hero with a task-oriented phone spotlight.
- Use a fixed bottom tab bar with four labeled items and safe-area padding.
- Keep one content column and 16px gutters.
- Use 64px section gaps and 44px minimum targets.
- Media cards use `clamp(236px, 76vw, 296px)` in a horizontal snap rail with a 12px gap.
- Dialogs become bottom sheets.
- Research records remain one card: header, tabs, document, then a compact three-metric evaluation row and evidence list.
- Do not hide essential desktop content; restructure it or move it behind a clear control.
- Page-level horizontal overflow is never allowed. A media rail may scroll inside its own clipped wrapper.

## iPad portrait

- Show the wordmark and one menu control. Do not add a header mascot.
- Use two columns when each column remains at least 280px.
- Keep 24px gutters and 80px section gaps.
- Do not force every section into two columns; stack when either column would lose readable line length or clear visual hierarchy.
- Research records may split the document and evaluation frame only when both columns remain at least 280px.
- Dialogs remain centered.
- A media rail may show two full cards and a visible preview of the next.

## Laptop and iPad landscape

- Show inline text navigation.
- Use up to three columns.
- Keep reading copy near 58 characters per line.
- Keep technical records to one outer surface with internal ruled sections; do not add an evidence-card sidebar.
- Keep 88px section gaps and 32px gutters.

## Desktop

- Center header and content at a maximum width of 1180px.
- Use 96px section gaps.
- A media rail shows four compact cards plus a partial next card at the 1180px content maximum.
- Do not stretch paragraphs or cards solely to fill wide monitors.

## Container behavior

Use a named inline-size container around reusable card groups.

```css
.card-shell {
  container: cards / inline-size;
}

.capability-card {
  display: grid;
  column-gap: 10px;
  row-gap: 2px;
}

@container cards (inline-size >= 420px) {
  .capability-card[data-layout="adaptive"] {
    grid-template-columns: auto 1fr;
    align-items: start;
  }
}
```

Container rules may change card internals. Major navigation and phone-versus-desktop structure stay in viewport media queries.

## Reflow and safe areas

- At 320 CSS pixels, all text reflows in one reading direction.
- Allow long labels and URLs to wrap with `overflow-wrap: anywhere`.
- Use `min-width: 0` on grid and flex children.
- Use `max-width: 100%` for media.
- Pad fixed phone chrome with `env(safe-area-inset-*)`.
- Give page content enough bottom padding that the final action clears the tab bar.
- Sticky elements must not obscure focused controls.
