# Imported spacing guidance

Adapted from the local `wix-design-system` skill. This project does not install Wix components or inherit Wix styling.

## Rules retained

- Use named spacing tokens for gap, padding, and margin rather than arbitrary values.
- Prefer a compact progression equivalent to 4px, 8px, 12px, 16px, 20px, and 24px.
- Choose component dimensions separately from spacing tokens; do not turn padding tokens into fixed card sizes.
- Use a responsive layout wrapper and cells when card groups need to reflow.

## Multiverse adaptation

- Compact information-card padding is capped at 12px and 20px is reserved for emphasized standalone cards.
- Card-group gaps stay between 8px and 16px.
- A compact three-card stack should fit beside a 260px guide card at laptop and desktop widths.
- At narrow widths, cards stack vertically but retain compact horizontal internals.
