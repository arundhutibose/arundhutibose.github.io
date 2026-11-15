// The construction story, as a pure function of time. One loop:
//   3x  truck delivers a piece -> crane lifts it -> carries it -> places it
//   then a flag goes up, the truck returns, and the crane loads the finished
//   gallery onto it. The truck drives it away and the next build starts.

type Key = [time: number, value: number]

const ease = (p: number) => (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2)

function track(keys: Key[], t: number): number {
  if (t <= keys[0][0]) return keys[0][1]
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1] = keys[i]
    if (t <= t1) {
      const [t0, v0] = keys[i - 1]
      return t1 === t0 ? v1 : v0 + (v1 - v0) * ease((t - t0) / (t1 - t0))
    }
  }
  return keys[keys.length - 1][1]
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

// Layout (SVG units)
const PICKUP_X = 330 // where the truck parks
const BUILD_X = 215 // where the gallery is built
const OFFSCREEN_X = 480
const HOOK_HIGH = 70
const BED_Y = 196 // truck bed surface

// Each piece: its height, and the y of its top once placed.
export const PIECES = [
  { height: 22, placedY: 188 }, // ground floor
  { height: 46, placedY: 142 }, // upper floor: mostly one big artwork
  { height: 18, placedY: 124 }, // roof
]
const ROOF_Y = 124
const BUILDING_HEIGHT = 86
const STEP = 6 // seconds per piece
const LOAD_START = 20.5 // truck comes back for the finished gallery
export const LOOP_SECONDS = 27.6

const trolleyKeys: Key[] = [[0, PICKUP_X]]
const hookKeys: Key[] = [[0, HOOK_HIGH]]
const truckKeys: Key[] = []

PIECES.forEach((piece, i) => {
  const t = i * STEP
  const pickY = BED_Y - piece.height
  truckKeys.push([t, OFFSCREEN_X], [t + 1.2, PICKUP_X], [t + 2.4, PICKUP_X], [t + 3.6, OFFSCREEN_X])
  hookKeys.push(
    [t + 1.2, HOOK_HIGH], [t + 2.0, pickY], [t + 2.1, pickY], [t + 2.8, HOOK_HIGH],
    [t + 4.2, HOOK_HIGH], [t + 5.0, piece.placedY], [t + 5.2, piece.placedY], [t + 5.8, HOOK_HIGH],
  )
  trolleyKeys.push([t + 2.8, PICKUP_X], [t + 4.2, BUILD_X])
  if (i < PIECES.length - 1) trolleyKeys.push([t + 5.4, BUILD_X], [t + 6.8, PICKUP_X])
})

const L = LOAD_START
const loadedY = BED_Y - BUILDING_HEIGHT
truckKeys.push([L, OFFSCREEN_X], [L + 1.2, PICKUP_X], [L + 5.1, PICKUP_X], [L + 6.7, OFFSCREEN_X])
hookKeys.push(
  [L + 0.5, HOOK_HIGH], [L + 1.3, ROOF_Y], [L + 1.5, ROOF_Y], [L + 2.3, HOOK_HIGH],
  [L + 3.7, HOOK_HIGH], [L + 4.5, loadedY], [L + 4.7, loadedY], [L + 5.3, HOOK_HIGH],
)
trolleyKeys.push([L + 2.3, BUILD_X], [L + 3.7, PICKUP_X])

export type Scene = {
  trolleyX: number
  hookY: number
  truckX: number
  pieces: { x: number; y: number; visible: boolean }[]
  flag: { x: number; y: number; scale: number }
  sparkle: number // 0..1
}

export function sceneAt(time: number): Scene {
  const t = time % LOOP_SECONDS
  const trolleyX = track(trolleyKeys, t)
  const hookY = track(hookKeys, t)
  const truckX = track(truckKeys, t)

  // Where the finished gallery is: standing, hanging from the hook, or on the truck.
  let dx = 0
  let dy = 0
  if (t >= L + 4.6) {
    dx = truckX - BUILD_X
    dy = loadedY - ROOF_Y
  } else if (t >= L + 1.4) {
    dx = trolleyX - BUILD_X
    dy = hookY - ROOF_Y
  }

  const pieces = PIECES.map((piece, i) => {
    const t0 = i * STEP
    if (t < t0) return { x: OFFSCREEN_X, y: 0, visible: false }
    if (t < t0 + 2.05) return { x: truckX, y: BED_Y - piece.height, visible: true } // on the truck
    if (t < t0 + 5.1) return { x: trolleyX, y: hookY, visible: true } // on the hook
    return { x: BUILD_X + dx, y: piece.placedY + dy, visible: true } // placed
  })

  const flagStart = PIECES.length * STEP
  return {
    trolleyX,
    hookY,
    truckX,
    pieces,
    flag: { x: BUILD_X + dx, y: ROOF_Y + dy, scale: ease(clamp01((t - flagStart) / 0.6)) },
    sparkle: Math.sin(Math.PI * clamp01((t - flagStart - 0.3) / 2)),
  }
}

// A still frame for visitors who prefer reduced motion: the finished gallery.
export const STILL_TIME = PIECES.length * STEP + 1.3
