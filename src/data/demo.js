export const INITIAL_TRIPS = [
  {
    id: 'florence',
    city: 'Florence, Italy',
    dates: 'June 5 – 11',
    mode: 'train',
    modeWord: 'By train',
    pills: ['31° sunny', '4.8'],
    routeFrom: 'MIL',
    routeTo: 'FLR',
    skyline: 'florence',
    openable: true,
  },
];

export const JOURNEYS = [
  { id: 'j1', from: 'Milan', to: 'Florence', mode: 'train', sub: '298 km · 1h 55m · Frecciarossa', note: 'window seat, of course', openable: true },
  { id: 'j2', from: 'Lisbon', to: 'Cacilhas', mode: 'ferry', sub: '2.1 km · 12m · across the Tagus', note: 'golden hour crossing' },
  { id: 'j3', from: 'Reykjavik', to: 'Vik', mode: 'car', sub: '186 km · 2h 30m · Ring Road', note: 'stopped at every waterfall' },
  { id: 'j4', from: 'Paris', to: 'Montmartre', mode: 'walk', sub: '4.8 km · a slow afternoon', note: 'got lost on purpose' },
];

export const STAMPS = [
  { id: 's1', country: 'France', via: 'arrived by train', date: '14 MAY 2025', mode: 'train', rot: '-4deg' },
  { id: 's2', country: 'Italy', via: 'arrived by train', date: '05 JUN 2026', mode: 'train', rot: '3deg' },
  { id: 's3', country: 'Japan', via: 'arrived by air', date: '02 NOV 2025', mode: 'plane', rot: '-2deg' },
  { id: 's4', country: 'Iceland', via: 'arrived by air', date: '19 FEB 2026', mode: 'plane', rot: '4deg' },
];

export const PORTUGAL_STAMP = { id: 's5', country: 'Portugal', via: 'arrived by ferry', date: '09 JUL 2026', mode: 'ferry', rot: '-3deg' };

export const BADGES = [
  { id: 'b1', name: 'Peak Seeker', progress: 100, sub: 'earned in Iceland', icon: 'mountain', done: true },
  { id: 'b2', name: 'Island Hopper', progress: 43, sub: '3 of 7 islands', icon: 'island' },
  { id: 'b3', name: 'Rail Rider', progress: 36, sub: '18 of 50 rides', icon: 'train' },
  { id: 'b4', name: 'Café Collector', progress: 41, sub: '41 of 100 cafés', icon: 'cup' },
];

export const MEMORIES = [
  { id: 'm1', caption: 'Florence', variant: 'duomo', tilt: '-2deg' },
  { id: 'm2', caption: 'Lisbon', variant: 'coast', tilt: '1.5deg' },
  { id: 'm3', caption: 'Paris', variant: 'tower', tilt: '-1deg' },
];

export const SEARCH_DATA = [
  { t: 'Florence, Italy', s: 'by train, June 2026 — rated 4.8', kind: 'city', icon: 'pin', open: true },
  { t: 'Lisbon, Portugal', s: 'by ferry, April 2026', kind: 'city', icon: 'pin' },
  { t: 'Paris, France', s: 'first arrived by train, May 2025', kind: 'city', icon: 'pin' },
  { t: 'Tokyo, Japan', s: 'by air, November 2025', kind: 'city', icon: 'pin' },
  { t: 'Reykjavik, Iceland', s: 'by air, February 2026', kind: 'city', icon: 'pin' },
  { t: 'A week in Florence', s: 'the Duomo at sunset, 463 steps', kind: 'trip', icon: 'book', open: true },
  { t: 'Lisbon by the sea', s: 'golden hour ferry crossing', kind: 'trip', icon: 'book' },
  { t: 'Milan to Florence', s: '298 km by train, window seat', kind: 'journey', icon: 'train', open: true },
  { t: 'Reykjavik to Vik', s: 'Ring Road, every waterfall', kind: 'journey', icon: 'car' },
  { t: 'Gelateria dei Neri', s: 'best bite in Florence', kind: 'place', icon: 'cup', open: true },
];

export const MODE_WORD = { plane: 'By air', train: 'By train', car: 'By road', ferry: 'By ferry', walk: 'On foot' };
