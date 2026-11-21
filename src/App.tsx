import { useRef, useState } from 'react'
import { site } from './data/content'
import Crane from './components/Crane'
import Gallery from './components/Gallery'
import InstagramCard from './components/InstagramCard'
import ContactLetter from './components/ContactLetter'
import Section from './components/Section'

// The page's sections, in order. The menu is built from this list too.
const SECTIONS = [
  { id: 'artwork', title: site.artworkHeading, content: <Gallery /> },
  {
    id: 'contact',
    title: site.contactHeading,
    content: (
      <div className="connect">
        <InstagramCard instagram={site.instagram} />
        <ContactLetter letter={site.letter} />
      </div>
    ),
  },
  {
    id: 'building',
    title: site.headline,
    content: (
      <div className="hero">
        <div className="stage">
          <Crane />
        </div>
        <p className="tagline">{site.tagline}</p>
      </div>
    ),
  },
]

export default function App() {
  const menu = useRef<HTMLDetailsElement>(null)
  // ids of the sections folded away on a phone; all start open
  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(new Set())
  const fold = (id: string, folded: boolean) =>
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (folded) next.add(id)
      else next.delete(id)
      return next
    })

  return (
    <main>
      {/* pinned top-left; a tap anywhere outside the open menu closes it (see .menu in index.css) */}
      <details ref={menu} className="menu">
        <summary aria-label="Menu">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </summary>
        <nav>
          <ul>
            {SECTIONS.map(({ id, title }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={() => {
                    menu.current!.open = false
                    fold(id, false)
                  }}
                >
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </details>

      <header className="hero">
        <h1 className="name">{site.name}</h1>
        <p className="byline">{site.byline}</p>
      </header>

      {SECTIONS.map(({ id, title, content }) => (
        <Section key={id} id={id} title={title} collapsed={collapsed.has(id)} onToggle={() => fold(id, !collapsed.has(id))}>
          {content}
        </Section>
      ))}
    </main>
  )
}
