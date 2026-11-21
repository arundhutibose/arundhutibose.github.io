import { useLayoutEffect, useRef, useState } from 'react'

// Each piece has a small copy (the grid) and a large copy (shown on click), with
// the same file name in src/assets/gallery/thumb and src/assets/gallery/full.
const thumbs = import.meta.glob<string>('../assets/gallery/thumb/*.jpg', { eager: true, import: 'default' })
const fulls = import.meta.glob<string>('../assets/gallery/full/*.jpg', { eager: true, import: 'default' })

// To add a piece: drop both copies in the folders above and add a line here.
// width and height are the small copy's size in pixels; the grid uses them to
// keep each piece's own shape.
const PIECES = [
  { file: '01', width: 700, height: 466, alt: 'Sculpture of a red dragon breathing fire, seen from the side' },
  { file: '04', width: 700, height: 466, alt: 'Sculpture of a red dragon breathing fire, seen from the front' },
  { file: '02', width: 700, height: 466, alt: 'Sculpture of a coral reef growing out of a teal plastic bottle on a wave' },
  { file: '03', width: 466, height: 700, alt: 'Puppet of a dancer in a pink dress with purple wings, held up by its strings' },
  { file: '05', width: 466, height: 700, alt: 'Winged dancer puppet in a pink dress, seen from behind' },
  { file: '08', width: 525, height: 700, alt: 'Painting of a lighthouse on a green headland under a wide stormy sky' },
  { file: '09', width: 525, height: 700, alt: 'Painting of an autumn woodland path leading to a blue lake' },
  { file: '13', width: 560, height: 700, alt: 'Painting of a dark wave breaking under storm clouds' },
  { file: '14', width: 525, height: 700, alt: 'Painting of a window with navy curtains looking out over green hills' },
  { file: '16', width: 525, height: 700, alt: 'Close view of the painted window, with clouds over green hills' },
  { file: '15', width: 525, height: 700, alt: 'Small painting of a crescent moon over a beach at dusk' },
  { file: '12', width: 525, height: 700, alt: 'Small painting of a duck in a pink jumper walking through a wood' },
  { file: '10', width: 393, height: 700, alt: 'Painting on an easel of red and blue waves over a green meadow' },
  { file: '17', width: 517, height: 700, alt: 'Watercolour of orange slices, pears, cinnamon sticks and star anise' },
  { file: '18', width: 525, height: 700, alt: 'Five watercolour bookmarks with waves, suns, leaves and green squares' },
  { file: '19', width: 394, height: 700, alt: 'Watercolour and ink bookmarks with a sailing boat, a sun and mountains' },
  { file: '06', width: 525, height: 700, alt: 'Round wooden earrings covered in orange and red dot painting' },
  { file: '07', width: 700, height: 643, alt: 'Clay earrings in pink and lime green with a leaf and flower pattern' },
  { file: '11', width: 700, height: 525, alt: 'Many drawings, prints and collages spread out across the floor' },
]

const GAP = 12 // px, the .75rem gap between columns in index.css
const MIN_COLUMN = 240 // px

export default function Gallery() {
  const dialog = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState<(typeof PIECES)[number]>()

  // We place the pieces ourselves: CSS columns are balanced by the browser, and
  // Safari leaves one column a whole picture taller than the other.
  const pieces = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(2)
  useLayoutEffect(() => {
    const el = pieces.current!
    const measure = () => setCount(Math.max(2, Math.floor((el.clientWidth + GAP) / (MIN_COLUMN + GAP))))
    measure() // before the first paint, so the column count never flashes
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // In order, each piece goes to the shortest column (the leftmost on a tie);
  // a column's height is the sum of its pieces' height / width.
  const columns = Array.from({ length: count }, () => ({ height: 0, pieces: [] as typeof PIECES }))
  for (const piece of PIECES) {
    const shortest = columns.reduce((a, b) => (b.height < a.height ? b : a))
    shortest.pieces.push(piece)
    shortest.height += piece.height / piece.width
  }

  return (
    <div className="gallery">
      <div className="pieces" ref={pieces}>
        {columns.map((column, i) => (
          <div key={i}>
            {column.pieces.map((piece) => (
              <button
                key={piece.file}
                type="button"
                onClick={() => {
                  setOpen(piece)
                  dialog.current!.showModal()
                }}
              >
                <img
                  src={thumbs[`../assets/gallery/thumb/${piece.file}.jpg`]}
                  width={piece.width}
                  height={piece.height}
                  alt={piece.alt}
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* a click anywhere, the Close button or Esc all close it */}
      <dialog ref={dialog} className="lightbox" onClick={() => dialog.current!.close()}>
        {/* keyed, so the previous piece never lingers while the next one downloads */}
        {open && <img key={open.file} src={fulls[`../assets/gallery/full/${open.file}.jpg`]} alt={open.alt} />}
        <button type="button" aria-label="Close">×</button>
      </dialog>
    </div>
  )
}
