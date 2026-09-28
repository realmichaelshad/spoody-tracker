/*
 * Everything about the business lives here. Change a phone number, the
 * hours or the brand list in this one file and every page, the footer, the
 * live "Open now" badges and the Google structured data all follow.
 */

/** 24-hour "HH:MM" in New York time. */
export type Clock = `${number}:${number}`;
export type DayHours = { open: Clock; close: Clock } | null;
/** Index 0 is Sunday, matching Date#getDay(). */
export type WeekHours = [DayHours, DayHours, DayHours, DayHours, DayHours, DayHours, DayHours];

export interface Store {
  id: 'boro-park' | 'williamsburg';
  /** Short name used on buttons: "Boro Park". */
  name: string;
  /** Street the locals know it by: "13th Avenue". */
  street: string;
  neighborhood: string;
  address: {
    line1: string;
    city: string;
    region: string;
    postalCode: string;
  };
  /** As printed on the page. */
  phone: string;
  /** E.164 for tel: links and structured data. */
  tel: string;
  hours: WeekHours;
  /** What only this store has. */
  features: string[];
  /** Nearby neighborhoods, for the location page and local search. */
  nearby: string[];
  /** Opens the store in Google Maps (works in the app on phones too). */
  mapsUrl: string;
  /** Used for the click-to-load map on the location page. */
  mapsEmbedQuery: string;
}

const h = (open: Clock, close: Clock): DayHours => ({ open, close });

export const stores: Store[] = [
  {
    id: 'boro-park',
    name: 'Boro Park',
    street: '13th Avenue',
    neighborhood: 'Borough Park',
    address: {
      line1: '4103 13th Ave',
      city: 'Brooklyn',
      region: 'NY',
      postalCode: '11219',
    },
    phone: '(718) 853-6061',
    tel: '+17188536061',
    //      Sun                 Mon                Tue                Wed                Thu                Fri                  Sat
    hours: [h('11:00', '18:30'), h('10:00', '19:00'), h('10:00', '19:00'), h('10:00', '19:00'), h('10:00', '19:00'), h('10:00', '13:30'), null],
    features: ['Kallah showroom', 'Keilim mikvah on site'],
    nearby: ['Borough Park', 'Kensington', 'Midwood', 'Flatbush', 'Bensonhurst', 'Dyker Heights'],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Plug-ins%2C+4103+13th+Ave%2C+Brooklyn%2C+NY+11219',
    mapsEmbedQuery: 'Plug-ins, 4103 13th Ave, Brooklyn, NY 11219',
  },
  {
    id: 'williamsburg',
    name: 'Williamsburg',
    street: 'Spencer Street',
    neighborhood: 'Williamsburg',
    address: {
      line1: '50 Spencer St',
      city: 'Brooklyn',
      region: 'NY',
      postalCode: '11205',
    },
    phone: '(718) 388-0857',
    tel: '+17183880857',
    //      Sun                 Mon                Tue                Wed                Thu                Fri                  Sat
    hours: [h('11:00', '19:00'), h('11:00', '19:00'), h('11:00', '19:00'), h('11:00', '19:00'), h('11:00', '19:00'), h('10:00', '13:30'), null],
    features: [],
    nearby: ['Williamsburg', 'Bedford-Stuyvesant', 'Clinton Hill', 'Greenpoint', 'Fort Greene', 'Bushwick'],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Plug-ins%2C+50+Spencer+St%2C+Brooklyn%2C+NY+11205',
    mapsEmbedQuery: 'Plug-ins, 50 Spencer St, Brooklyn, NY 11205',
  },
];

export const storeById = (id: Store['id']): Store => {
  const store = stores.find((s) => s.id === id);
  if (!store) throw new Error(`Unknown store ${id}`);
  return store;
};

/** The flagship: its number is the one on the big "Call" buttons. */
export const mainStore = storeById('boro-park');

export const business = {
  name: 'Plug-ins',
  url: 'https://www.pluginson13.com',
  email: 'pluginson13@gmail.com',
  instagram: {
    handle: '@pluginson13',
    url: 'https://www.instagram.com/pluginson13/',
  },
  /** One line that works under the logo, in search results and on share cards. */
  tagline: 'Appliances, kitchenware & electronics in Brooklyn',
  description:
    'Family-owned appliance, kitchenware and electronics store with two Brooklyn locations — 13th Avenue in Boro Park and Spencer Street in Williamsburg. Kallah showroom, keilim mikvah on site, fast local delivery and flexible financing.',
  serviceArea: ['Brooklyn', 'Queens', 'Manhattan', 'Jersey City'],
  /**
   * Brands confirmed on the store's own catalog and rebate pages. Add more
   * here as you like — they appear on the home page and the appliance page.
   */
  brands: ['GE Appliances', 'GE Profile', 'Café', 'Whirlpool', 'KitchenAid', 'LG', 'Frigidaire', 'Electrolux', 'SEBO'],
  /**
   * How the live "Open now" badge treats the Jewish calendar.
   * - Shabbos: every store's Saturday is `null` above, so it shows closed.
   * - Yom Tov: both stores show "Closed for Yom Tov" automatically.
   * - Erev Yom Tov: the badge uses Friday's hours, since the stores close
   *   early before Yom Tov the same way they do before Shabbos.
   */
  calendar: {
    closedOnYomTov: true,
    erevYomTovUsesFridayHours: true,
  },
  /**
   * One-off closures or changed hours (holidays, inventory, a simcha).
   * Dates are New York dates. `hours: null` means closed all day.
   * Example: { date: '2026-12-25', hours: { open: '10:00', close: '16:00' }, note: 'Short day' }
   */
  specialDays: [] as { date: string; hours: DayHours; note: string; stores?: Store['id'][] }[],
  /**
   * An optional strip across the top of every page, e.g. a sale or Chol
   * Hamoed hours. Leave `text` empty to hide it.
   */
  announcement: {
    text: '',
    href: '',
  },
  /**
   * Where the contact form sends messages. Without either key, the form
   * opens the customer's email app with the message filled in instead.
   * - web3formsKey: free at web3forms.com (enter the store email, paste the key)
   * - formEndpoint: any service that accepts a form POST (Formspree, Basin…)
   */
  forms: {
    web3formsKey: '',
    formEndpoint: '',
  },
  /**
   * Link to the Google review form for the main store, if you have one
   * (Google Business Profile → "Ask for reviews"). Falls back to a Maps search.
   */
  reviewUrl: '',
} as const;

export const telHref = (store: Store) => `tel:${store.tel}`;

export const fullAddress = (store: Store) =>
  `${store.address.line1}, ${store.address.city}, ${store.address.region} ${store.address.postalCode}`;
