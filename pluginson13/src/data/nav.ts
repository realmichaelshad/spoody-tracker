/* Site map: the header, footer, mobile menu and home page all read from here. */

export interface Department {
  href: string;
  title: string;
  /** One line under the title on cards and in the menu. */
  blurb: string;
  art: 'fridge' | 'mixer' | 'pots' | 'electronics';
}

export const departments: Department[] = [
  {
    href: '/appliances/',
    title: 'Major Appliances',
    blurb: 'Refrigerators, ranges, dishwashers, laundry & A/C',
    art: 'fridge',
  },
  {
    href: '/small-appliances/',
    title: 'Small Appliances',
    blurb: 'Urns, platas, mixers, coffee & floor care',
    art: 'mixer',
  },
  {
    href: '/kitchenware/',
    title: 'Kitchenware & Housewares',
    blurb: 'Pots, pans, knives, bakeware & more',
    art: 'pots',
  },
  {
    href: '/electronics/',
    title: 'Electronics',
    blurb: 'Personal care, audio, clocks & power',
    art: 'electronics',
  },
];

export interface NavLink {
  href: string;
  label: string;
}

export const primaryNav: NavLink[] = [
  { href: '/kallah/', label: 'Kallah & Registry' },
  { href: '/keilim-mikvah/', label: 'Keilim Mikvah' },
  { href: '/services/', label: 'Delivery & Financing' },
  { href: '/locations/', label: 'Locations' },
];

export const companyNav: NavLink[] = [
  { href: '/kallah/', label: 'Kallah showroom & registry' },
  { href: '/kallah/#kallah-list', label: 'Kallah list builder' },
  { href: '/keilim-mikvah/', label: 'Keilim mikvah' },
  { href: '/services/', label: 'Delivery, financing & rebates' },
  { href: '/locations/', label: 'Store locations & hours' },
  { href: '/contact/', label: 'Contact & price check' },
];
