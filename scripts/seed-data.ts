/**
 * Opening-week sightings — the house's own posts.
 *
 * Written to read like a real feed rather than a comedy set: most posts
 * are short and low-effort, a few are funny, some are barely coherent,
 * and several are just someone unsure of what they saw. Typos and dropped
 * punctuation are deliberate. Uniform polish is what makes seeded content
 * obvious, so the variance here matters more than the jokes.
 *
 * Invented codenames at real places. Nothing impersonates a real person
 * or uses anyone's artwork; `photo` attaches a scene generated in code.
 */
export interface Seed {
  name: string;
  message: string;
  place: string;
  lat: number;
  lng: number;
  photo?: boolean;
  /** skyline | blurry | rooftop | closeup */
  shot?: 'skyline' | 'blurry' | 'rooftop' | 'closeup';
}

export const SEEDS: Seed[] = [
  /* ── Wave 1: launch night ─────────────────────────────────────────── */
  { name: 'ROOFTOP-RITA', message: 'ok so he landed. waved. left. thats it thats the whole thing', place: 'EMPIRE STATE BUILDING, US', lat: 40.7484, lng: -73.9857, photo: true, shot: 'skyline' },
  { name: 'BODEGA-BEN', message: 'bacon egg and cheese. exact change. hes one of us', place: 'BROOKLYN, US', lat: 40.6782, lng: -73.9442, photo: true, shot: 'closeup' },
  { name: 'MARCUS-K', message: 'was that him??', place: 'MANHATTAN, US', lat: 40.7549, lng: -73.984 },
  { name: 'SHIBUYA-SPOTTER', message: 'nobody looked up. NOBODY. very tokyo of them', place: 'SHIBUYA CROSSING, JP', lat: 35.6595, lng: 139.7004, photo: true, shot: 'skyline' },
  { name: 'CLAIRE-P', message: 'my friend saw him near the tower earlier. i missed it obviously', place: 'EIFFEL TOWER, FR', lat: 48.8584, lng: 2.2945, photo: true, shot: 'blurry' },
  { name: 'THAMES-TOM', message: 'hanging off big ben at 3am. asked if anyone had a charger. i had one. he left anyway', place: 'BIG BEN, UK', lat: 51.5007, lng: -0.1246, photo: true, shot: 'blurry' },
  { name: 'DENIS_R', message: 'sighting. downtown. thats all i got', place: 'CHICAGO, US', lat: 41.8827, lng: -87.6233 },
  { name: 'CRISTO-CAM', message: 'sat on the shoulder for like ten minutes just looking at the view. didnt do anything', place: 'CHRIST THE REDEEMER, BR', lat: -22.9519, lng: -43.2105, photo: true, shot: 'skyline' },
  { name: 'QUEENS-KID-04', message: 'bro was on my fire escape. i said hi. he said hi. i have not slept since', place: 'QUEENS, US', lat: 40.7282, lng: -73.7949, photo: true, shot: 'closeup' },
  { name: 'AY-DUBAI', message: 'went up the burj. no stopping. i take the elevator to floor 2', place: 'BURJ KHALIFA, AE', lat: 25.1972, lng: 55.2744, photo: true, shot: 'skyline' },
  { name: 'OPERA-OMAR', message: 'on the sails at sunset. seagulls were NOT having it', place: 'SYDNEY OPERA HOUSE, AU', lat: -33.8568, lng: 151.2153, photo: true, shot: 'rooftop' },
  { name: 'MISSION-MARA', message: 'swung past the taqueria. i swear he looked at my burrito', place: 'SAN FRANCISCO, US', lat: 37.7599, lng: -122.4148, photo: true, shot: 'blurry' },
  { name: 'TIMES-SQ-TARA', message: 'he was sitting on a spider-man billboard. i need everyone to understand that', place: 'TIMES SQUARE, US', lat: 40.758, lng: -73.9855, photo: true, shot: 'skyline' },
  { name: 'ZOCALO-ZARA', message: 'mariachi band started playing when he swung past. unprompted. incredible', place: 'MEXICO CITY, MX', lat: 19.4326, lng: -99.1332, photo: true, shot: 'rooftop' },

  /* ── Wave 2: later that night ─────────────────────────────────────── */
  { name: 'GATE-KEEPER-77', message: 'ran along the wall for ages then just fog. gone', place: 'GREAT WALL, CN', lat: 40.4319, lng: 116.5704, photo: true, shot: 'skyline' },
  { name: 'LU_87', message: 'anyone else see something over the river or is it just me', place: 'SHANGHAI, CN', lat: 31.2304, lng: 121.4737 },
  { name: 'COLOSSEUM-CIRO', message: 'doing flips in the arena. nobody asked him to', place: 'COLOSSEUM, IT', lat: 41.8902, lng: 12.4922, photo: true, shot: 'rooftop' },
  { name: 'TOWER-TILLY', message: 'edgewalk with no harness. i dont think thats allowed', place: 'CN TOWER, CA', lat: 43.6426, lng: -79.3871, photo: true, shot: 'skyline' },
  { name: 'ANDES-ANA', message: 'said the altitude is rough. finally something we have in common', place: 'MACHU PICCHU, PE', lat: -13.1631, lng: -72.545, photo: true, shot: 'rooftop' },
  { name: 'LAGOS-LEKAN', message: 'third mainland during traffic 😭 fastest commute in this city and its not close', place: 'LAGOS, NG', lat: 6.5244, lng: 3.3792, photo: true, shot: 'skyline' },
  { name: 'RIYA-M', message: 'blurry pic sorry', place: 'TAJ MAHAL, IN', lat: 27.1751, lng: 78.0421, photo: true, shot: 'blurry' },
  { name: 'BRIDGE-BENNY', message: 'went under the bridge and the fog just took him. cinematic honestly', place: 'GOLDEN GATE BRIDGE, US', lat: 37.8199, lng: -122.4783, photo: true, shot: 'blurry' },
  { name: 'MARINA-MO', message: 'tourists thought it was part of the light show lmaooo', place: 'MARINA BAY SANDS, SG', lat: 1.2834, lng: 103.8607, photo: true, shot: 'skyline' },
  { name: 'SEOUL-SUNNY', message: 'he tied a love lock on namsan. for WHO', place: 'N SEOUL TOWER, KR', lat: 37.5512, lng: 126.9882, photo: true, shot: 'closeup' },
  { name: 'PYRAMID-PARI', message: 'stood on the actual top. guide acted like he didnt see it', place: 'GIZA PYRAMIDS, EG', lat: 29.9792, lng: 31.1342, photo: true, shot: 'skyline' },
  { name: 'EMRE.T', message: 'crossed two continents in like 4 seconds. my bus takes 40 min', place: 'ISTANBUL, TR', lat: 41.0451, lng: 29.0335, photo: true, shot: 'rooftop' },
  { name: 'AMSTEL-ARIE', message: 'borrowed a bike rode it one block put it back exactly where it was. polite of him', place: 'AMSTERDAM, NL', lat: 52.3676, lng: 4.9041, photo: true, shot: 'closeup' },
  { name: 'SAGRADA-SAM', message: 'climbed a spire thats still under construction. brave', place: 'BARCELONA, ES', lat: 41.4036, lng: 2.1744, photo: true, shot: 'skyline' },
  { name: 'TABLE-TOP-TESS', message: 'hanging off the cable car line waving at everyone inside', place: 'CAPE TOWN, ZA', lat: -33.9628, lng: 18.4098, photo: true, shot: 'rooftop' },
  { name: 'VEGAS-VIC', message: 'the sphere showed a spider for one second. ONE SECOND. explain that', place: 'LAS VEGAS, US', lat: 36.1215, lng: -115.1678, photo: true, shot: 'skyline' },
  { name: 'J-VALDEZ', message: 'nvm it was a drone', place: 'PHOENIX, US', lat: 33.4484, lng: -112.074 },

  /* ── Wave 3: next day, calmer ─────────────────────────────────────── */
  { name: 'RED-SQUARE-ROB', message: 'gone before i could focus. every time', place: 'MOSCOW, RU', lat: 55.7539, lng: 37.6208, photo: true, shot: 'blurry' },
  { name: 'PARTHENON-PIA', message: 'sitting on the steps at dusk like he paid admission', place: 'ATHENS, GR', lat: 37.9715, lng: 23.7267, photo: true, shot: 'rooftop' },
  { name: 'REYKJAVIK-RUNE', message: 'he was just watching the lights. i didnt want to interrupt', place: 'REYKJAVIK, IS', lat: 64.1466, lng: -21.9426, photo: true, shot: 'skyline' },
  { name: 'PETRA.K', message: 'charles bridge, midnight. statues saw everything', place: 'PRAGUE, CZ', lat: 50.0865, lng: 14.4114, photo: true, shot: 'blurry' },
  { name: 'HALONG-HUY', message: 'every boat stopped to watch. free show', place: 'HA LONG BAY, VN', lat: 20.9101, lng: 107.1839, photo: true, shot: 'rooftop' },
  { name: 'NAIROBI-NIA', message: 'kicc helipad, golden hour. said its the best view in the city. hes right', place: 'NAIROBI, KE', lat: -1.2884, lng: 36.8233, photo: true, shot: 'skyline' },
  { name: 'BIRGIT_B', message: 'on the tv tower. just sitting. for an hour.', place: 'BERLIN, DE', lat: 52.5208, lng: 13.4094, photo: true, shot: 'rooftop' },
  { name: 'PATAGONIA-PAZ', message: 'on a glacier. no jacket. im cold just looking at this', place: 'PATAGONIA, AR', lat: -50.4967, lng: -73.1377, photo: true, shot: 'skyline' },
  { name: 'MEERA_98', message: 'gateway at sunrise, pigeons went insane', place: 'MUMBAI, IN', lat: 18.922, lng: 72.8347, photo: true, shot: 'closeup' },
  { name: 'BOON-T', message: 'saw him near the temple. or i saw a very fast red thing. same thing really', place: 'BANGKOK, TH', lat: 13.7524, lng: 100.4935, photo: true, shot: 'blurry' },

  /* ── Wave 4: tail end, sparse ─────────────────────────────────────── */
  { name: 'DUBLIN-DEE', message: 'ha penny bridge 6am. me and one very confused swan', place: 'DUBLIN, IE', lat: 53.3465, lng: -6.2632, photo: true, shot: 'blurry' },
  { name: 'OVE.N', message: 'walked down the opera house roof normally. somehow the weirdest part', place: 'OSLO, NO', lat: 59.9075, lng: 10.7529 },
  { name: 'LUCHO', message: 'on the cliffs watching surfers. not helping. just watching', place: 'LIMA, PE', lat: -12.1315, lng: -77.0303, photo: true, shot: 'rooftop' },
  { name: 'WIKTOR-92', message: 'my photo is one blurry red pixel. posting anyway', place: 'WARSAW, PL', lat: 52.2497, lng: 21.0122, photo: true, shot: 'blurry' },
  { name: 'PIP.AU', message: 'kings park. quiet. barely anyone around. still counts', place: 'PERTH, AU', lat: -31.9614, lng: 115.8342 },
  { name: 'MAX-MTL', message: 'up on the cross doing nothing at all. respect', place: 'MONTREAL, CA', lat: 45.5048, lng: -73.5878, photo: true, shot: 'skyline' },
  { name: 'HANNA_H', message: 'snowing. he looked cold. someone get this man a coat', place: 'HELSINKI, FI', lat: 60.1699, lng: 24.9384, photo: true, shot: 'closeup' },
];
