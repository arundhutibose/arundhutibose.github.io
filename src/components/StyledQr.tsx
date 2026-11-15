import QRCode from 'qrcode'

const MARGIN = 2
const FINDER = 7 // the three big corner squares are 7x7 modules

// A QR code with round dots, soft corners, sunset ink and a highland coo in
// the middle. Error correction is set to "high" so the coo doesn't break scans.
export default function StyledQr({ value }: { value: string }) {
  const { size, data } = QRCode.create(value, { errorCorrectionLevel: 'H' }).modules
  const centre = size / 2
  const hole = size * 0.17
  const corners = [
    [0, 0],
    [size - FINDER, 0],
    [0, size - FINDER],
  ]
  const inCorner = (x: number, y: number) =>
    corners.some(([cx, cy]) => x >= cx && x < cx + FINDER && y >= cy && y < cy + FINDER)
  const inHole = (x: number, y: number) => Math.hypot(x + 0.5 - centre, y + 0.5 - centre) < hole

  const dots = []
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (data[y * size + x] && !inCorner(x, y) && !inHole(x, y)) {
        dots.push(<circle key={`${x}-${y}`} cx={x + 0.5} cy={y + 0.5} r={0.46} />)
      }
    }
  }

  const full = size + MARGIN * 2
  return (
    <svg viewBox={`${-MARGIN} ${-MARGIN} ${full} ${full}`} role="img" aria-label="QR code">
      <defs>
        <linearGradient id="qr-ink" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={size} y2={size}>
          <stop offset="0" stopColor="#4b3f8f" />
          <stop offset="0.55" stopColor="#c23b57" />
          <stop offset="1" stopColor="#b8541f" />
        </linearGradient>
      </defs>
      <rect x={-MARGIN} y={-MARGIN} width={full} height={full} rx="2.5" fill="#fff" />
      <g fill="url(#qr-ink)">{dots}</g>
      {corners.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x + 0.5} y={y + 0.5} width="6" height="6" rx="2" fill="none" stroke="url(#qr-ink)" strokeWidth="1" />
          <rect x={x + 2} y={y + 2} width="3" height="3" rx="1" fill="url(#qr-ink)" />
        </g>
      ))}

      {/* highland coo */}
      <g transform={`translate(${centre} ${centre}) scale(${hole / 9})`}>
        <path d="M-5 -3 q-5 -1 -5 -5 M5 -3 q5 -1 5 -5" fill="none" stroke="#c9a877" strokeWidth="1.8" strokeLinecap="round" />
        <ellipse cx="0" cy="1" rx="6.5" ry="7" fill="#b9692c" />
        <path d="M-6.5 -2 q6.5 7 13 0 q-1 -5 -6.5 -5 q-5.5 0 -6.5 5" fill="#d98b45" />
        <ellipse cx="0" cy="5.5" rx="3" ry="2" fill="#f1cfa6" />
      </g>
    </svg>
  )
}
