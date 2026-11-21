import { site } from './data/content'
import Crane from './components/Crane'
import Gallery from './components/Gallery'
import InstagramCard from './components/InstagramCard'
import ContactLetter from './components/ContactLetter'

export default function App() {
  return (
    <main>
      <header className="hero">
        <h1 className="name">{site.name}</h1>
        <p className="byline">{site.byline}</p>
      </header>

      <Gallery heading={site.artworkHeading} />

      <section aria-labelledby="contact-heading">
        <h2 id="contact-heading">{site.contactHeading}</h2>
        <div className="connect">
          <InstagramCard instagram={site.instagram} />
          <ContactLetter letter={site.letter} />
        </div>
      </section>

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
