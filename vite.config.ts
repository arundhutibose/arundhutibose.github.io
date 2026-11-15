import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The site's full public address, with no trailing slash, e.g. 'https://example.com'.
// Link previews need it: chat apps only show the preview image when its address
// is complete. Leave empty until the address is known.
const SITE_URL = 'https://arundhutibose.github.io'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'site-url',
      transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', SITE_URL),
    },
  ],
})
