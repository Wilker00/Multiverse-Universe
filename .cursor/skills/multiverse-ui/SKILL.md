---
name: multiverse-ui
description: "Applies the Multiverse Universe interface system: a light canvas, IBM Plex Sans and Mono typography, the lowercase multiverse wordmark, artwork-led media cards, unified research records, quiet ink controls, fast motion, monochrome information icons, the local mascot, and a purpose-built phone layout. Use for every UI, layout, card, button, typography, animation, responsive, research, media, or mascot change."
---

# Multiverse UI

Use this skill as the source of truth for Multiverse Universe interfaces. Read the matching resource before changing layout, typography, components, motion, responsive behavior, or mascot usage.

## Resources

- Color, type, radius, spacing, and motion: [tokens.md](tokens.md)
- Name, wordmark, signal motif, and copy voice: [identity.md](identity.md)
- Plain-language UI writing and technical-term boundaries: [language-and-copy.md](language-and-copy.md)
- Product-specific UI and prohibited generated-interface tropes: [anti-generated-ui.md](anti-generated-ui.md)
- Research-backed layout scale, whitespace, and structure: [scale-and-space.md](scale-and-space.md)
- Research records, evidence language, metrics, and technical typography: [research-and-technical.md](research-and-technical.md)
- Task, run, memory, evaluation, and prototype-state workspaces: [agent-studio.md](agent-studio.md)
- Imported Shadcn card-composition guidance adapted to this system: [imports/shadcn-card-composition.md](imports/shadcn-card-composition.md)
- Imported Wix spacing guidance adapted to this system: [imports/wix-spacing-adapter.md](imports/wix-spacing-adapter.md)
- Shells, buttons, cards, icons, and mascot: [components.md](components.md)
- Phone, iPad, laptop, desktop, and reflow: [responsive.md](responsive.md)
- Exact card widths and section density by viewport: [responsive-density.md](responsive-density.md)
- Hover, press, focus, disabled, and reduced-motion behavior: [interaction-states.md](interaction-states.md)
- Installing and using artwork and mascot files: [media.md](media.md)
- Mascot placement, framing, and clear-space rules: [mascot-placement.md](mascot-placement.md)
- Approved production mascot files and source checksums: [mascot-manifest.json](mascot-manifest.json)
- What each supplied screenshot contributes: [reference-map.md](reference-map.md)
- Required visual and behavior checks: [quality-checklist.md](quality-checklist.md)
- Deterministic source, asset, screenshot, and mascot validation: [scripts/validate_ui.py](scripts/validate_ui.py)
- Supplied screenshots: [reference-media](reference-media)

## Visual direction

Multiverse Studio is a calm, evidence-first workspace for configuring agent tasks, observing execution, reviewing verification, and managing reusable experience. It is not a gallery of copied layouts or a theatrical AI dashboard.

- ElevenLabs is a compactness and feedback benchmark only; never copy its component silhouettes, card ordering, or page composition.
- OpenAI informs editorial media rails and simple, monochrome information icons.
- Anthropic and Claude inform a character paired with one short explanation. Do not copy their coral field, serif, or drawings.
- The product name is Multiverse. The header wordmark is the lowercase word multiverse in IBM Plex Sans 700. Do not name pages Runo.
- The mascot is a guide. Do not place it in the header, and do not make a header mascot a requirement.
- The twin-oval signal, asymmetric media corner, black mascot stage, and rounded-rectangle actions form the interface signature.

Use those roles as ingredients. Never place every reference pattern on the same screen merely to prove it exists.

## Hard rules

- **Architecture & Build Phase**: The static HTML/CSS files (`index.html`, `styles.css`) are strictly for prototyping and testing. When real building begins, the agent MUST build exclusively with **React + Vite** (TypeScript/TSX), modularizing components while retaining the Multiverse design system.
- Start on pure white `--canvas` and `--surface`; large cream or dark page backgrounds are out of system.
- Use local IBM Plex Sans for interface text and IBM Plex Mono only for identifiers, formulas, measurements, and technical metadata. Do not depend on a remote font request.
- Plain language is the default. Avoid unnecessary jargon, define unavoidable technical terms on first use, and pair formulas or specialist metadata with a clear explanation.
- Do not use emoji anywhere, including icons, labels, empty states, or generated examples.
- Primary actions are ink rounded rectangles using `--radius-control`. Reserve pills for segmented controls, status, and metadata.
- Never use circular presence or status dots, including green "ready" indicators. Communicate status with explicit text inside a neutral chip or row.
- Never expose design-system implementation notes, use sparkles as shorthand for AI, add randomized decorative marks, or show generic readiness labels without a real state.
- Research content uses one flat record with ruled rows, not a dashboard of nested cards. Never invent peer-review status, authors, paper identifiers, benchmark results, or safety claims.
- **No Side Bars or Offset Shadows**: Never include vertical side bars, left-edge accent stripes, thick one-sided borders, or hard neobrutalist drop shadows on cards, buttons, or components. Borders must be uniform 1px `--hairline` on all sides with flat or subtle, symmetrical elevation.
- Media-card text follows the field tone: `--ink` on light fields and `--on-ink` on dark or painted fields.
- Motion is fast and quiet. The logo fade is the only slower entrance and it plays once.
- Pressing a control never generates random text, floating encouragement, or a second live announcement.
- Never autoplay a looping mascot animation. Pose changes are user-triggered or play once.
- Honor `prefers-reduced-motion: reduce` by showing the final state without animation or smooth scrolling.
- Icons are monochrome strokes on a 16px construction grid and use `currentColor`.
- Use only the simple standing mascot in [reference-media/12-mascot-family.png](reference-media/12-mascot-family.png): round head, two solid oval eyes, one flat off-white body, and one clear arm gesture. Install only the files in [mascot-manifest.json](mascot-manifest.json). Do not redraw it, and do not use seated, profile, outlined, or other archive styles.
- Reference screenshots are guidance only. User-facing artwork must be installed under `public/media/` and used by the live markup.
- Artwork-led collections must use real image files for most cards; flat color is not a substitute for requested media.
- Phone viewports receive a purpose-built shell and bottom navigation. Do not shrink the desktop hero onto a phone.
- Use viewport queries for page structure and container queries for reusable card internals.
- At 320 CSS pixels, information and controls must reflow without page-level horizontal scrolling.
- Every control must have a visible focus state and a target of at least 44px in touch layouts.

## Before editing UI

1. Identify the page's single primary visitor task.
2. Select no more than three relevant patterns from [reference-map.md](reference-map.md).
3. Choose components from [components.md](components.md).
   - For operational task or run interfaces, read [agent-studio.md](agent-studio.md) before composing the shell.
4. Take every visual value from [tokens.md](tokens.md).
5. Install selected artwork under `public/media/` following [media.md](media.md); never render files directly from the hidden reference folder.
6. Install only the approved source-to-production mappings in [mascot-manifest.json](mascot-manifest.json). Reject any pose that does not match the simple standing family in the reference strip.
7. Implement phone structure first, then expand through the ranges in [responsive.md](responsive.md).
8. Run `python .cursor/skills/multiverse-ui/scripts/validate_ui.py .` and every applicable check in [quality-checklist.md](quality-checklist.md).
