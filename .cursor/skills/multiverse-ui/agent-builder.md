# Personal Agent Builder

Use these rules when creating or editing the personal-agent setup workspace.

## Primary Task

- Help one person define an agent and organize the information it may carry forward.
- Keep the sequence explicit: define the agent, add knowledge or experience, review the foundation, then save a draft.
- Do not imply that adding text creates capability, learning, verification, or a running agent.

## Information Types

- **Knowledge** is stable information that may apply across related work.
- **Memory** is reviewed experience, a correction, or a strategy from previous work. Preserve its source.
- **Context** is the current goal, constraint, or project state and should be easy to replace or expire.
- Keep these types visibly separate. Do not combine them into one unlabeled prompt field.

## Add Interaction

- Use one clear `Add knowledge` action and compact plus controls for each information type.
- The plus symbol is a monochrome stroke icon with a 44px touch target, not a floating action bubble or colored icon tile.
- The add sheet asks for type, title, content, and source. It never invents evidence or silently promotes an entry.
- Return focus to the initiating control when the dialog closes.

## Records and Empty States

- Present entries as ruled rows inside one ledger, not as a dashboard of independent cards.
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
