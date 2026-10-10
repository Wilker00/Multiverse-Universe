---
name: research-workspace-ui
description: "Design system and component framework blending Notion's document readability with Cognition's high-density research workbench. Purpose-built for research papers, academic synthesis, and deep technical pages."
---

# Research Workspace UI (Notion + Cognition Framework)

Use this skill when building interfaces for **academic papers, literature syntheses, preprint readers, and research workbenches**. It marries the calm, readable document flow of Notion with the clinical precision, dual-pane architecture, and telemetry density of Cognition.

---

## 1. Design Philosophy

### Notion DNA: Calm Document Readability
- **Comfortable Measure**: Reading canvas constrained to `65ch` - `75ch` so long technical text remains effortless to scan.
- **Block-Based Hierarchy**: Clear typographical rhythm between Title, Author Row, Abstract Callout, Section Headings, Blockquotes, and Equations.
- **No Heavy Dividers**: Structure is conveyed through whitespace rhythm (8px base) and subtle hairlines, never thick boxes or colored backgrounds.

### Cognition DNA: High-Density Research Workbench
- **Dual-Pane Architecture**:
  - **Main Canvas**: The primary document / paper reading view.
  - **Auxiliary Inspector**: Right-hand dock for evidence verification, citation trees, claim extraction, and AI analysis.
- **Monospace Telemetry**: Monospace typography (`JetBrains Mono` or system mono) reserved for DOIs, arXiv IDs, coordinates, code, and statistical metrics (p-values, sample sizes, confidence intervals).
- **Clinical Precision**: Neutral zinc/ink palette with zero decorative fluff. Every pixel serves informational clarity.

### Strict Hard Rules
- **No Side Bars or Offset Shadows**: Never use left-edge vertical accent bars or neobrutalist drop shadows on cards, callouts, or panels. All borders must be uniform 1px hairline.
- **Zero Emojis**: Never use emojis anywhere in titles, badges, icons, or status chips. Use 16px monochrome stroke icons.
- **Pure Canvas**: Start on pure white (`#ffffff`) or clinical paper tone; no large cream, dark mode, or pastel fills unless in an explicit user-toggled theme.
- **Accessibility**: Full keyboard navigation through document headings, outline rails, and citation popovers.

---

## 2. Page & Layout Structure

```text
+-----------------------------------------------------------------------------------+
| Top Navigation Bar: Breadcrumb trail / Search papers / View mode / Share          |
+-------------------+-------------------------------------------+-------------------+
| Document Outline  | Main Reading Canvas                       | Evidence Inspector|
| (Sticky Rail)     |                                           | (Cognition Dock)  |
|                   | Paper Title & Metadata                    |                   |
| - Abstract        | Authors & Affiliations                    | Claim Extraction  |
| - Methodology     | Abstract Callout Box                      |                   |
| - Experiments     |                                           | Citation Graph    |
| - Discussion      | Section 1: Introduction                   |                   |
| - References      | Block content, equations, figures         | Key Equations     |
|                   |                                           |                   |
| (Width: ~220px)   | (Max width: ~760px / centered)            | (Width: ~340px)   |
+-------------------+-------------------------------------------+-------------------+
```

---

## 3. Core Component Library

### 3.1 Paper Header & Metadata Row
- **Title**: Serif or clean Grotesk display heading (e.g. 2.2rem - 2.8rem, weight 600, tracking -0.03em).
- **Author Row**: Inline wrap list of author names, superscripts for affiliations, and clickable ORCID/profile links.
- **Telemetry Chips**: Monospace chips displaying:
  - Venue / Conference badge (e.g. `arXiv:2405.12345 [cs.AI]`, `NeurIPS 2025`).
  - Publication date: `YYYY-MM-DD`.
  - Citation count chip: `1,420 citations`.
  - Code/Dataset link chip with GitHub/HuggingFace monochrome icon.

### 3.2 Abstract Callout Box
- Surface card with pure white background, uniform 1px hairline border, and `--radius-card` (12px).
- Internal padding: `16px 20px`.
- Heading: Caption typography (`0.75rem`, uppercase, tracking `0.08em`, weight 600) reading "ABSTRACT".
- Copy: Font size `0.9375rem`, line height 1.6, color `--ink`.
- Strictly no colored left side bar or gradient background.

### 3.3 Outline Rail (Sticky Table of Contents)
- Positioned on the left or top-right.
- Lists H1, H2, and H3 headers with hierarchical indentation (12px per level).
- Active section uses `--ink` text with a subtle 2px active indicator dot. Inactive items use `--muted`.
- Smooth scroll to target sections on click.

### 3.4 Citation & Evidence Cards
- Compact horizontal cards inside the Cognition Inspector dock:
  - Header: Citation key (e.g. `[Vaswani et al., 2017]`) in monospace.
  - Title: Paper title with external link icon.
  - Snippet Quote: 1-2 sentence excerpt showing where the claim was verified.
  - Jump Button: Smoothly scrolls the reading canvas to the exact in-text citation marker.

### 3.5 Math & Equation Blocks
- Centered display math blocks with right-aligned equation numbers `(1)`, `(2)`.
- Background: Transparent or soft `--icon-field` (`#f8f8f6`), padding `16px`, radius `8px`.
- Rendered cleanly with KaTeX/LaTeX syntax.

### 3.6 Figure & Data Panels
- High-resolution figure frame with uniform hairline border.
- Caption below figure: `Figure 1: Title and detailed explanation`, caption typography, muted body text.
- Top-right figure toolbar: Zoom button, Data download button, Code link button.

### 3.7 Collapsible Methodology Toggles (Notion Style)
- Accordion block for detailed mathematical proofs, hyperparameters, or training configurations.
- Toggle trigger: Subtle chevron icon with bold toggle title.
- Expanded body: Indented block with 1px hairline left guide line.

---

## 4. Design Tokens for Research UI

### Color Palette
- Canvas Background: `#ffffff`
- Reading Surface: `#ffffff`
- Secondary Field / Code Box: `#f8f9fa`
- Primary Ink: `#0f172a` (slate-900) or `#11120f`
- Muted Body: `#475569` (slate-600)
- Hairline Border: `#e2e8f0` (uniform 1px on all edges)
- Accent Pill / Tag: `#f1f5f9` background with `#0f172a` text

### Typography Scale
- Paper Title: `2.4rem`, line height 1.15, tracking `-0.035em`
- Section H1: `1.6rem`, line height 1.25, tracking `-0.025em`
- Section H2: `1.25rem`, line height 1.35, tracking `-0.015em`
- Body Reading Text: `1.0rem` (`16px`), line height 1.68, measure `68ch`
- Metadata & Telemetry: `0.78rem` (`12.5px`), font family monospace, tracking `0.02em`

### Radii
- Cards and callouts: `12px`
- Telemetry chips & badges: `6px` or `--radius-pill` (999px)
- Button controls: `8px`
