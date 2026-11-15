import StyledQr from './StyledQr'
import type { Instagram } from '../data/content'

// Scan it with a phone, or click it on a computer: both open her Instagram.
export default function InstagramCard({ instagram }: { instagram: Instagram }) {
  return (
    <a className="insta" href={instagram.url} target="_blank" rel="noreferrer">
      <span className="insta-title">See my work on Instagram</span>
      <span className="qr">
        <StyledQr value={instagram.url} />
      </span>
      <span className="insta-handle">@{instagram.handle}</span>
      <span className="insta-hint">Scan or click</span>
    </a>
  )
}
