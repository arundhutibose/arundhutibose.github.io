// The artwork hung in the gallery. Every image in src/assets/art is picked up
// automatically, so adding or removing a picture there is all it takes.
const files = import.meta.glob<string>('../assets/art/*.jpg', { eager: true, import: 'default' })
const ART = Object.keys(files)
  .sort()
  .map((path) => files[path])

export const ART_COUNT = ART.length

// Drawn inside a 50x38 box whose top-left is (-25, 4).
export default function GalleryArt({ variant }: { variant: number }) {
  return (
    <>
      <image
        href={ART[variant % ART.length]}
        x="-25"
        y="4"
        width="50"
        height="38"
        preserveAspectRatio="xMidYMid slice"
      />
      <rect x="-25" y="4" width="50" height="38" className="art-frame" />
    </>
  )
}
