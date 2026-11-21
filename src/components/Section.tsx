import { useSyncExternalStore, type ReactNode } from 'react'

// The same breakpoint as the phone block in index.css.
const phone = window.matchMedia('(max-width: 640px)')
const subscribe = (onChange: () => void) => {
  phone.addEventListener('change', onChange)
  return () => phone.removeEventListener('change', onChange)
}

// A page section with its heading. On phones the heading is a button that folds
// the section away; on wider screens every section is always shown.
export default function Section({ id, title, collapsed, onToggle, children }: {
  id: string
  title: string
  collapsed: boolean
  onToggle: () => void
  children: ReactNode
}) {
  const isPhone = useSyncExternalStore(subscribe, () => phone.matches)

  return (
    <section id={id} aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`}>
        {isPhone ? (
          <button type="button" aria-expanded={!collapsed} aria-controls={`${id}-body`} onClick={onToggle}>
            {title}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : (
          title
        )}
      </h2>
      <div id={`${id}-body`} hidden={isPhone && collapsed}>
        {children}
      </div>
    </section>
  )
}
