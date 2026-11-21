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
]

// Scrolls the page to a section over 0.7s. We run it ourselves because Safari's own
// smooth scroll crosses the whole page in about 0.2s, which looks like a jump.
function glideTo(el: HTMLElement) {
  const from = scrollY
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop)
  const to = Math.min(from + el.getBoundingClientRect().top - margin, document.documentElement.scrollHeight - innerHeight)
  const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 700
  const start = performance.now()
  let frame = 0
  const step = (now: number) => {
    const t = duration ? Math.min(1, (now - start) / duration) : 1
    const eased = t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t)
    scrollTo({ top: from + (to - from) * eased, behavior: 'instant' })
    if (t < 1) frame = requestAnimationFrame(step)
  }
  // the visitor scrolling by hand takes over
  const stop = () => cancelAnimationFrame(frame)
  addEventListener('wheel', stop, { once: true, passive: true })
  addEventListener('touchstart', stop, { once: true, passive: true })
  frame = requestAnimationFrame(step)
}

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
                  onClick={(event) => {
                    event.preventDefault()
                    menu.current!.open = false
                    fold(id, false)
                    history.pushState(null, '', `#${id}`)
                    // next frame, so a section that was folded has its full height again
                    requestAnimationFrame(() => glideTo(document.getElementById(id)!))
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

      <section className="hero building" aria-labelledby="building-heading">
        <div className="stage">
          <Crane />
        </div>
        <h2 id="building-heading" className="headline">{site.headline}</h2>
        <p className="tagline">{site.tagline}</p>
      </section>
    </main>
  )
}
