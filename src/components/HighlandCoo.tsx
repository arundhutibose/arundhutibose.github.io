import { useEffect, useState } from 'react'

// Easter egg: a tiny highland coo grazing beside the build. Click it and it says hi.
export default function HighlandCoo() {
  const [greeting, setGreeting] = useState(false)

  useEffect(() => {
    if (!greeting) return
    const timer = setTimeout(() => setGreeting(false), 2200)
    return () => clearTimeout(timer)
  }, [greeting])

  return (
    <g className="coo" onClick={() => setGreeting(true)}>
      <title>Highland coo</title>
      <path d="M24 198 q-4 2 -3 7" className="coo-tail" />
      <path d="M27 203 V210 M31 203 V210 M38 203 V210 M42 203 V210" className="coo-legs" />
      <rect x="23" y="194" width="21" height="11" rx="5.5" className="coo-body" />
      <path d="M47 210 l-1 -6 M50 210 l0 -7 M53 210 l1.5 -6 M56 210 l1 -5" className="coo-grass" />
      {/* the head bends down to graze, munches, and comes back up */}
      <g className="coo-head">
        <path d="M42 192 q-4 -2 -4 -6 M50 192 q4 -2 4 -6" className="coo-horns" />
        <circle cx="46" cy="196" r="5.2" className="coo-body" />
        <path d="M40.8 194.5 q5.2 5.5 10.4 0 q-1 -4.5 -5.2 -4.5 q-4.2 0 -5.2 4.5" className="coo-fringe" />
        <ellipse cx="46" cy="199.6" rx="2.6" ry="1.8" className="coo-snout" />
      </g>
      {greeting && (
        <g className="coo-bubble">
          <rect x="12" y="166" width="46" height="14" rx="7" />
          <path d="M38 180 l3 5 l3 -5 z" />
          <text x="35" y="175.5" textAnchor="middle">Heeeeeyyy</text>
        </g>
      )}
    </g>
  )
}
