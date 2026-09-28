/*
 * Questions people actually call about. Answers are plain text so they can
 * go straight into Google's FAQ structured data as well as the page.
 */
import { business, stores } from './business';
import { groupWeek } from '../lib/hours';

export interface Faq {
  q: string;
  a: string;
}

const hoursSentence = stores
  .map((s) => {
    const rows = groupWeek(s.hours).filter((r) => !r.closed);
    return `${s.name} (${s.street}): ${rows.map((r) => `${r.label} ${r.range}`).join(', ')}`;
  })
  .join('. ');

const area = `${business.serviceArea.slice(0, -1).join(', ')} and ${business.serviceArea.at(-1)}`;

export const hoursFaq: Faq = {
  q: 'What are your store hours?',
  a: `${hoursSentence}. Both stores are closed on Shabbos and Yom Tov, and close early before Yom Tov.`,
};

export const deliveryFaq: Faq = {
  q: 'Do you deliver?',
  a: `Yes. Our local delivery team is quick and careful, and covers ${area}, plus the surrounding areas. Ask about timing when you buy and we'll schedule a day that works for you.`,
};

export const mikvahFaq: Faq = {
  q: 'Is there a keilim mikvah at the store?',
  a: 'Yes — at our 13th Avenue store in Boro Park. An attendant unwraps your new purchases before you tovel them and rewraps them afterwards, so everything goes home ready to use.',
};

export const financingFaq: Faq = {
  q: 'Do you offer financing?',
  a: 'Yes. We offer simple, flexible financing so you can bring home appliances and pay over time. Ask in store about current plans; financing is subject to credit approval.',
};

export const specialOrderFaq: Faq = {
  q: "Can you get a model I don't see in the store?",
  a: "Usually, yes. Send us the model number or call either store, and we'll check the price and when we can have it for you.",
};

export const registryFaq: Faq = {
  q: 'Do you set up gift registries?',
  a: 'Yes — for vorts, weddings and other simchas. Stop by the kallah showroom on 13th Avenue to set one up, or start your list online with our kallah list builder.',
};

export const rebateFaq: Faq = {
  q: 'Do you help with manufacturer rebates?',
  a: "Yes. Brands like GE, LG, KitchenAid, Frigidaire and Electrolux run rebates throughout the year. We'll tell you what applies to the model you're buying and help you claim it.",
};

export const sabbathModeFaq: Faq = {
  q: 'Do you carry appliances with Sabbath mode?',
  a: 'Yes. Many ovens, ranges and refrigerators now come with a Sabbath mode, and several are certified by the Star-K. Tell us what you need it to do and we will show you the models that fit.',
};

export const homeFaqs: Faq[] = [deliveryFaq, hoursFaq, mikvahFaq, financingFaq, specialOrderFaq, registryFaq, rebateFaq];
