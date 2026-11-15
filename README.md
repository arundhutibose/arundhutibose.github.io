# me

Arundhuti Bose's website. For now, an animated "under construction" page.
React + TypeScript + Vite.

## Run locally

    npm install
    npm run dev      # http://localhost:5173

## Change things

- Text, links, email: `src/data/content.ts`
- Artworks shown in the gallery: add or remove `.jpg` files in `src/assets/art/`
- Scene backdrop: replace `src/assets/backdrop.jpg`

## Layout

    src/
      App.tsx                  page structure
      data/content.ts          all site text and links
      styles/index.css         colors, fonts, spacing, small animations
      assets/                  backdrop + artworks
      components/
        Crane.tsx              the construction scene (SVG)
        craneTimeline.ts       what moves when, as a function of time
        GalleryArt.tsx         the artwork hung in the gallery
        HighlandCoo.tsx        easter egg: click the coo
        InstagramCard.tsx      QR card
        StyledQr.tsx           the QR code drawing
        ContactLetter.tsx      letter form + envelope animation

## Contact form

Send posts the letter to FormSubmit, which forwards it to the address in
`content.ts`. The first letter ever sent triggers a one-time activation email
to that inbox; letters arrive only after its link is clicked.

## Link preview

The title, description and image shown when the link is shared live in
`index.html`; the image is `public/og-image.jpg` (1200x630). Set `SITE_URL` in
`vite.config.ts` to the site's full address, or chat apps won't show the image.
