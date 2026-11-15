import { site } from './data/content'
import Crane from './components/Crane'
import InstagramCard from './components/InstagramCard'
import ContactLetter from './components/ContactLetter'

export default function App() {
  return (
    <main>
      <header className="hero">
        <p className="name">{site.name}</p>
        <p className="byline">{site.byline}</p>
        <div className="stage">
          <Crane />
        </div>
        <h1>{site.headline}</h1>
        <p className="tagline">{site.tagline}</p>
      </header>

      <section className="connect">
        <InstagramCard instagram={site.instagram} />
        <ContactLetter letter={site.letter} />
      </section>
    </main>
  )
}
