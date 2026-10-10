# Scale, whitespace, and structure

Use these rules to preserve a calm hierarchy instead of making every element visually loud.

## Research basis

- [Carbon spacing](https://www.carbondesignsystem.com/building-blocks/foundations/spacing/overview) uses a consistent scale and explains that proximity communicates relationships while larger surrounding space communicates hierarchy.
- [Carbon 2x Grid](https://www.carbondesignsystem.com/building-blocks/foundations/2x-grid/overview) uses an 8px mini unit and shared key lines to create visual rhythm.
- [Material responsive UI](https://m1.material.io/layout/responsive-ui.html) keeps margins and gutters consistent while columns adapt to the available width.
- [Apple layout guidance](https://developer.apple.com/design/human-interface-guidelines/layout) recommends adaptable margins, readable content guides, safe areas, and stacking adjacent views when larger text needs more room.
- [W3C Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) requires ordinary page content to reflow at 320 CSS pixels without two-dimensional scrolling.
- [W3C Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing) requires containers to tolerate user-adjusted line, paragraph, letter, and word spacing without clipping or overlap.

## Application rules

- Use the 8px rhythm for planned spacing; use 4px only for optical corrections or compact metadata.
- Keep related label, title, and copy gaps between 8px and 24px.
- Keep component-to-component gaps between 16px and 40px.
- Keep section-to-section gaps between 64px and 96px by breakpoint.
- Align headings, copy, cards, and controls to shared vertical key lines.
- Limit general reading copy to 60 characters and compact instructions to about 44 characters.
- Use bounded `clamp()` scales so headings grow without dominating the viewport.
- Scale artwork and mascot poses inside their stages; never use edge contact as the default composition.
- At 320px and at increased text spacing, content must expand vertically rather than clip or overlap.
