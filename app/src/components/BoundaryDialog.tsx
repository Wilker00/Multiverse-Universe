import { useEffect, useRef } from 'react'
import { Icon } from './Icon'

const facts = [
  ['Product', 'A workspace for a checked agent task and reviewed memory.'],
  ['Core', 'Runs bundled fixtures and can inspect one pinned public repository.'],
  ['Verification', 'A fixture run is verified only when the visible checks and the hidden checks both pass.'],
  ['Memory', 'Stored text is not learning until a later checked task shows a difference.'],
  ['Repositories', 'A public test suite can pass without counting as hidden verification.'],
  ['Demand', 'Repeated customer use and willingness to pay have not been observed.']
]

export function BoundaryDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (open && !node.open) node.showModal()
    if (!open && node.open) node.close()
  }, [open])

  return <dialog
    ref={ref}
    className="pub-dialog"
    aria-labelledby="boundary-title"
    onCancel={event => {
      event.preventDefault()
      onClose()
    }}
  >
    <div className="pub-dialog-head">
      <div>
        <p className="eyebrow">Product boundary</p>
        <h2 id="boundary-title">What Multiverse can prove today</h2>
      </div>
      <button className="pub-icon-button" type="button" aria-label="Close product boundary" onClick={onClose}>
        <Icon name="close" />
      </button>
    </div>
    <ul className="pub-dialog-list">
      {facts.map(([label, statement]) => <li key={label}><span>{label}</span><strong>{statement}</strong></li>)}
    </ul>
    <button className="button primary" type="button" onClick={onClose}>Done</button>
  </dialog>
}
