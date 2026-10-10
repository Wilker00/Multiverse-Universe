# Imported card composition guidance

Adapted from the local `shadcn-best-practices` skill. This project does not install Shadcn, Tailwind, React, or its visual theme.

## Rules retained

- Compose each card from a clear header, content area, and optional footer or status region.
- Use existing card variants before inventing one-off structures.
- Use semantic system tokens for background, border, text, and muted text instead of raw component colors.
- Use parent `gap` values for layout instead of disconnected child margins.
- Keep icon sizing under component control so icons remain consistent across cards.
- Use a badge or status region for metadata instead of styling arbitrary inline text.

## Multiverse adaptation

- Standard information cards use 10px to 12px padding, a 36px neutral-gray icon field, 10px column gaps, and 2px internal row gaps.
- Titles stay near 15px; supporting copy stays near 12px with a 1.32 line height.
- Compact cards use a horizontal icon-content structure, not a tall stacked presentation.
- Card backgrounds remain pure white with a single hairline border and minimal elevation.
- Utility icon fields remain neutral gray; pastel category tiles are reserved for artwork and illustration surfaces.
- Artwork cards remain separate from information cards and may keep their editorial aspect ratios.
