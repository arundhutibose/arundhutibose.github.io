import { useEffect, useRef, useState } from 'react'
import { LOOP_SECONDS, STILL_TIME, sceneAt } from './craneTimeline'
import GalleryArt, { ART_COUNT } from './GalleryArt'
import HighlandCoo from './HighlandCoo'
import backdrop from '../assets/backdrop.jpg'

const WHEEL_RADIUS = 5
const SPARKLE = 'M0 -4 L1 -1 L4 0 L1 1 L0 4 L-1 1 L-4 0 L-1 -1 Z'

export default function Crane() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [painting, setPainting] = useState(0)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const el = (name: string) => svg.querySelector<SVGElement>(`[data-part="${name}"]`)!
    const trolley = el('trolley')
    const cable = el('cable')
    const hook = el('hook')
    const truck = el('truck')
    const wheels = svg.querySelectorAll<SVGElement>('[data-part="wheel"]')
    const pieces = svg.querySelectorAll<SVGElement>('[data-part="piece"]')
    const flag = el('flag')
    const sparkles = el('sparkles')

    function draw(time: number) {
      const s = sceneAt(time)
      trolley.setAttribute('transform', `translate(${s.trolleyX} 0)`)
      cable.setAttribute('x1', `${s.trolleyX}`)
      cable.setAttribute('x2', `${s.trolleyX}`)
      cable.setAttribute('y2', `${s.hookY - 4}`)
      hook.setAttribute('transform', `translate(${s.trolleyX} ${s.hookY})`)
      truck.setAttribute('transform', `translate(${s.truckX} 0)`)
      const spin = (s.truckX / WHEEL_RADIUS) * (180 / Math.PI)
      wheels.forEach((w) => w.setAttribute('transform', `rotate(${spin})`))
      s.pieces.forEach((p, i) => {
        pieces[i].setAttribute('transform', `translate(${p.x} ${p.y})`)
        pieces[i].setAttribute('opacity', p.visible ? '1' : '0')
      })
      flag.setAttribute('transform', `translate(${s.flag.x} ${s.flag.y}) scale(1 ${s.flag.scale})`)
      sparkles.setAttribute('transform', `translate(${s.flag.x} ${s.flag.y})`)
      sparkles.setAttribute('opacity', `${s.sparkle}`)
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      draw(STILL_TIME)
      return
    }

    let frame = 0
    let loop = 0
    const start = performance.now()
    const tick = (now: number) => {
      const time = (now - start) / 1000
      const currentLoop = Math.floor(time / LOOP_SECONDS)
      if (currentLoop !== loop) {
        loop = currentLoop
        setPainting(currentLoop % ART_COUNT)
      }
      draw(time)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <svg ref={svgRef} className="crane" viewBox="0 0 400 220" role="img" aria-label="A crane building a tiny art gallery, piece by piece">
      {/* backdrop: her moonlit mountains painting, softened so the machines stay readable */}
      <image href={backdrop} width="400" height="210" preserveAspectRatio="xMidYMin slice" />
      <rect width="400" height="210" className="veil" />
      <rect y="210" width="400" height="10" className="earth" />

      {/* excavator, digging on its own rhythm */}
      <g className="excavator">
        <path d="M148 210 q12 -13 26 0 z" className="dirt mound" />
        <circle cx="158" cy="186" r="3" className="dirt falling" />
        <rect x="100" y="203" width="34" height="7" rx="3.5" className="tread" />
        <g className="digger-body">
          <rect x="106" y="188" width="22" height="15" rx="2" className="machine" />
          <rect x="118" y="191" width="8" height="7" rx="1" className="glass" />
          <g className="boom">
            <path d="M126 192 L146 178 L158 192" className="arm" />
            <g className="bucket">
              <circle cx="158" cy="196" r="3" className="dirt scoop" />
              <path d="M153 191 h10 l-1 8 q-4 3 -8 0 z" className="machine" />
            </g>
          </g>
        </g>
      </g>

      <HighlandCoo />

      {/* cones */}
      <path d="M256 210 l3 -9 l3 9 z M266 210 l3 -9 l3 9 z" className="cone" />

      {/* tower crane */}
      <rect x="60" y="45" width="16" height="165" className="steel-outline" />
      <polyline points="60,210 76,190 60,170 76,150 60,130 76,110 60,90 76,70 60,50" className="lattice" />
      <rect x="20" y="38" width="368" height="8" className="steel" />
      <rect x="22" y="46" width="24" height="16" className="weight" />
      <line x1="68" y1="10" x2="20" y2="38" className="tie" />
      <line x1="68" y1="10" x2="380" y2="38" className="tie" />
      <rect x="64" y="10" width="8" height="28" className="steel" />
      <circle cx="68" cy="8" r="3" className="beacon" />
      <rect x="76" y="46" width="18" height="14" rx="2" className="cab" />

      {/* delivery truck */}
      <g data-part="truck">
        <rect x="-32" y="196" width="66" height="5" className="machine" />
        <rect x="-52" y="182" width="18" height="19" rx="2" className="machine" />
        <rect x="-49" y="185" width="9" height="7" rx="1" className="glass" />
        {[-42, 20].map((x) => (
          <g key={x} transform={`translate(${x} 205)`}>
            <g data-part="wheel">
              <circle r={WHEEL_RADIUS} className="tyre" />
              <path d="M-3 0 H3 M0 -3 V3" className="spoke" />
            </g>
          </g>
        ))}
      </g>

      {/* the three pieces of the gallery; origin is each piece's top centre */}
      <g data-part="piece">
        <rect x="-30" width="60" height="22" className="wall" />
        <rect x="-5" y="6" width="10" height="16" rx="1" className="door" />
      </g>
      <g data-part="piece">
        <rect x="-30" width="60" height="46" className="wall" />
        <GalleryArt variant={painting} />
      </g>
      <g data-part="piece">
        <path d="M-35 18 L0 0 L35 18 Z" className="roof" />
      </g>
      <g data-part="flag">
        <path d="M0 0 V-14" className="pole" />
        <path d="M0 -14 L10 -11 L0 -8 Z" className="pennant" />
      </g>
      <g data-part="sparkles" opacity="0">
        <path d={SPARKLE} transform="translate(-40 -2)" className="sparkle" />
        <path d={SPARKLE} transform="translate(30 -14) scale(1.3)" className="sparkle" />
        <path d={SPARKLE} transform="translate(44 16) scale(.8)" className="sparkle" />
        <path d={SPARKLE} transform="translate(-46 26) scale(.9)" className="sparkle" />
      </g>

      {/* trolley, cable and hook, drawn last so they sit in front */}
      <line data-part="cable" x1="0" y1="52" x2="0" y2="60" className="cable" />
      <g data-part="trolley">
        <rect x="-8" y="46" width="16" height="6" className="steel" />
      </g>
      <g data-part="hook">
        <path d="M0 -4 V0 M-4 0 H4" className="hook" />
      </g>
    </svg>
  )
}
