# Components

Build interfaces from these components using values from [tokens.md](tokens.md). A screen should express one clear task and only the components required for it.

---

## 1. App Shell and Navigation

### Desktop and Laptop Header
- Shows the lowercase wordmark `multiverse` in IBM Plex Sans 700 and no more than four inline text links.
- Put less-frequent destinations in one labeled `More` menu; do not shrink seven or eight links into the header.
- Do not place the mascot in the header.
- Actions: Optional secondary button (e.g. "How it works") using `--radius-control`.
- Background: Translucent `--canvas` with backdrop blur, 1px `--hairline` bottom divider. Remains visually flat.

### Tablet Navigation
- Header displays wordmark and a menu trigger button.
- Expands into a compact panel with clear tap targets (minimum 44px height).

### Phone Bottom Tab Bar
- Use a fixed bottom navigation bar only when repeated mobile use justifies it. Keep at most four destinations such as Tasks, Runs, Memory, and Skills.
- Height: 64px plus `env(safe-area-inset-bottom)`.
- Active item uses `--ink` icon and label; inactive items use `--muted`.
- Translucent white background with light top hairline border.

---

## 2. Hero Sections

### Mobile Task Entry (Viewports < 768px)
- **Purpose**: Presents the current task, run state, or one clear starting action without overwhelming the viewport.
- **Artwork Frame**: Prominent 4:5 or 3:4 image frame with `--radius-media`.
- **Floating Badge**: Torso crop badge (`portrait.svg`) positioned at the bottom-right corner of the art.
- **Copy Stack**: Eyebrow label, concise H1, and one sentence describing the outcome or current state.
- **Controls**: Show one primary action and, when necessary, one secondary review action. Add a segmented switch only for true peer views.

### Desktop Studio Entry (Viewports >= 768px)
- **Purpose**: Introduces one task or current run and exposes its evidence-backed next action.
- **Left Column (Copy & Controls)**:
  - Eyebrow: `0.72rem` uppercase tracking.
  - Display Title: Fluid heading sized to preserve task context above the fold; avoid landing-page scale inside the authenticated product.
  - Lede Paragraph: Concise 2-sentence value proposition.
  - View Switch: Optional segmented row for peer views such as Summary, Trace, and Checks.
  - Dynamic State Region: Surface region with `aria-live="polite"` announcing meaningful run-state changes only.
  - Action Row: Primary task action and a secondary evidence or configuration action.
- **Right Column (Showcase & Mascot Note)**:
  - Media Showcase Frame: 4:5 aspect ratio with `--radius-media`.
  - Layered Media: Use only on public or educational pages. Operational views show real artifacts, checks, or task context instead.
  - Bottom Rail Link: Metadata label linking to the underlying evidence or source.
  - Attached Mascot Note: Optional guidance card with a 60px black stage and one concise next-step prompt; never cover alerts or run evidence.

---

## 3. Segmented Mode Switch

Use for switching between two to four peer views or mutually exclusive modes, such as `Summary`, `Trace`, and `Checks`.

- Container: Pill-shaped container (`--radius-pill`), background `--icon-field`, 4px internal padding.
- Button items:
  - Height: 36px (44px on mobile touch viewports).
  - Border-radius: `--radius-pill`.
  - Active state: Background `--surface`, color `--ink`, subtle elevation, `aria-pressed="true"`.
  - Inactive state: Transparent background, color `--muted`, `aria-pressed="false"`.
- Keyboard support: Arrow left/right navigates between options.

---

## 4. Form Controls and Workspace Inputs

Use for defining tasks, naming runs, entering constraints, and editing review notes.

### Single-Line Text Input
- Height: 42px desktop, 46px touch layouts.
- Padding: `0 16px`.
- Radius: `--radius-control`.
- Border: 1px `--hairline`.
- Background: `--surface`.
- Focus state: 1.5px solid `--ink` outline or ring. No glowing pastel focus shadows.
- Placeholder: Color `--muted`, font weight 400.

### Workspace Textarea
- Multi-line field for objectives, constraints, review notes, and human feedback.
- Padding: `14px 16px`.
- Radius: `--radius-card`.
- Border: 1px `--hairline`.
- Line height: 1.55 body line-height.
- Character / Word Counter: Aligned to the bottom right using caption typography (`0.72rem`, `--muted`).

### Field Labels and Eyebrows
- Always placed above the input control.
- Typography: Label/caption weight 600, uppercase with `0.08em` tracking.

---

## 5. Buttons

### Primary Ink Control
- Height: 42px desktop; 46px on touch layouts.
- Padding: `0 20px`, radius `--radius-control`.
- Background: `--ink`, text `--on-ink`, font weight 600.
- Hover: Mixes 8% white into the fill and rises by 1px.

### Secondary Control
- Height: Same dimensions as primary.
- Background: Transparent, border: 1px `--hairline`, text `--ink`.
- Hover: Changes background to `--surface`.

### Icon Button
- Dimensions: 44px square on touch layouts, 40px otherwise.
- Border: Circular or pill outline using 1px `--hairline`.
- Icon: 16px or 20px monochrome stroke icon with accessible `aria-label`.

### Tactile Press Feedback
- While pressed, scale to `0.985`.
- Do not bounce or trigger floating text bubbles.
- `prefers-reduced-motion` disables scale transformation.

---

## 6. Cards

**Strict Border and Elevation Rule (No Side Bars)**:
- All cards must use clean, uniform 1px `--hairline` borders around all four edges (or clean transparent borders on media cards).
- Never include vertical side bars, left-edge accent borders, thick indicator stripes, or hard neobrutalist drop shadows.
- Elevation must remain flat or subtle and symmetrical.

### Surface Card (Information and Utilities)
- Use for menus, settings, task lists, and explanations.
- Background: Pure white `--surface`, radius: `--radius-card`, uniform 1px `--hairline` border on all sides.
- Padding: 10px to 12px for compact cards; 20px for standalone feature cards.
- Rows use a 16px monochrome icon, label, and optional trailing metadata.
- Cards are content-sized by default. Do not stretch unnecessarily.

### Media Card (Public Explanations and Saved Collections)
- Aspect ratio: 4 / 5 across all viewports.
- Radius: Asymmetric corner `--radius-media` (`24px 24px 10px 24px`).
- Border: 1px transparent or hairline.
- Action control: 38px rounded-square control with 16px stroke icon.
- Twin-oval signal: Decorative twin-oval mark placed before top-left metadata.
- Artwork: Fills the entire field; at least two thirds of collections use real files from `public/media/`.
- Text tone: `data-tone="light"` uses `--ink`; `data-tone="dark"` uses `--on-ink`.
- Mascot pairing: Features one filled pose with solid eyes on a quieter glass backing.

### Capability Card
- Compact horizontal action card for destinations such as Trace, Checks, Memory, or Skills.
- 18px stroke icon inside a 36px neutral light-gray field (`--icon-field`).
- Title near 15px, supporting text near 12px, padding 10px by 12px.
- Never use pastel backgrounds behind utility icons.

---

## 7. Media Rail and Controls

- Layout: Horizontal flex container with scroll-snap alignment.
- Bounded widths: Strictly follow widths defined in [responsive-density.md](responsive-density.md).
- Controls: Previous and Next icon buttons placed above the rail. Disabled state when scroll reaches start or end.
- Mobile behavior: Native smooth touch swipe and scroll snap without visible scrollbars.

---

## 8. Status Chips and Badges

- Height: 24px, radius: `--radius-pill`.
- Padding: `4px 10px`.
- Typography: Caption/metadata (`0.72rem`, weight 600, letter-spacing `0.06em`).
- Status labels are text-only and use a neutral border or `--icon-field` background.
- Show a status only when it represents current, data-backed state. Generic readiness labels are not interface decoration.
- Never add green, gray, animated, or decorative circular presence dots.

---

## 9. Empty States and Loading Skeletons

### Empty Workspace State
- Displayed when no tasks, runs, memories, or skills exist in the current scope.
- Centered layout within a surface card frame.
- Features the neutral standing mascot (`portrait.svg` or `neutral.svg`) on an ink stage.
- Clear heading, one sentence of guidance, and one primary call-to-action button.

### Loading Skeleton
- Placeholders match exact component dimensions and radii.
- Background: `--icon-field`.
- Animation: Subtle opacity pulse between 0.6 and 1.0 (1.5s ease-in-out).
- In `prefers-reduced-motion`, pulse is disabled and remains static.

---

## 10. Quiet Notification Toasts

- Purpose: Transient confirmation when an action completes (e.g. "Task saved", "Memory kept task-local").
- Position: Fixed at bottom-center of viewport, 24px above bottom navigation.
- Appearance: Pill container (`--radius-pill`), background `--ink`, text `--on-ink`, padding `8px 18px`.
- Behavior: Fades in quietly, remains visible for 2.5 seconds, fades out. No sound, no bouncing.

---

## 11. Mascot Guide

- Source assets located in `public/mascot/`.
- Allowed poses: `welcome.svg`, `point.svg`, `thinking.svg`, `celebrate.svg`, `portrait.svg`, `neutral.svg`.
- Every pose has a round head, two solid oval eyes, and one clear gesture.
- Mascot stage: Place the figure on an `--ink` background stage so the off-white body remains visible.
- Crossfades play only on user interaction or once on initial guide load; never loop autonomously.
- Reserve the mascot for guidance, empty states, education, and brand moments. Use short text markers or role names for agents; do not repeat the mascot as every agent avatar.

---

## 12. Method and Closing Sections

- Method Section: Three concise ruled rows for intent, evidence, and limits. Keep implementation details in skill documentation, not product copy.
- Closing Section: On public pages only, pair one visual frame with a clear next-step statement and primary action. Operational screens end with task state and recovery actions.

---

## 13. Research Record

- Anatomy: one `surface-card` with a metadata header, underline tabs, document region, and neutral evaluation region.
- Internal process, metric, and evaluation groups use ruled rows rather than nested cards.
- One metadata status pill is allowed; research navigation uses an underline state.
- Follow [research-and-technical.md](research-and-technical.md) for typography, evidence language, measurements, and phone density.

---

## 14. Site Footer

The footer provides calm closure at the base of every page.

### Desktop Layout
- Multi-column clean grid:
  - Column 1: Lowercase `multiverse` wordmark, concise product statement, and version note.
  - Column 2: Studio destinations such as Tasks, Runs, Memory, and Skills.
  - Column 3: Product context and documentation (About Multiverse, Research, Privacy, Terms).

### Mobile Layout
- Single-column vertical stack with 24px spacing between sections.
- **Mandatory Safe-Area Clearance**:
  - Because phone viewports feature a fixed bottom tab bar, the footer MUST have bottom padding:
    `padding-bottom: calc(64px + env(safe-area-inset-bottom) + 24px)`
  - This guarantees footer copyright and links are never hidden beneath the tab bar.

---

## 15. Dialog and Phone Sheet

- Desktop and tablet: Centered modal surface, maximum width 520px, `--radius-card`.
- Phone: Bottom sheet sliding from the bottom with `--radius-sheet` (26px 26px 0 0).
- Backdrop: Translucent ink at no more than 28% opacity with soft blur.
- Content: Explain what the product does and how to use it. Do not list fonts, spacing tokens, component geometry, or implementation notes.
- Accessibility: Focus traps inside the modal, Escape key closes, and focus returns to the triggering button.

---

## 16. Iconography

- SVG symbol sprite with `currentColor`.
- Grid: 16px construction grid with 1.5px default stroke and 2px emphasized stroke.
- Geometry: Round caps and joins.
- Strict constraint: Never use emoji or multicolor icons.
