# Responsive density

Use these bounds to stop cards and whitespace from expanding merely because a viewport is wider. These values are production requirements, not suggestions.

## Media cards

| Range | Width | Expected rail density |
| --- | --- | --- |
| Phone, `320px-767px` | `clamp(236px, 76vw, 296px)` | One complete card with the next card visible |
| Tablet, `768px-1023px` | `clamp(248px, 31vw, 288px)` | At least two complete cards with a following preview |
| Laptop and desktop, `1024px+` | `clamp(248px, 23vw, 276px)` | Three cards plus a preview at laptop width and four plus a preview at the 1180px content maximum |

- Use one `--media-card-width` custom property for both `width` and `flex-basis`.
- Use a `4 / 5` aspect ratio at every viewport.
- Use the `24px 24px 10px 24px` media corner, 12px phone gaps, and 14px gaps from tablet upward.
- Use 16px horizontal copy offsets on phone and no more than 18px on larger screens.
- Media-card titles use `clamp(1.35rem, 2vw, 1.65rem)` and supporting copy stays near `0.8rem`.

## Information cards

- Capability cards retain 10px by 12px padding, a 36px neutral icon field, and an 8px group gap.
- At `1024px+`, three capability cards and the mascot guide share a 260px section height.
- Below the container threshold, metadata forms its own row and may wrap; it must never force horizontal overflow.
- Do not assign a minimum height to ordinary information cards.

## Section rhythm

| Range | Section spacing | Heading-to-content spacing |
| --- | --- | --- |
| Phone | 64px | 24px |
| Tablet | 80px | 32px |
| Laptop | 88px | 32px |
| Desktop | 96px | 32px |

Component gaps remain smaller than section spacing. Do not add empty spacer elements or viewport-height cards to create hierarchy.
