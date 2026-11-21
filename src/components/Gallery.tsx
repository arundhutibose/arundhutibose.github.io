import { Fragment, useRef, useState } from 'react'

// Each piece has a small copy (the grid) and a large copy (shown on click), with
// the same file name in src/assets/gallery/thumb and src/assets/gallery/full.
const thumbs = import.meta.glob<string>('../assets/gallery/thumb/*.jpg', { eager: true, import: 'default' })
const fulls = import.meta.glob<string>('../assets/gallery/full/*.jpg', { eager: true, import: 'default' })

// To add a piece: drop both copies in the folders above and add a line to its
// group here (or add a new group). width and height are the small copy's size
// in pixels; the grid uses them to keep each piece's own shape.
const GROUPS = [
  {
    title: 'Sculpture',
    pieces: [
      { file: '01', width: 700, height: 466, alt: 'Sculpture of a red dragon breathing fire, seen from the side' },
      { file: '04', width: 700, height: 466, alt: 'Sculpture of a red dragon breathing fire, seen from the front' },
      { file: '02', width: 700, height: 466, alt: 'Sculpture of a coral reef growing out of a teal plastic bottle on a wave' },
      { file: '03', width: 466, height: 700, alt: 'Puppet of a dancer in a pink dress with purple wings, held up by its strings' },
      { file: '05', width: 466, height: 700, alt: 'Winged dancer puppet in a pink dress, seen from behind' },
    ],
  },
  {
    title: 'Paintings',
    pieces: [
      { file: '08', width: 525, height: 700, alt: 'Painting of a lighthouse on a green headland under a wide stormy sky' },
      { file: '09', width: 525, height: 700, alt: 'Painting of an autumn woodland path leading to a blue lake' },
      { file: '13', width: 560, height: 700, alt: 'Painting of a dark wave breaking under storm clouds' },
      { file: '14', width: 525, height: 700, alt: 'Painting of a window with navy curtains looking out over green hills' },
      { file: '16', width: 525, height: 700, alt: 'Close view of the painted window, with clouds over green hills' },
      { file: '15', width: 525, height: 700, alt: 'Small painting of a crescent moon over a beach at dusk' },
      { file: '12', width: 525, height: 700, alt: 'Small painting of a duck in a pink jumper walking through a wood' },
      { file: '10', width: 393, height: 700, alt: 'Painting on an easel of red and blue waves over a green meadow' },
    ],
  },
  {
    title: 'Watercolours',
    pieces: [
      { file: '17', width: 517, height: 700, alt: 'Watercolour of orange slices, pears, cinnamon sticks and star anise' },
      { file: '18', width: 525, height: 700, alt: 'Five watercolour bookmarks with waves, suns, leaves and green squares' },
      { file: '19', width: 394, height: 700, alt: 'Watercolour and ink bookmarks with a sailing boat, a sun and mountains' },
    ],
  },
  {
    title: 'Jewellery',
    pieces: [
      { file: '06', width: 525, height: 700, alt: 'Round wooden earrings covered in orange and red dot painting' },
      { file: '07', width: 700, height: 643, alt: 'Clay earrings in pink and lime green with a leaf and flower pattern' },
    ],
  },
  {
    title: 'Drawings & collage',
    pieces: [
      { file: '11', width: 700, height: 525, alt: 'Many drawings, prints and collages spread out across the floor' },
    ],
  },
]

export default function Gallery({ heading }: { heading: string }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState<(typeof GROUPS)[number]['pieces'][number]>()

  return (
    <section className="gallery" aria-labelledby="artwork-heading">
      <h2 id="artwork-heading">{heading}</h2>
      {GROUPS.map((group) => (
        <Fragment key={group.title}>
          <h3>{group.title}</h3>
          <div className="pieces">
            {group.pieces.map((piece) => (
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
        </Fragment>
      ))}

      {/* a click anywhere, the Close button or Esc all close it */}
      <dialog ref={dialog} className="lightbox" onClick={() => dialog.current!.close()}>
        {/* keyed, so the previous piece never lingers while the next one downloads */}
        {open && <img key={open.file} src={fulls[`../assets/gallery/full/${open.file}.jpg`]} alt={open.alt} />}
        <button type="button" aria-label="Close">×</button>
      </dialog>
    </section>
  )
}
