/**
 * Opening-week sightings — the house's own posts.
 *
 * Written in ordinary internet voice: meme cadence, uneven caps, some
 * jokes that land and some that are deliberately flat. Invented codenames
 * at real, recognisable places. Nothing here impersonates a real person,
 * quotes a real account, or uses anyone's artwork.
 *
 * `photo` attaches a generated pixel scene (see makePhoto in seed.ts);
 * `shot` picks which kind. All original, drawn in code.
 */
export interface Seed {
  name: string;
  message: string;
  place: string;
  lat: number;
  lng: number;
  photo?: boolean;
  /** skyline | blurry | rooftop | closeup — blurry is the "bad photo" bit */
  shot?: 'skyline' | 'blurry' | 'rooftop' | 'closeup';
}

export const SEEDS: Seed[] = [
  /* ── Wave 1: launch night. Loudest, funniest, biggest cities ──────── */
  { name: 'ROOFTOP-RITA', message: 'no because why did he land, WAVE, and leave. sir. explain yourself', place: 'EMPIRE STATE BUILDING, US', lat: 40.7484, lng: -73.9857, photo: true, shot: 'skyline' },
  { name: 'BODEGA-BEN', message: 'bought a bacon egg and cheese and paid in EXACT CHANGE. new yorker confirmed', place: 'BROOKLYN, US', lat: 40.6782, lng: -73.9442, photo: true, shot: 'closeup' },
  { name: 'SHIBUYA-SPOTTER', message: 'crossed with the crowd and NOBODY looked up. very tokyo of them honestly', place: 'SHIBUYA CROSSING, JP', lat: 35.6595, lng: 139.7004, photo: true, shot: 'skyline' },
  { name: 'BAGUETTE-BANDIT', message: 'a man dropped an entire croissant. that pastry is a casualty of war. rip king', place: 'EIFFEL TOWER, FR', lat: 48.8584, lng: 2.2945, photo: true, shot: 'skyline' },
  { name: 'THAMES-TOM', message: 'hanging off big ben at 3am asking if anyone had a charger. we are the same', place: 'BIG BEN, UK', lat: 51.5007, lng: -0.1246, photo: true, shot: 'blurry' },
  { name: 'CRISTO-CAM', message: 'sat on the shoulder for ten minutes just looking at the view. no thoughts. head empty', place: 'CHRIST THE REDEEMER, BR', lat: -22.9519, lng: -43.2105, photo: true, shot: 'skyline' },
  { name: 'QUEENS-KID-04', message: 'bro was on my fire escape. i said hi. he said hi. i have not slept since', place: 'QUEENS, US', lat: 40.7282, lng: -73.7949, photo: true, shot: 'closeup' },
  { name: 'DUNE-RUNNER-9', message: 'went up the burj without stopping ONCE. meanwhile i take the elevator to floor 2', place: 'BURJ KHALIFA, AE', lat: 25.1972, lng: 55.2744, photo: true, shot: 'skyline' },
  { name: 'OPERA-OMAR', message: 'perched on the sails at sunset. the seagulls filed a formal complaint', place: 'SYDNEY OPERA HOUSE, AU', lat: -33.8568, lng: 151.2153, photo: true, shot: 'rooftop' },
  { name: 'MISSION-MARA', message: 'he swung past the taqueria and i SWEAR he looked at my burrito. not today', place: 'SAN FRANCISCO, US', lat: 37.7599, lng: -122.4148, photo: true, shot: 'blurry' },
  { name: 'TIMES-SQ-TARA', message: 'sitting on a billboard. the billboard was an ad for spider-man. let that sink in', place: 'TIMES SQUARE, US', lat: 40.758, lng: -73.9855, photo: true, shot: 'skyline' },
  { name: 'ZOCALO-ZARA', message: 'swung across the square and a mariachi band started playing UNPROMPTED. cinema', place: 'MEXICO CITY, MX', lat: 19.4326, lng: -99.1332, photo: true, shot: 'rooftop' },

  /* ── Wave 2: later that night ─────────────────────────────────────── */
  { name: 'GATE-KEEPER-77', message: 'ran a full mile along the wall then vanished into fog. he understood the assignment', place: 'GREAT WALL, CN', lat: 40.4319, lng: 116.5704, photo: true, shot: 'skyline' },
  { name: 'COLOSSEUM-CIRO', message: 'doing flips in the arena like he was auditioning. nobody asked but ok', place: 'COLOSSEUM, IT', lat: 41.8902, lng: 12.4922, photo: true, shot: 'rooftop' },
  { name: 'TOWER-TILLY', message: 'edgewalk. NO harness. this is not the flex he thinks it is', place: 'CN TOWER, CA', lat: 43.6426, lng: -79.3871, photo: true, shot: 'skyline' },
  { name: 'ANDES-ANA', message: 'caught him resting on the steps. said the altitude is rough. FINALLY something we share', place: 'MACHU PICCHU, PE', lat: -13.1631, lng: -72.545, photo: true, shot: 'rooftop' },
  { name: 'LAGOS-LEKAN', message: 'third mainland bridge during traffic. fastest commute in the city and it is not close', place: 'LAGOS, NG', lat: 6.5244, lng: 3.3792, photo: true, shot: 'skyline' },
  { name: 'TAJ-TARA', message: 'cross legged on the dome at sunrise like he pays rent there. the audacity', place: 'TAJ MAHAL, IN', lat: 27.1751, lng: 78.0421, photo: true, shot: 'rooftop' },
  { name: 'BRIDGE-BENNY', message: 'swung under the golden gate and the fog just ATE him. gone. no notes', place: 'GOLDEN GATE BRIDGE, US', lat: 37.8199, lng: -122.4783, photo: true, shot: 'blurry' },
  { name: 'MARINA-MO', message: 'webbed between the towers and tourists thought it was part of the light show LMAO', place: 'MARINA BAY SANDS, SG', lat: 1.2834, lng: 103.8607, photo: true, shot: 'skyline' },
  { name: 'SEOUL-SUNNY', message: 'tying a love lock on namsan tower. FOR WHO. sir who is she', place: 'N SEOUL TOWER, KR', lat: 37.5512, lng: 126.9882, photo: true, shot: 'closeup' },
  { name: 'PYRAMID-PARI', message: 'stood on the actual top and the tour guide pretended not to see it. real ones know', place: 'GIZA PYRAMIDS, EG', lat: 29.9792, lng: 31.1342, photo: true, shot: 'skyline' },
  { name: 'BOSPHORUS-BEY', message: 'crossed two continents in four seconds. my bus takes 40 minutes for one bridge', place: 'ISTANBUL, TR', lat: 41.0451, lng: 29.0335, photo: true, shot: 'rooftop' },
  { name: 'AMSTEL-ARIE', message: 'borrowed a bike, rode it ONE block, put it back exactly where it was. a gentleman', place: 'AMSTERDAM, NL', lat: 52.3676, lng: 4.9041, photo: true, shot: 'closeup' },
  { name: 'SAGRADA-SAM', message: 'climbed a spire that is still under construction. bold. structurally questionable', place: 'BARCELONA, ES', lat: 41.4036, lng: 2.1744, photo: true, shot: 'skyline' },
  { name: 'TABLE-TOP-TESS', message: 'hanging off the cable car line waving at everyone inside. main character behavior', place: 'CAPE TOWN, ZA', lat: -33.9628, lng: 18.4098, photo: true, shot: 'rooftop' },
  { name: 'VEGAS-VIC', message: 'on the sphere. for ONE second the whole thing showed a spider. coincidence??? i think NOT', place: 'LAS VEGAS, US', lat: 36.1215, lng: -115.1678, photo: true, shot: 'skyline' },
  { name: 'CHI-TOWN-CJ', message: 'staring at himself in the bean for a solid minute. we are so alike it hurts', place: 'CHICAGO, US', lat: 41.8827, lng: -87.6233, photo: true, shot: 'closeup' },

  /* ── Wave 3: next day, calmer ─────────────────────────────────────── */
  { name: 'RED-SQUARE-ROB', message: 'on the onion domes. gone before anyone focused a camera. caught in 0k', place: 'MOSCOW, RU', lat: 55.7539, lng: 37.6208, photo: true, shot: 'blurry' },
  { name: 'PARTHENON-PIA', message: 'sitting on the steps at dusk like he paid admission. he did not pay admission', place: 'ATHENS, GR', lat: 37.9715, lng: 23.7267, photo: true, shot: 'rooftop' },
  { name: 'REYKJAVIK-RUNE', message: 'just standing there watching the northern lights. didnt say anything. felt rude to interrupt', place: 'REYKJAVIK, IS', lat: 64.1466, lng: -21.9426, photo: true, shot: 'skyline' },
  { name: 'PRAGUE-PETRA', message: 'running along charles bridge at midnight. the statues saw everything and said nothing', place: 'PRAGUE, CZ', lat: 50.0865, lng: 14.4114, photo: true, shot: 'blurry' },
  { name: 'HALONG-HUY', message: 'jumping between the rocks. every single boat stopped. free show honestly', place: 'HA LONG BAY, VN', lat: 20.9101, lng: 107.1839, photo: true, shot: 'rooftop' },
  { name: 'NAIROBI-NIA', message: 'on the kicc helipad at golden hour. said its the best view in the city. he is right', place: 'NAIROBI, KE', lat: -1.2884, lng: 36.8233, photo: true, shot: 'skyline' },
  { name: 'BERLIN-BIRGIT', message: 'on top of the tv tower. just sitting. for like an hour. king of doing nothing', place: 'BERLIN, DE', lat: 52.5208, lng: 13.4094, photo: true, shot: 'rooftop' },
  { name: 'PATAGONIA-PAZ', message: 'on a glacier. in the suit. NO jacket. bro is built different and i am cold just watching', place: 'PATAGONIA, AR', lat: -50.4967, lng: -73.1377, photo: true, shot: 'skyline' },
  { name: 'MUMBAI-MEERA', message: 'gateway of india at sunrise. the pigeons lost their entire minds', place: 'MUMBAI, IN', lat: 18.922, lng: 72.8347, photo: true, shot: 'closeup' },
  { name: 'BANGKOK-BOON', message: 'saw him near the temple. or i saw a very fast red thing. same energy tbh', place: 'BANGKOK, TH', lat: 13.7524, lng: 100.4935, photo: true, shot: 'blurry' },

  /* ── Wave 4: tail end, quiet ──────────────────────────────────────── */
  { name: 'DUBLIN-DEE', message: 'ha penny bridge. 6am. nobody awake to see it except me and a very confused swan', place: 'DUBLIN, IE', lat: 53.3465, lng: -6.2632, photo: true, shot: 'blurry' },
  { name: 'OSLO-OVE', message: 'walked down the opera house roof like a normal person. weirdly the strangest part', place: 'OSLO, NO', lat: 59.9075, lng: 10.7529 },
  { name: 'LIMA-LUCHO', message: 'on the cliffs just watching the surfers. not helping. just watching.', place: 'LIMA, PE', lat: -12.1315, lng: -77.0303, photo: true, shot: 'rooftop' },
  { name: 'WARSAW-WIKTOR', message: 'old town square. gone in a second. my photo is one (1) blurry red pixel', place: 'WARSAW, PL', lat: 52.2497, lng: 21.0122, photo: true, shot: 'blurry' },
  { name: 'PERTH-PIP', message: 'kings park, quiet morning, barely anyone around. still counts. i was there.', place: 'PERTH, AU', lat: -31.9614, lng: 115.8342 },
  { name: 'MONTREAL-MAX', message: 'up on the cross at night doing absolutely nothing. relatable king', place: 'MONTREAL, CA', lat: 45.5048, lng: -73.5878, photo: true, shot: 'skyline' },
  { name: 'HELSINKI-HANNA', message: 'cathedral steps. snowing. he looked cold. somebody get this man a coat', place: 'HELSINKI, FI', lat: 60.1699, lng: 24.9384, photo: true, shot: 'closeup' },
];
