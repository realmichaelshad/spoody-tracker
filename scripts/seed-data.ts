/**
 * Opening-week sightings — the house's own posts.
 *
 * Invented codenames at real, recognisable places. Written the way actual
 * people post: uneven length, some jokes, some flat observations, a few
 * that are barely anything. Nothing here impersonates a real person or
 * uses anyone's artwork.
 *
 * `photo` is an optional generated pixel image (see makePhoto in seed.ts) —
 * not a scraped picture of anything real.
 */
export interface Seed {
  name: string;
  message: string;
  place: string;
  lat: number;
  lng: number;
  /** give this one a generated image */
  photo?: boolean;
}

export const SEEDS: Seed[] = [
  /* ── Wave 1: launch night, big cities, the loudest ones ───────────── */
  { name: 'ROOFTOP-RITA', message: 'HE LANDED ON THE OBSERVATION DECK, WAVED, AND LEFT. SECURITY IS STILL CONFUSED.', place: 'EMPIRE STATE BUILDING, US', lat: 40.7484, lng: -73.9857, photo: true },
  { name: 'BODEGA-BEN', message: 'MY GUY BOUGHT A BACON EGG AND CHEESE AND PAID IN EXACT CHANGE. NEW YORKER CONFIRMED', place: 'BROOKLYN, US', lat: 40.6782, lng: -73.9442 },
  { name: 'SHIBUYA-SPOTTER', message: 'CROSSED WITH THE CROWD. NOBODY LOOKED UP. VERY TOKYO OF THEM.', place: 'SHIBUYA CROSSING, JP', lat: 35.6595, lng: 139.7004, photo: true },
  { name: 'BAGUETTE-BANDIT', message: 'SWUNG PAST THE SECOND FLOOR AND A MAN DROPPED HIS ENTIRE CROISSANT. RIP', place: 'EIFFEL TOWER, FR', lat: 48.8584, lng: 2.2945, photo: true },
  { name: 'THAMES-TOM', message: 'HANGING OFF BIG BEN AT 3AM ASKING IF ANYONE HAD A PHONE CHARGER', place: 'BIG BEN, UK', lat: 51.5007, lng: -0.1246 },
  { name: 'CRISTO-CAM', message: 'SAT ON THE SHOULDER FOR TEN MINUTES JUST LOOKING AT THE VIEW. mood honestly', place: 'CHRIST THE REDEEMER, BR', lat: -22.9519, lng: -43.2105, photo: true },
  { name: 'QUEENS-KID-04', message: 'bro was on my fire escape. i said hi. he said hi. i have not slept since', place: 'QUEENS, US', lat: 40.7282, lng: -73.7949 },
  { name: 'DUNE-RUNNER-9', message: 'WEBBED STRAIGHT UP THE SIDE OF THE BURJ. DID NOT STOP ONCE. NOT ONCE.', place: 'BURJ KHALIFA, AE', lat: 25.1972, lng: 55.2744, photo: true },
  { name: 'OPERA-OMAR', message: 'PERCHED ON THE SAILS AT SUNSET. THE SEAGULLS WERE NOT HAPPY ABOUT IT', place: 'SYDNEY OPERA HOUSE, AU', lat: -33.8568, lng: 151.2153 },
  { name: 'MISSION-MARA', message: 'he swung past taqueria and i swear he looked at my burrito', place: 'SAN FRANCISCO, US', lat: 37.7599, lng: -122.4148 },
  { name: 'TIMES-SQ-TARA', message: 'ON THE BILLBOARD. THE BILLBOARD WAS AN AD FOR SPIDER-MAN. LET THAT SINK IN', place: 'TIMES SQUARE, US', lat: 40.758, lng: -73.9855, photo: true },
  { name: 'ZOCALO-ZARA', message: 'SWUNG ACROSS THE SQUARE AND A MARIACHI BAND STARTED PLAYING. CINEMA.', place: 'MEXICO CITY, MX', lat: 19.4326, lng: -99.1332 },

  /* ── Wave 2: still busy, more variety, quieter voices mixed in ───── */
  { name: 'GATE-KEEPER-77', message: 'RAN ALONG THE WALL FOR ABOUT A MILE THEN VANISHED INTO THE FOG', place: 'GREAT WALL, CN', lat: 40.4319, lng: 116.5704, photo: true },
  { name: 'COLOSSEUM-CIRO', message: 'DOING FLIPS IN THE ARENA LIKE HE WAS AUDITIONING FOR SOMETHING', place: 'COLOSSEUM, IT', lat: 41.8902, lng: 12.4922 },
  { name: 'TOWER-TILLY', message: 'ON THE CN TOWER EDGEWALK. NO HARNESS. SHOW OFF.', place: 'CN TOWER, CA', lat: 43.6426, lng: -79.3871, photo: true },
  { name: 'ANDES-ANA', message: 'CAUGHT HIM RESTING ON THE STONE STEPS. SAID THE ALTITUDE IS ROUGH. relatable', place: 'MACHU PICCHU, PE', lat: -13.1631, lng: -72.545 },
  { name: 'LAGOS-LEKAN', message: 'THIRD MAINLAND BRIDGE DURING TRAFFIC. HONESTLY THE FASTEST COMMUTE IN THE CITY', place: 'LAGOS, NG', lat: 6.5244, lng: 3.3792 },
  { name: 'TAJ-TARA', message: 'SITTING CROSS-LEGGED ON THE DOME AT SUNRISE. HONESTLY? PEACEFUL.', place: 'TAJ MAHAL, IN', lat: 27.1751, lng: 78.0421, photo: true },
  { name: 'BRIDGE-BENNY', message: 'SWUNG UNDER THE GOLDEN GATE AND THE FOG ATE HIM WHOLE', place: 'GOLDEN GATE BRIDGE, US', lat: 37.8199, lng: -122.4783 },
  { name: 'MARINA-MO', message: 'WEBBED BETWEEN THE TOWERS. TOURISTS THOUGHT IT WAS PART OF THE LIGHT SHOW', place: 'MARINA BAY SANDS, SG', lat: 1.2834, lng: 103.8607, photo: true },
  { name: 'SEOUL-SUNNY', message: 'ON NAMSAN TOWER TYING A LOVE LOCK. FOR WHO. FOR WHO??', place: 'N SEOUL TOWER, KR', lat: 37.5512, lng: 126.9882 },
  { name: 'PYRAMID-PARI', message: 'STOOD ON THE VERY TOP. THE TOUR GUIDE PRETENDED NOT TO SEE IT', place: 'GIZA PYRAMIDS, EG', lat: 29.9792, lng: 31.1342, photo: true },
  { name: 'BOSPHORUS-BEY', message: 'CROSSED BETWEEN TWO CONTINENTS IN ABOUT FOUR SECONDS', place: 'ISTANBUL, TR', lat: 41.0451, lng: 29.0335 },
  { name: 'AMSTEL-ARIE', message: 'HE BORROWED A BIKE, RODE IT ONE BLOCK, AND PUT IT BACK EXACTLY WHERE IT WAS', place: 'AMSTERDAM, NL', lat: 52.3676, lng: 4.9041 },
  { name: 'SAGRADA-SAM', message: 'CLIMBED A SPIRE THAT IS STILL UNDER CONSTRUCTION. BOLD CHOICE HONESTLY', place: 'BARCELONA, ES', lat: 41.4036, lng: 2.1744 },
  { name: 'TABLE-TOP-TESS', message: 'ON THE CABLE CAR LINE ABOVE THE CITY. WAVED AT THE WHOLE CAR.', place: 'CAPE TOWN, ZA', lat: -33.9628, lng: 18.4098, photo: true },
  { name: 'VEGAS-VIC', message: 'ON THE SPHERE. FOR ONE SECOND THE WHOLE THING SHOWED A SPIDER. COINCIDENCE???', place: 'LAS VEGAS, US', lat: 36.1215, lng: -115.1678, photo: true },
  { name: 'CHI-TOWN-CJ', message: 'THE BEAN. HE WAS LOOKING AT HIS REFLECTION IN THE BEAN. we are the same', place: 'CHICAGO, US', lat: 41.8827, lng: -87.6233 },

  /* ── Wave 3: next day, thinning out ──────────────────────────────── */
  { name: 'RED-SQUARE-ROB', message: 'ON THE ONION DOMES. GONE BEFORE ANYONE COULD FOCUS A CAMERA', place: 'MOSCOW, RU', lat: 55.7539, lng: 37.6208 },
  { name: 'PARTHENON-PIA', message: 'SITTING ON THE STEPS AT DUSK LIKE HE PAID ADMISSION', place: 'ATHENS, GR', lat: 37.9715, lng: 23.7267, photo: true },
  { name: 'REYKJAVIK-RUNE', message: 'WATCHING THE NORTHERN LIGHTS. JUST STANDING THERE. DIDNT SAY ANYTHING.', place: 'REYKJAVIK, IS', lat: 64.1466, lng: -21.9426 },
  { name: 'PRAGUE-PETRA', message: 'RUNNING ALONG CHARLES BRIDGE AT MIDNIGHT. THE STATUES SAW EVERYTHING', place: 'PRAGUE, CZ', lat: 50.0865, lng: 14.4114 },
  { name: 'HALONG-HUY', message: 'JUMPING BETWEEN THE LIMESTONE ROCKS. EVERY BOAT STOPPED TO WATCH.', place: 'HA LONG BAY, VN', lat: 20.9101, lng: 107.1839, photo: true },
  { name: 'NAIROBI-NIA', message: 'ON THE KICC HELIPAD AT GOLDEN HOUR. BEST VIEW IN THE CITY HE SAID', place: 'NAIROBI, KE', lat: -1.2884, lng: 36.8233 },
  { name: 'BERLIN-BIRGIT', message: 'on top of the tv tower. just sitting. for like an hour.', place: 'BERLIN, DE', lat: 52.5208, lng: 13.4094 },
  { name: 'PATAGONIA-PAZ', message: 'ON A GLACIER. IN THE SUIT. NO JACKET. THE MAN IS BUILT DIFFERENT', place: 'PATAGONIA, AR', lat: -50.4967, lng: -73.1377, photo: true },
  { name: 'MUMBAI-MEERA', message: 'GATEWAY OF INDIA, EARLY MORNING. THE PIGEONS LOST THEIR MINDS', place: 'MUMBAI, IN', lat: 18.922, lng: 72.8347 },
  { name: 'BANGKOK-BOON', message: 'saw him near the temple. or i saw a very fast red thing. same energy', place: 'BANGKOK, TH', lat: 13.7524, lng: 100.4935 },

  /* ── Wave 4: tail end, sparse and low-key ────────────────────────── */
  { name: 'DUBLIN-DEE', message: 'ha penny bridge. 6am. nobody else was awake to see it.', place: 'DUBLIN, IE', lat: 53.3465, lng: -6.2632 },
  { name: 'OSLO-OVE', message: 'ON THE OPERA HOUSE ROOF. WALKED DOWN THE SLOPE LIKE A NORMAL PERSON.', place: 'OSLO, NO', lat: 59.9075, lng: 10.7529 },
  { name: 'LIMA-LUCHO', message: 'cliffs by the water. he was just watching the surfers.', place: 'LIMA, PE', lat: -12.1315, lng: -77.0303 },
  { name: 'WARSAW-WIKTOR', message: 'OLD TOWN SQUARE. GONE IN A SECOND. MY PHOTO IS ONE BLURRY RED PIXEL', place: 'WARSAW, PL', lat: 52.2497, lng: 21.0122 },
  { name: 'PERTH-PIP', message: 'kings park. quiet morning. barely anyone around. still counts.', place: 'PERTH, AU', lat: -31.9614, lng: 115.8342 },
  { name: 'MONTREAL-MAX', message: 'up on the cross at night. didnt do anything. just sat there.', place: 'MONTREAL, CA', lat: 45.5048, lng: -73.5878 },
  { name: 'HELSINKI-HANNA', message: 'CATHEDRAL STEPS. SNOWING. HE LOOKED COLD HONESTLY.', place: 'HELSINKI, FI', lat: 60.1699, lng: 24.9384 },
];
