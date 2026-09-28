/*
 * JSON-LD for Google: one Organization, one WebSite, and a LocalBusiness per
 * store with its address, phone and opening hours. Everything is derived
 * from src/data/business.ts so it never drifts from what the page says.
 */
import { business, fullAddress, stores, type Store } from '../data/business';
import { DAY_NAMES } from './hours';

const SITE = business.url;
export const ORG_ID = `${SITE}/#organization`;
export const WEBSITE_ID = `${SITE}/#website`;

export const storeUrl = (store: Store) => `${SITE}/locations/${store.id}/`;
export const storeId = (store: Store) => `${storeUrl(store)}#store`;

function openingHours(store: Store) {
  const groups = new Map<string, { opens: string; closes: string; days: string[] }>();
  store.hours.forEach((d, dow) => {
    if (!d) return;
    const key = `${d.open}-${d.close}`;
    const group = groups.get(key) ?? { opens: d.open, closes: d.close, days: [] };
    group.days.push(DAY_NAMES[dow]);
    groups.set(key, group);
  });
  return [...groups.values()].map((g) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: g.days,
    opens: g.opens,
    closes: g.closes,
  }));
}

export function storeSchema(store: Store) {
  return {
    '@type': ['HomeGoodsStore', 'ElectronicsStore'],
    '@id': storeId(store),
    name: `Plug-ins ${store.name}`,
    alternateName: `Plug-ins on ${store.street}`,
    description: `${business.name} ${store.name} — appliances, kitchenware and electronics at ${fullAddress(store)}.`,
    url: storeUrl(store),
    telephone: store.tel,
    email: business.email,
    image: `${SITE}/og.png`,
    logo: `${SITE}/icon-512.png`,
    priceRange: '$$',
    currenciesAccepted: 'USD',
    address: {
      '@type': 'PostalAddress',
      streetAddress: store.address.line1,
      addressLocality: store.address.city,
      addressRegion: store.address.region,
      postalCode: store.address.postalCode,
      addressCountry: 'US',
    },
    hasMap: store.mapsUrl,
    openingHoursSpecification: openingHours(store),
    areaServed: business.serviceArea.map((name) => ({ '@type': 'Place', name })),
    amenityFeature: store.features.map((name) => ({
      '@type': 'LocationFeatureSpecification',
      name,
      value: true,
    })),
    parentOrganization: { '@id': ORG_ID },
    sameAs: [business.instagram.url],
  };
}

export function baseGraph() {
  return [
    {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: business.name,
      url: `${SITE}/`,
      logo: `${SITE}/icon-512.png`,
      email: business.email,
      telephone: stores[0].tel,
      description: business.description,
      sameAs: [business.instagram.url],
      department: stores.map((s) => ({ '@id': storeId(s) })),
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: `${SITE}/`,
      name: business.name,
      publisher: { '@id': ORG_ID },
      inLanguage: 'en-US',
    },
  ];
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${SITE}${c.path}`,
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}
