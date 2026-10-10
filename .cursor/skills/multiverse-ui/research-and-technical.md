# Research and technical UI

Use research sections to explain a system clearly, not to imitate an academic paper or analytics dashboard.

Begin with a plain-language summary. Use technical terms only where they add necessary precision, define them on first use, and explain formulas or measurements in everyday language nearby. Follow [language-and-copy.md](language-and-copy.md).

## Structure

- Use one outer research record with four regions: metadata header, underline tabs, document body, and neutral evaluation frame.
- Use internal hairline rules to group process steps, metrics, and evaluation criteria.
- Keep the primary explanation between 45 and 64 characters per line.
- On phone, stack the evaluation frame after the document. Up to three short metrics may share one row.
- Mobile height budget: the default Overview record stays at or below 1,400 CSS pixels at 320px and 1,300 CSS pixels at 390px.
- Do not pair one oversized paper card with a sidebar of repeated cards.

## Typography

- IBM Plex Sans is the interface and reading face.
- IBM Plex Mono is reserved for note IDs, dates, formulas, model or hardware identifiers, measurements, and compact evaluation labels.
- Never set paragraphs, navigation, or long labels in Mono.
- Technical values use tabular spacing and concise units such as `50 ms`, `24 V`, or `MV-R01`.
- A reader must be able to understand the purpose and next implication without reading the formula or technical metadata.

## Evidence language

- Clearly label work as a concept, research note, working direction, prototype, target, or measured result.
- Never invent authors, affiliations, citations, arXiv identifiers, peer-review status, benchmarks, percentages, trial counts, or safety guarantees.
- If a number is not supported by supplied evidence, describe the measure instead of publishing a result.
- Prefer system verbs: plan, ground, verify, measure, recover, and audit.

## Components

- One metadata pill is allowed for status.
- Research tabs use a quiet underline state, not a filled segmented pill.
- Metrics are ruled rows, not separate cards or pills.
- Formulas may use one neutral technical field with `--radius-control`. Split equations into semantic terms that wrap or stack; never require horizontal scrolling at 320px.
- Evaluation criteria use numbered rows without decorative icons or colored tiles.
