---
name: plan-ceo-review
description: "Founder-mode strategic product review based on Garry Tan's gstack framework. Evaluates architecture and feature plans for 10x ambition, scope discipline, anti-slop standards, and alignment with the startup's core vision."
---

# Plan CEO Review (Founder Mode Review)

Use this skill after an initial plan or architecture has been proposed, but **before implementation starts**. The CEO reviewer evaluates whether the proposed work actually moves the needle or is merely busywork / "AI slop".

---

## The 4 Scope Modes

When conducting a CEO review, the agent must categorize the proposal into one of four scope stances:

1. **Scope Reduction (The Razor)**:
   * *When to use*: Default stance for MVPs.
   * *Action*: Cut 50% of the planned sub-features. Remove extra settings, secondary tabs, custom themes, and premature configuration options. Focus entirely on the primary happy path.

2. **Hold Scope (Execution Focus)**:
   * *When to use*: The plan is already lean and well-targeted.
   * *Action*: Approve implementation without adding or removing tasks. Enforce strict acceptance criteria.

3. **Selective Expansion (The Differentiator)**:
   * *When to use*: The proposed feature works, but lacks the "magic" or polish that makes users fall in love with the product.
   * *Action*: Enhance the core signature interaction (e.g. In Multiverse: make the mascot guide response snappier, add refined tactile transitions).

4. **10x Expansion (Ambitious Pivot)**:
   * *When to use*: The idea is too timid or replicates an existing commodity tool without an unfair advantage.
   * *Action*: Challenge the founder: "What would this look like if it were 10x more effortless?"

---

## The "Anti-Slop" Review Checklist

Every plan must pass these quality gates:

- [ ] **No Generic UI Templates**: Does this look and feel like Multiverse (quiet ink controls, light canvas, Manrope typography), or does it look like generic Tailwind/Bootstrap boilerplate?
- [ ] **No Artificial Friction**: Does the user have to click 5 times when 1 click or keyboard shortcut would do?
- [ ] **Ruthless Simplicity**: Can a first-time visitor understand the screen within 5 seconds without reading documentation?
- [ ] **Zero Technical Debt on Primitives**: Are mobile viewports (320px), reduced motion, and touch targets respected?

---

## Output Format: CEO Verdict

Produce a structured verdict:

```markdown
### CEO Review: [Feature/Plan Name]
* **Scope Stance**: [Scope Reduction | Hold Scope | Selective Expansion | 10x Expansion]
* **The Verdict**: [Approved | Needs Revision | Killed]
* **What We Cut**: [List of removed items to protect speed]
* **The Single Priority**: [The one thing that must be flawless]
* **Green Light Next Step**: [Immediate technical action to start building]
```
