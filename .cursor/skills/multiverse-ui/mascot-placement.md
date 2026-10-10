# Mascot placement

Use only files approved by `mascot-manifest.json`. Placement may crop or scale the rendered image, but the SVG source, paths, fills, proportions, and orientation must never be edited.

## Guide stage

- Keep the desktop guide at 260px tall and preserve at least half a head width of clear space around the active pose.
- Welcome uses a 64% stage height and an 82% maximum width, aligned bottom center.
- Point uses a 66% stage height and an 86% maximum width, aligned bottom center so the raised gesture remains visible.
- Celebrate uses a 58% stage height, a 58% maximum width, and a 12px bottom offset because its source aspect ratio is wider and shorter.
- Crossfade poses over 210ms with no bounce, rotation, recoloring, or autonomous loop.

## Compact placements

- Below 112px, use `portrait.svg` or a deliberate torso crop with both black eyes and the active gesture visible.
- The mascot media card keeps the complete neutral torso inside a black frame with no edge contact.
- Limit the neutral mascot to 76% of the frame width and 78% of its height; align it bottom center.
- An artwork card places the original pose beside the title and sentence. The body stays a little white, the eyes stay solid, and the glass panel stays quieter than the figure: lower opacity, less blur, and less padding. Do not use a pure black plate, a faint ghost body, or an outline.
- Do not place the mascot in the header. The header name is the lowercase word multiverse.

## Review

- Check every pose at phone and desktop widths, including all guide states rather than only the initial state.
- Reject any placement that clips the head, eyes, torso boundary, or meaningful arm gesture.
- Do not add another mascot instance merely to fill whitespace.
