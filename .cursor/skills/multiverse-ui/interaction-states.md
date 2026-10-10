# Interaction states

Every interactive component needs a stable default, focus, hover where available, pressed, and disabled state. Motion must communicate response without becoming the main visual event.

## Media cards

- Media cards are momentary action buttons. Keep `data-card-mode`; do not add `aria-pressed`, selected borders, selected labels, or persistent styling.
- Activation updates the creation mode and keeps the existing navigation destination.
- On hover-capable devices only, lift by 1px and scale the image to at most `1.01` over 120ms.
- While pressed, scale the card to `0.992` for 70ms and keep the image at or below `1.006`.
- Use an inset dual-tone focus ring so clipped rails cannot hide keyboard focus.
- Enter and Space rely on native button activation and must produce the same result as pointer activation.

## Controls

- Buttons, icon buttons, navigation links, and mode switches use a 2px ink focus outline with a white separation halo.
- Focus must not add a lift or scale transform.
- Mode-switch buttons use `aria-pressed` because they are persistent mode controls; this rule does not apply to media-card actions.
- Rail controls use the native `disabled` property at the start and end of the rail. Recalculate after load, scrolling, resizing, and rail-size changes.
- Disabled controls remain visible, use reduced opacity, and cannot receive focus.
- Text controls use a native `:active` scale response only. Never generate random press copy, floating encouragement, or an extra live-region announcement.

## Reduced motion

- Remove smooth scrolling and visible transitions under `prefers-reduced-motion: reduce`.
- Do not replace removed motion with flashing, color pulses, or repeated opacity changes.
