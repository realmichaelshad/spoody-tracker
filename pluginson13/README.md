# Plug-ins — pluginson13.com

The website for **Plug-ins**, the family-owned appliance, kitchenware and
electronics store with two Brooklyn locations:

| Store | Address | Phone |
| --- | --- | --- |
| Boro Park (13th Avenue) | 4103 13th Ave, Brooklyn, NY 11219 | (718) 853-6061 |
| Williamsburg (Spencer Street) | 50 Spencer St, Brooklyn, NY 11205 | (718) 388-0857 |

A fast, fully static site built with [Astro](https://astro.build). No
trackers, no third-party scripts, and every page scores clean on an automated
WCAG 2.2 AA accessibility audit at phone and desktop sizes.

## What's on the site

- **Home** — hero, departments, kallah showroom, keilim mikvah, services,
  brands, both stores with live hours, FAQ.
- **Departments** — `/appliances/`, `/small-appliances/`, `/kitchenware/`,
  `/electronics/`: categories, buying tips, FAQ.
- **Kallah & Registry** (`/kallah/`) — the showroom, how registries work, and
  an interactive **kallah list builder**: checkmarks save on the customer's
  own phone, the list prints cleanly, shares with family as a link, and can be
  sent to the store through the contact form in one tap.
- **Keilim Mikvah** (`/keilim-mikvah/`) — how the on-site mikvah works.
- **Delivery & Financing** (`/services/`) — delivery area and a delivery-day
  checklist, financing, rebates, special orders.
- **Locations** (`/locations/`, `/locations/boro-park/`,
  `/locations/williamsburg/`) — hours, map (loads only when tapped),
  directions, upcoming Yom Tov closures.
- **Contact** (`/contact/`) — price & stock questions, with a call/text/email
  preference.
- **Privacy & accessibility** (`/policies/`) and a friendly 404 page.

### Details that matter for this store

- **Live "Open now" badges** everywhere, computed in New York time. They know
  about the Friday early close, Shabbos, every Yom Tov (two-day, calculated
  with Hebcal), and close early on Erev Yom Tov. Location pages list closures
  and early closings coming up in the next three weeks.
- **Built for the phone first**: a thumb-reach bar with Call, Directions and
  Ask a price; with two stores, Call and Directions open a picker showing each
  store's live status.
- **Filter-friendly**: fonts and scripts are self-hosted, nothing loads from
  third parties unless a customer taps "Show map", and there are no pictures of
  people — only original illustrations.
- **Old links keep working**: `public/_redirects` sends the previous site's
  catalog URLs (`/contact-us`, `/locations/brooklyn-store`,
  `/rebate_center.html`, `/appliances/laundry/...` and so on) to the matching
  new pages, so Google results and bookmarks don't break.
- **Search-ready**: per-page titles and descriptions, canonical URLs, a
  sitemap, social share image, and structured data for both stores (address,
  phone, hours), breadcrumbs and FAQs.

## Editing the site

Almost everything the store would change lives in **`src/data/business.ts`**:

| To change… | Edit |
| --- | --- |
| Phone numbers, addresses, hours | `stores` |
| A holiday closure or short day | `business.specialDays` |
| A banner across the top (sale, Chol Hamoed hours) | `business.announcement` |
| Brands shown on the site | `business.brands` |
| Where contact-form messages go | `business.forms` (see below) |
| Email, Instagram, delivery area | `business` |

Other content:

- Page copy: `src/pages/*.astro` (each department page keeps its categories,
  tips and FAQs at the top of the file).
- FAQ answers used on several pages: `src/data/faq.ts`.
- Kallah list items: `src/data/kallahList.ts` (keep existing ids — they are
  saved on customers' phones and in shared links; add new ones instead).
- Colors and type: `src/styles/global.css` (tokens at the top).
- Logo: `src/components/Logo.astro`; favicon and app icons come from
  `public/favicon.svg` and `scripts/icon-full.svg` — run `npm run icons` after
  changing them.

### Contact form

Out of the box, the form opens the customer's email app with their message
filled in, addressed to `pluginson13@gmail.com`. To receive messages directly
instead:

1. Go to [web3forms.com](https://web3forms.com), enter the store email, and
   copy the access key it sends.
2. Paste it into `business.forms.web3formsKey` in `src/data/business.ts`.

Any service that accepts a normal form post (Formspree, Basin…) also works via
`business.forms.formEndpoint`. If you use one other than Web3Forms or
Formspree, add its address to `connect-src` and `form-action` in
`public/_headers`.

## Development

Requires Node 22.12 or newer.

```bash
npm install
npm run dev      # http://localhost:4321
npm test         # opening-hours logic: Shabbos, Yom Tov, DST…
npm run check    # type check
npm run build    # static site in dist/
```

## Deploying (Cloudflare, free)

The site is plain static files, configured for Cloudflare Workers static assets
(`wrangler.jsonc`), which also applies `_redirects` and `_headers`.

1. In the Cloudflare dashboard: **Workers & Pages → Create → Import a
   repository**, and pick this repository.
2. Set the **root directory** to `pluginson13`, the build command to
   `npm run build`, and the deploy command to `npx wrangler deploy`.
3. Under the Worker's **Domains & Routes**, add `www.pluginson13.com` and
   `pluginson13.com` (the domain's DNS must be on Cloudflare), and add a
   redirect rule from `pluginson13.com` to `https://www.pluginson13.com`.

## Before going live

- [ ] Confirm hours for both stores, especially Sunday and Friday.
- [ ] Confirm the kallah showroom and keilim mikvah are at 13th Avenue only.
- [ ] Review the brand list, delivery area and service wording (installation,
      haul-away) against what the store actually offers.
- [ ] Set up the contact form key (above).
- [ ] Swap in the store's own logo if it has one.
- [ ] Point the Google Business Profile website links at the new pages
      (e.g. each store at its `/locations/…/` page).
- [ ] The previous site is a manufacturer-fed catalog with product pages. This
      site replaces it with a store site (customers call, visit or send a model
      number). If the catalog should stay online, host it on a subdomain such
      as `shop.pluginson13.com` and link to it from the header.
