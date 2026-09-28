// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The canonical host. The live store site has always been served from www,
// so every canonical URL, the sitemap and the social cards use it too.
const SITE = 'https://www.pluginson13.com';

export default defineConfig({
  site: SITE,
  // Pages are built as /appliances/index.html, so every URL ends in a slash.
  // Keeping links, canonicals and the sitemap on one spelling avoids Google
  // treating /appliances and /appliances/ as duplicates.
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // The whole stylesheet is small (~10 KB compressed), so ship it inside
    // each page: the first paint no longer waits on separate CSS requests.
    inlineStylesheets: 'always',
  },
  compressHTML: true,
  devToolbar: { enabled: false },
  vite: {
    build: {
      // Ship every script as its own file instead of inlining the small ones,
      // so the Content-Security-Policy in public/_headers can stay at
      // script-src 'self' with no inline exceptions.
      assetsInlineLimit: 0,
    },
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
});
