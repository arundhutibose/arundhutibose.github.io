import { useState, type FormEvent } from 'react'
import type { Letter } from '../data/content'

// writing -> sending (network) -> posting (envelope animation) -> sent
type Status = 'writing' | 'sending' | 'posting' | 'sent' | 'failed'

// A contact form dressed as a letter. Send posts it to the email-forwarding
// endpoint; if that fails, the visitor can open it in their own email app.
export default function ContactLetter({ letter }: { letter: Letter }) {
  const [subject, setSubject] = useState(letter.subject)
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [honey, setHoney] = useState('') // hidden field; only bots fill it
  const [status, setStatus] = useState<Status>('writing')

  const body = [letter.greeting, '', message, '', letter.signOff, name].join('\n')
  const mailto = `mailto:${letter.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const response = await fetch(letter.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, message: body, _subject: subject, _honey: honey }),
      })
      if (!response.ok) return setStatus('failed')
      const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      setStatus(calm ? 'sent' : 'posting')
    } catch {
      setStatus('failed')
    }
  }

  // Fresh sheet of paper; name and email are kept so they needn't be retyped.
  function writeAnother() {
    setSubject(letter.subject)
    setMessage('')
    setStatus('writing')
  }

  if (status === 'sent') {
    return (
      <div className="letter letter-sent" role="status">
        <div className="stamp" aria-hidden="true" />
        <strong>Your letter is on its way.</strong>
        Thank you, {name}. I'll write back soon.
        <button type="button" className="letter-again" onClick={writeAnother}>
          Write another letter
        </button>
      </div>
    )
  }

  return (
    <div
      className={`post ${status}`}
      onAnimationEnd={(e) => e.animationName === 'fly' && setStatus('sent')}
    >
    <form className="letter" onSubmit={handleSubmit}>
      <div className="stamp" aria-hidden="true" />
      <p className="letter-row">
        <span className="letter-key">To</span>
        <span>{letter.recipient}</span>
      </p>
      <label className="letter-row">
        <span className="letter-key">Subject</span>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} required />
      </label>

      <p className="letter-greeting">{letter.greeting}</p>
      <textarea
        aria-label="Your message"
        placeholder="Write your message here…"
        rows={6}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />

      <p className="letter-signoff">{letter.signOff}</p>
      <input
        className="letter-name"
        aria-label="Your name"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        className="letter-honey"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={honey}
        onChange={(e) => setHoney(e.target.value)}
      />
      <div className="letter-foot">
        <input
          type="email"
          aria-label="Your email, so I can write back"
          placeholder="Your email, so I can write back"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send letter'}
        </button>
      </div>
      {status === 'failed' && (
        <p className="letter-status" role="alert">
          That didn't send. <a href={mailto}>Open it in your email app instead</a>.
        </p>
      )}
    </form>
      {status === 'posting' && (
        <>
          <div className="env env-back" />
          <div className="env env-flap" />
          <div className="env env-front" />
          <div className="env-seal" />
        </>
      )}
    </div>
  )
}
