# Public product pages

## Office hours brief

1. **The core thesis**: Multiverse lets an agent engineer inspect whether reviewed experience helps a later repository task under the same budget.
2. **The desperate user**: An applied-AI engineer who currently reconstructs a prior run from chat logs and cannot tell a stored note from a checked result.
3. **The narrow wedge**: Three public pages — what the product is, how the loop proceeds, and what the evidence contract does not prove — plus an entry into Studio.
4. **Kill list**: No mode-switch theater, no design-system tour, no invented benchmark scores, no second marketing site, and no analytics on these pages.
5. **Success metric**: A visitor can open Studio and find a task, a run, or an evaluation without mistaking the synthetic harness for a capability claim.

## CEO verdict

* **Scope stance**: Scope reduction
* **The verdict**: Approved
* **What we cut**: The static page’s mode switch, guide carousel, and implementation notes. The loop rail lives on its own page so the overview has one job.
* **The single priority**: A first-time reader can see the product and its limits without a capability claim.
* **Green light next step**: React pages at `/`, `/loop`, and `/evidence`, with Studio remaining the working surface.

## Page contract

| Route | Job | Indexing |
| --- | --- | --- |
| `/` | Explain the product and open Studio | Public |
| `/loop` | Show the five stages and what each one keeps | Public |
| `/evidence` | State the comparison, the corpus shape, and the unproven limits | Public |
| `/tasks/new` and other Studio routes | Do the work | `noindex` |

Corpus counts on the evidence page are fixture-set facts: 21 bundled tasks, 8 that may teach a candidate, 13 held out, and one manual approval gate. They are not success rates. The stand-in agent’s scores stay in the Core notes because they do not measure a language model.
