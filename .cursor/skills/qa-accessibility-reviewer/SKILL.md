---
name: qa-accessibility-reviewer
description: "Staff QA Engineer and Accessibility Lead. Conducts pre-release testing for regressions, responsive reflow (320px+), touch targets (44px+), keyboard accessibility, focus trapping, reduced motion compliance, and asset integrity."
---

# QA and Accessibility Reviewer

Use this skill to rigorously test and audit code changes before declaring any feature complete. This skill acts as the final quality gate to ensure zero regressions, full accessibility compliance, and flawless cross-device performance.

---

## 1. Core Testing Checklists

Every feature or UI update must pass these five verification gates:

### Gate 1: Responsive and Reflow Integrity
- [ ] **320px Viewport Check**: At 320 CSS pixels wide, content reflows vertically without introducing a horizontal page-level scrollbar.
- [ ] **Touch Target Standards**: Every interactive element (buttons, cards, links, segmented switches) has a minimum touch target size of 44px by 44px on mobile viewports.
- [ ] **Breakpoint Transitions**: Fluid adaptations between mobile (<768px), tablet (768px-1023px), and desktop (>=1024px) without overlapping text or broken grids.

### Gate 2: Accessibility (A11y) and Keyboard Navigation
- [ ] **Keyboard Tab Order**: Logical focus flow through all interactive controls.
- [ ] **Modal Focus Trap**: Opening the Guide Dialog traps focus inside the modal; pressing Escape closes it; closing returns focus to the triggering element.
- [ ] **ARIA Attributes**: Segmented mode buttons have `aria-pressed="true|false"`; dialogs use semantic `<dialog>` or `role="dialog"`; state changes use `aria-live="polite"`.
- [ ] **Color Contrast**: Text meets WCAG AA standards (minimum 4.5:1 ratio against background). Tone-adaptive cards use `--ink` on light fields and `--on-ink` on dark fields.

### Gate 3: Motion and Reduced-Motion Verification
- [ ] **Prefers-Reduced-Motion**: When `prefers-reduced-motion: reduce` is active, all transitions, keyframe animations, and smooth scrolls collapse immediately to the final static state.
- [ ] **No Uncontrolled Loops**: Mascot animations and decorative movements never loop indefinitely. Pose changes are strictly user-triggered or execute once.

### Gate 4: Asset and Network Integrity
- [ ] **Zero Remote Font Requests**: Verified that fonts load exclusively from local `public/fonts/` (IBM Plex Sans and IBM Plex Mono).
- [ ] **Zero Missing Assets**: All images (`public/media/`) and mascot SVGs (`public/mascot/`) exist on disk and resolve without 404 errors.
- [ ] **Zero Emojis**: Verified that no emoji characters exist in labels, icons, notifications, or empty states.

### Gate 5: Anti-Slop Code Quality
- [ ] **Clean Console**: Zero runtime errors, uncaught promise rejections, or leftover debugging `console.log` statements.
- [ ] **Build Validation**: React/TypeScript products pass `tsc --noEmit` and their bundler. Static prototypes pass HTML/CSS structural checks, JavaScript syntax checks, local HTTP loading, and asset-path validation.
- [ ] **All-View Sweep**: Visit every primary destination and rendered state at 320px and desktop width; checking only the default page is insufficient.
- [ ] **No Side Bars or Offset Shadows**: All cards, surfaces, and panels use uniform 1px hairline borders without vertical accent side bars or neobrutalist offset drop shadows.

---

## 2. Output Format: QA Audit Report

When conducting a QA review, produce this structured report:

```markdown
### QA Audit: [Feature / Component Name]
* **Responsive Reflow (320px - 1440px)**: [Pass | Fail - details]
* **Accessibility and Focus**: [Pass | Fail - details]
* **Touch Targets (>=44px)**: [Pass | Fail - details]
* **Motion & Reduced Motion**: [Pass | Fail - details]
* **Asset & Font Integrity**: [Pass | Fail - details]
* **Identified Defects**: [Numbered list of issues to fix before shipping, or "None"]
* **QA Status**: [Approved to Ship | Changes Required]
```
