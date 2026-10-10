# Research Workspace Components (Notion + Cognition)

This specification defines the components for academic paper readers, literature syntheses, and research workbenches.

---

## 1. Dual-Pane Workbench Shell

The outer container organizing the document reader alongside the intelligent inspector.

### Layout Specs
- Outer Container: Full-height viewport flex container (`100vh`, `overflow: hidden`).
- Top Bar: Fixed 48px header containing breadcrumbs, paper title snippet, view mode switch (Reader | Dual View | Inspector), and action buttons (PDF Export, Share).
- Split View Grid:
  - Left Rail (Outline): Width `220px` - `260px`, collapsible on small screens.
  - Center Canvas (Reading View): Flex-1, max-width `820px`, centered, padding `40px 32px`, overflow-y scroll.
  - Right Dock (Cognition Inspector): Width `340px` - `380px`, border-left 1px `--hairline`, collapsible.

---

## 2. Paper Header and Metadata

### Paper Title
- Display title rendered in clean Grotesk or serif typography (`2.2rem` to `2.6rem`, weight 600).
- Margin bottom: 16px.

### Author Row
- Multi-line wrap container displaying author names in weight 500 (`0.95rem`).
- Superscript numbers indicating academic affiliations (`¹`, `²`, `³`).
- Clickable author card popover showing institution, ORCID ID, and recent publications.

### Affiliations List
- Font size: `0.8125rem`, color `--muted`, margin-bottom: 20px.

### Telemetry Badge Bar
- Horizontal flex row displaying structured metadata:
  - Venue Badge: Monospace text, e.g. `arXiv:2403.01234 [cs.LG]`, background `--icon-field`, padding `4px 10px`, radius `6px`.
  - Date Badge: `Published Mar 14, 2025`.
  - Citation Chip: `482 Citations`, weight 600.
  - Artifact Links: Direct buttons for `Code (GitHub)`, `Dataset (HuggingFace)`, `PDF`.

---

## 3. Abstract Callout Box

- Purpose: Immediate summary of the paper's thesis and methodology.
- Container: Surface card, pure white background, uniform 1px `--hairline` border on all four sides.
- Radius: `12px`.
- Padding: `18px 22px`.
- Strict Prohibition: Never use a colored vertical left border, side bar, or neobrutalist drop shadow.
- Header: Text "ABSTRACT" in uppercase caption typography (`0.75rem`, letter-spacing `0.08em`, color `--muted`).
- Text: Font size `0.9375rem`, line height 1.62, color `--ink`.

---

## 4. Document Outline Rail (Table of Contents)

- Sticky or docked navigation on the left side of the reading canvas.
- Hierarchical list displaying:
  - Section 1: Introduction
  - Section 2: Related Work
  - Section 3: Methodology (with indented subsections: 3.1 Architecture, 3.2 Training)
  - Section 4: Experimental Evaluation
  - Section 5: Discussion & Limitations
  - Section 6: References
- Interaction: Clicking any heading smoothly scrolls the reading canvas to that section.
- Active Highlight: Active section text darkens to `--ink` with a subtle 2px dot indicator.

---

## 5. Cognition Evidence Inspector (Right Dock)

The auxiliary dock delivering deep research intelligence and verification.

### Inspector Tabs
- Tab 1: **Claims & Evidence** (Extracted core assertions with verification confidence).
- Tab 2: **Citation Graph** (Interactive list of influential prior work and downstream papers).
- Tab 3: **Equations & Proofs** (Index of mathematical formulas defined in the text).
- Tab 4: **AI Chat & Synthesis** (Context-aware querying strictly bounded by the paper text).

### Evidence Card
- Compact surface card within the inspector dock.
- Header: Monospace claim reference tag (e.g. `CLAIM-03: Latency Reduction`).
- Excerpt: 1-2 sentence verbatim excerpt from the paper.
- Verification Status: Clean badge (`Verified in Table 2` or `Empirical benchmark`).
- Action: "Jump to proof in text" link with arrow stroke icon.

---

## 6. Citation Popover & References

### In-Text Citation Marker
- Inline pill link: `[Vaswani et al., 2017]` or numeric `[1]`.
- Style: Monospace or semi-bold, color `--ink`, hover adds subtle `--icon-field` background.

### Citation Popover
- Triggered on click or hover.
- Card dimensions: Max width 360px, padding 14px 16px, radius `10px`, uniform hairline border.
- Displays: Full paper title, authors, journal/conference, year, DOI link, and an abstract preview snippet.

---

## 7. Mathematical Equations & Code Blocks

### Display Math Block
- KaTeX/LaTeX display rendering centered horizontally.
- Background: Soft neutral background (`#f8f8f6`), padding `16px 20px`, radius `8px`.
- Equation Number: Right-aligned label `(1)` in monospace typography.

### Code / Algorithm Block
- Container: Surface block with `--radius-card` (10px), uniform 1px hairline border.
- Header bar: Language tag (e.g. `Python / PyTorch`), copy-code button, monospace caption.
- Code Body: `JetBrains Mono` or system monospace, font size `0.85rem`, line height 1.5.

---

## 8. Figure and Table Frames

- High-resolution visual representation of charts, architecture diagrams, and ablation tables.
- Frame: White background with uniform 1px `--hairline` border, radius `12px`, overflow hidden.
- Top Utility Bar: Zoom trigger, Download SVG/PNG, Copy citation.
- Caption Below: Caption typography prefix (`Figure 1:`) followed by complete descriptive text.

---

## 9. Collapsible Toggles (Notion Style)

- Accordion disclosure element for verbose derivations, proofs, or experimental setup details.
- Header: 16px chevron icon + bold summary label.
- Expanded Content: Indented block with 1px hairline guide line on the left.
- Animation: Snappy, quiet accordion height expansion (180ms cubic-bezier).
