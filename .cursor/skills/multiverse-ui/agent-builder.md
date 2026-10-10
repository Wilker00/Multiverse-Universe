# Personal Agent Builder

Use these rules when creating or editing the personal-agent setup workspace.

## Primary Task

- Help one person define an agent and organize the information it may carry forward.
- Keep setup on one page as four compact steps: About, Knowledge, Memory, and Context.
- Present the steps as one ruled ledger. Do not create a long form, a wizard with separate routes, or large setup cards.
- The About step asks only for a name and one clear purpose in the first version.
- Do not imply that adding text creates capability, learning, verification, or a running agent.

## Information Types

- **Knowledge** is stable information that may apply across related work.
- **Memory** is reviewed experience, a correction, or a strategy from previous work. Preserve its source.
- **Context** is the current goal, constraint, or project state and should be easy to replace or expire.
- Keep these types visibly separate. Do not combine them into one unlabeled prompt field.

## Add Interaction

- Make the entire compact step row actionable and end it with a plus icon.
- The plus symbol is a monochrome stroke icon, not a floating action bubble or colored icon tile.
- Open one small focused editor no wider than 430px on desktop and no taller than 72% of the phone viewport.
- The selected row determines the entry type. Do not ask the person to select that type again.
- Ask for a title, one short detail, and an optional source. Avoid long text areas and multi-section dialogs.
- The editor never invents evidence or silently promotes an entry.
- Return focus to the initiating control when the dialog closes.

## Records and Empty States

- Present entries as short previews inside the four-step ledger, not as a dashboard of independent cards.
- Truncate previews rather than allowing one record to make the setup page tall.
- Label mock records as `Example`; do not present them as user data or server state.
- Empty states explain the missing information and provide one direct add action.
- Removal must be explicit. Connected products should add confirmation and provenance-aware deletion before destructive persistence.

## Mascot

- Use one approved pointing or neutral pose to explain the next setup action.
- Keep the complete head, eyes, torso, and gesture visible on an ink stage with clear space.
- Do not use the mascot as an agent avatar or repeat it beside every information type.

## Prototype Boundary

- Browser-local drafts must say that no runtime is connected.
- Do not call mock entries trained knowledge, verified memory, or learned capability.
- A production implementation needs server ownership, access control, provenance, versioning, expiry, and deletion behavior.

## Responsive Behavior

- On phone, stack the introduction, profile fields, ledger groups, and save action in that order.
- Keep the four-item Studio bottom navigation and every add/remove control available at 320px.
- Dialogs become bottom sheets on phone and centered surfaces on wider viewports.
- Never introduce page-level horizontal scrolling.
