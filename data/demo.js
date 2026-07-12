// Starter trips so the app feels alive on first open. All editable.
export const INITIAL_TRIPS = [
  {
    id: 'florence',
    origin: { city: 'Milan, Italy', ll: [9.19, 45.46] },
    legs: [{ city: 'Florence, Italy', ll: [11.25, 43.77], country: 'Italy', mode: 'train' }],
    city: 'Florence, Italy', country: 'Italy', ll: [11.25, 43.77],
    dates: 'Jun 5 – Jun 11',
    fromISO: '2026-06-05T12:00:00.000Z', toISO: '2026-06-11T12:00:00.000Z',
    mode: 'train', modeWord: 'By train',
    pills: ['31° sunny'],
    rating: 4.8, journal: 'Climbed the Duomo at sunset. 463 steps, worth every single one.',
    wouldReturn: true,
    routeFrom: 'MIL', routeTo: 'FLR',
    skyline: 'florence',
    openable: true,
  },
  {
    id: 'nyc',
    user: true,
    origin: null, // defaults to your home base
    legs: [{ city: 'New York, United States', ll: [-74.01, 40.71], country: 'United States', mode: 'plane' }],
    city: 'New York, United States', country: 'United States', ll: [-74.01, 40.71],
    dates: 'Mar 9 – Mar 14',
    fromISO: '2026-03-09T12:00:00.000Z', toISO: '2026-03-14T12:00:00.000Z',
    mode: 'plane', modeWord: 'By air',
    pills: ['Bagels every morning'],
    rating: 4, journal: 'Walked the High Line at dusk, city glowing on both sides.',
    wouldReturn: true,
    skyline: 'new',
  },
  {
    id: 'kolkata',
    user: true,
    origin: null,
    legs: [{ city: 'Kolkata, India', ll: [88.36, 22.56], country: 'India', mode: 'plane' }],
    city: 'Kolkata, India', country: 'India', ll: [88.36, 22.56],
    dates: 'Dec 18 – Dec 29',
    fromISO: '2025-12-18T12:00:00.000Z', toISO: '2025-12-29T12:00:00.000Z',
    mode: 'plane', modeWord: 'By air',
    pills: ['Kathi rolls at Park Street'],
    rating: 5, journal: 'Winter in Kolkata — mishti doi, yellow taxis, and the Howrah Bridge at night.',
    wouldReturn: true,
    skyline: 'new',
  },
];

// One stamp per starter country. New countries mint automatically.
export const INITIAL_STAMPS = [
  { id: 'stamp-italy', country: 'Italy', via: 'Arrived by train', date: '05 JUN 2026', mode: 'train', rot: '-3deg' },
  { id: 'stamp-us', country: 'United States', via: 'Arrived by air', date: '09 MAR 2026', mode: 'plane', rot: '3deg' },
  { id: 'stamp-india', country: 'India', via: 'Arrived by air', date: '18 DEC 2025', mode: 'plane', rot: '-2deg' },
];

export const MEMORIES = [
  { id: 'm1', caption: 'Florence', variant: 'duomo', tilt: '-2deg' },
  { id: 'm2', caption: 'Lisbon', variant: 'coast', tilt: '1.5deg' },
  { id: 'm3', caption: 'Paris', variant: 'tower', tilt: '-1deg' },
];

export const SEARCH_DATA = [
  { t: 'Florence, Italy', s: 'By train, June 2026 — rated 4.8', kind: 'city', icon: 'pin', open: true },
  { t: 'New York, United States', s: 'By air, March 2026', kind: 'city', icon: 'pin' },
  { t: 'Kolkata, India', s: 'By air, December 2025', kind: 'city', icon: 'pin' },
  { t: 'A week in Florence', s: 'The Duomo at sunset, 463 steps', kind: 'trip', icon: 'book', open: true },
  { t: 'Milan to Florence', s: '298 km by train, window seat', kind: 'journey', icon: 'train', open: true },
  { t: 'Gelateria dei Neri', s: 'Best bite in Florence', kind: 'place', icon: 'cup', open: true },
];

export const MODE_WORD = { plane: 'By air', train: 'By train', car: 'By road', ferry: 'By ferry', walk: 'On foot' };
