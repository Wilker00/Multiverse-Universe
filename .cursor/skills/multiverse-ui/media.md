# Media and mascot installation

Reference screenshots explain visual patterns. They are not product assets and must remain inside `reference-media/`.

## Live artwork

1. Put final, original, or licensed card artwork in `public/media/`.
2. Use semantic lowercase filenames such as `painted-signal.jpg` rather than generated IDs.
3. Prepare portrait card art at a 4:5 ratio and at least 960 by 1200 pixels.
4. Compress photographic or painted artwork before use. Prefer JPEG or WebP unless transparency is required.
5. Add intrinsic `width` and `height` attributes in HTML. Add `loading="lazy"` to offscreen images.
6. Verify every `src` resolves from the actual page. A file existing only in `reference-media/`, Downloads, or a generation output folder is not installed.

## Mascot selection

Install only the source files declared in [mascot-manifest.json](mascot-manifest.json). Copy them from `C:\Users\simok38\Downloads\Mascot` into `public/mascot/` with the declared semantic names and preserve each source file exactly. Do not scan the larger archive for replacements unless the user explicitly asks to change the approved set.

Never install a file named in `rejectedSources`. Those files are seated, profile, outlined, or otherwise outside the simple standing family.

Current semantic set:

| File | Use |
| --- | --- |
| `Logo.svg` | Standing pose. Not a header mark. |
| `Runo.svg` | Retired wordmark file. The live name is the word multiverse. |
| `portrait.svg` | Compact identity overlay |
| `neutral.svg` | Brand or guide card |
| `welcome.svg` | Welcome and first step |
| `point.svg` | Direction and second step |
| `thinking.svg` | Reflection and visual review |
| `celebrate.svg` | Completion and third step |

Use the mascot in one focused area per viewport. Do not paste the same pose across a media rail, hero, and closing section.

## Pose readability

Use [mascot-placement.md](mascot-placement.md) for production dimensions, clear space, and state-specific framing.

- Use the framed portrait for avatars and compact overlays below 112 pixels.
- Use torso or full-body poses only when the stage is large enough to preserve the eyes, hands, and gesture.
- The pose must match the reference strip: round head, two solid oval eyes, one flat body, and one readable gesture.
- Check the SVG on an `--ink` stage. The eyes and body edge must remain visible without CSS filters or SVG recoloring.
- Do not replace this family with seated, profile, outlined, or newly drawn poses.
- Prefer a role-specific sequence such as welcome, direction, and completion over three visually similar poses.
- Pose changes may crossfade and move up to 5 pixels once after a user action. Do not add idle bobbing, blinking, or autonomous loops.

## Acceptance check

- Open the page with network disabled and confirm the font, artwork, and mascot still render.
- Search live markup for `reference-media`, `Downloads`, and generation output paths; the search must return no asset references.
- Compare `public/mascot/` against [mascot-manifest.json](mascot-manifest.json); reject unexpected files and checksum mismatches.
- Inspect phone and desktop screenshots to confirm artwork crops intentionally and mascot clear space remains intact.
