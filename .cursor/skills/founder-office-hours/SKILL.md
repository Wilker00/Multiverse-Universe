---
name: founder-office-hours
description: "Simulates a YC partner office hours session based on Garry Tan's gstack framework. Uses six forcing questions to pressure-test startup ideas, validate demand, find the narrowest wedge, and prevent premature coding. Use when brainstorming, prioritizing features, or defining the MVP."
---

# Founder Office Hours (YC / Garry Tan Framework)

Use this skill **before writing any code**. It acts as an adversarial, high-rigor discovery partner to ensure you are building something people actually want, cutting non-essential features, and defining the sharpest possible wedge.

---

## The 6 Forcing Questions

When this skill is invoked, evaluate the product or proposed feature against these six questions:

### 1. Demand Reality
* *Is there real demand, or is this a solution searching for a problem?*
* How do we know people care? What proof or user friction shows that this is an urgent problem rather than a nice-to-have?

### 2. Status Quo
* *What are users doing right now to solve this?*
* If they are using messy Notion docs, Google Slides, scrap paper, or nothing at all, why? What is the switching cost?

### 3. Desperate Specificity
* *Who specifically has this acute pain today?*
* Avoid vague categories like "all creators" or "everyone who writes". Define the exact persona who feels this pain daily (e.g., solo video directors drafting visual treatments, technical founders outlining product releases).

### 4. Narrowest Wedge
* *What is the smallest, simplest version that delivers 80% of the value?*
* What can we cut? If we had only 48 hours to launch, what single flow MUST work?

### 5. Unique Observation / Unfair Insight
* *What non-obvious truth do you know that others are missing?*
* Why is every other tool failing? (e.g., "Existing whiteboard tools are loud, infinite canvases that cause decision paralysis; Multiverse enforces calm, sequential focus").

### 6. Future-Fit
* *Is this where the world is going in 2-3 years?*
* How will AI generation, multi-modal workflows, and solo creators shape this space?

---

## Operating Modes

### Mode A: Startup Mode (Validation & Wedge)
* **Goal**: Find product-market fit and eliminate feature creep.
* **Outcome**: A 1-page Design & Validation Document answering the 6 questions.

### Mode B: Feature Pressure-Test (Pre-Code Gate)
* **Goal**: Validate an individual feature before adding it to the roadmap.
* **Rule**: If a feature does not directly serve the core wedge, reject it or move it to Phase 4.

---

## Output Format: Office Hours Brief

At the end of an Office Hours session, generate or update a brief in `docs/product/` with this structure:

1. **The Core Thesis**: One sentence describing the product and who it's for.
2. **The Desperate User**: Specific persona and current painful workaround.
3. **The Narrow Wedge (MVP)**: The 1-3 features that must exist; everything else cut.
4. **Kill List**: Features explicitly rejected to protect focus.
5. **Success Metric**: One tangible action indicating user retention.
