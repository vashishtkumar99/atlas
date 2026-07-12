// Small helpers shared across screens.

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export function fmtDay(d) {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  return `${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

export function fmtStampDate(d) {
  const date = typeof d === 'string' ? new Date(d) : (d || new Date());
  return `${String(date.getDate()).padStart(2, '0')} ${MONTHS[date.getMonth()].toUpperCase()} ${date.getFullYear()}`;
}

// Great-circle distance between two [lon, lat] points, in km.
export function haversineKm(a, b) {
  if (!a || !b) return 0;
  const R = 6371;
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(b[1] - a[1]);
  const dLon = toRad(b[0] - a[0]);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[1])) * Math.cos(toRad(b[1])) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function countryOf(trip) {
  if (trip.country) return trip.country;
  const parts = (trip.city || '').split(',');
  return parts.length > 1 ? parts[parts.length - 1].trim() : null;
}

/* ---------- trips with legs ---------- */
// Every trip is a list of legs. Old single-city trips are wrapped in one leg.
export function legsOf(trip) {
  if (trip.legs && trip.legs.length) return trip.legs;
  return [{ city: trip.city, ll: trip.ll || null, country: countryOf(trip), mode: trip.mode || 'plane' }];
}

export function normalizeTrip(trip) {
  return { ...trip, legs: legsOf(trip) };
}

export function originOf(trip, profile) {
  if (trip.origin && trip.origin.city) return trip.origin;
  if (trip.routeFrom === 'MIL') return { city: 'Milan, Italy', ll: [9.19, 45.46] };
  if (profile && profile.homeCity) return { city: profile.homeCity, ll: profile.homeLL || null };
  return { city: 'Home', ll: null };
}

// [{from:{city,ll}, to:{city,ll,country,mode}}] — one per leg
export function segmentsOf(trip, profile) {
  const legs = legsOf(trip);
  const segs = [];
  let prev = originOf(trip, profile);
  for (const leg of legs) {
    segs.push({ from: prev, to: leg });
    prev = { city: leg.city, ll: leg.ll };
  }
  return segs;
}

export function tripKm(trip, profile) {
  return segmentsOf(trip, profile).reduce(
    (s, seg) => s + (seg.from.ll && seg.to.ll ? haversineKm(seg.from.ll, seg.to.ll) : 0), 0
  );
}

export function tripCountries(trip) {
  return legsOf(trip).map((l) => l.country).filter(Boolean);
}

export function tripYear(trip) {
  return trip.fromISO ? String(new Date(trip.fromISO).getFullYear()) : null;
}

/* ---------- geography → continents ---------- */
export function llToContinent(ll) {
  if (!ll) return null;
  const [lon, lat] = ll;
  if (lat < -60) return 'Antarctica';
  if ((lon >= 110 && lat <= -8) || (lon >= 160 && lat <= 0)) return 'Oceania';
  if (lon >= 60 && lat > -12) return 'Asia';
  if (lon >= 40 && lon < 60 && lat >= 12) return 'Asia';
  if (lon >= 34 && lon < 40 && lat >= 29 && lat <= 37) return 'Asia'; // Levant
  if (lat > 36 && lon >= -25 && lon < 60) return 'Europe';
  if (lon >= -20 && lon <= 52 && lat <= 36) return 'Africa';
  if (lon <= -30 && lat >= 7) return 'North America';
  if (lon <= -34 && lat < 7) return 'South America';
  return 'Asia';
}

/* ---------- badges (all computed from real trips) ---------- */
const CONTINENT_ICONS = {
  Europe: 'compass', Asia: 'sun', Africa: 'mountain',
  'North America': 'pin', 'South America': 'island', Oceania: 'ferry',
};

export function computeBadges(trips, profile) {
  const allLegs = trips.flatMap((tr) => legsOf(tr));
  const continents = new Set(allLegs.map((l) => llToContinent(l.ll)).filter((c) => c && c !== 'Antarctica'));
  const countries = new Set(allLegs.map((l) => l.country).filter(Boolean));
  const totalKm = trips.reduce((s, tr) => s + tripKm(tr, profile), 0);
  const maxSegKm = trips.reduce((mx, tr) => {
    for (const seg of segmentsOf(tr, profile)) {
      if (seg.from.ll && seg.to.ll) mx = Math.max(mx, haversineKm(seg.from.ll, seg.to.ll));
    }
    return mx;
  }, 0);

  const badges = [];
  for (const [cont, icon] of Object.entries(CONTINENT_ICONS)) {
    const done = continents.has(cont);
    badges.push({
      id: `cont-${cont}`, name: `${cont === 'North America' ? 'N. America' : cont === 'South America' ? 'S. America' : cont} Explorer`,
      icon, done, progress: done ? 100 : 0,
      sub: done ? 'Unlocked' : `Reach ${cont}`,
    });
  }
  const milestones = [
    ['First Stamp', 1, 'flag'], ['Wayfarer', 3, 'star'], ['Globetrotter', 10, 'compass'], ['World Citizen', 25, 'book'],
  ];
  for (const [name, target, icon] of milestones) {
    const n = countries.size;
    badges.push({
      id: `mile-${target}`, name, icon,
      done: n >= target,
      progress: Math.min(100, Math.round((n / target) * 100)),
      sub: n >= target ? 'Unlocked' : `${n} of ${target} countries`,
    });
  }
  badges.push({
    id: 'longhaul', name: 'Long Hauler', icon: 'plane',
    done: maxSegKm >= 5000,
    progress: Math.min(100, Math.round((maxSegKm / 5000) * 100)),
    sub: maxSegKm >= 5000 ? 'A 5,000 km leg' : `Longest leg ${Math.round(maxSegKm).toLocaleString()} km`,
  });
  badges.push({
    id: 'aroundworld', name: 'Around the World', icon: 'ferry',
    done: totalKm >= 40075,
    progress: Math.min(100, Math.round((totalKm / 40075) * 100)),
    sub: totalKm >= 40075 ? "Earth's full circle" : `${Math.round(totalKm).toLocaleString()} of 40,075 km`,
  });

  return badges.sort((a, b) => (b.done - a.done) || (b.progress - a.progress));
}
