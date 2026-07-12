import AsyncStorage from '@react-native-async-storage/async-storage';

// Tiny wrapper around device storage. Everything is saved as JSON.
const KEYS = { profile: 'atlas.profile', trips: 'atlas.trips', stamps: 'atlas.stamps', theme: 'atlas.theme' };

async function getJSON(key) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
async function setJSON(key, val) {
  try { await AsyncStorage.setItem(key, JSON.stringify(val)); } catch {}
}

export const loadProfile = () => getJSON(KEYS.profile);
export const saveProfile = (p) => setJSON(KEYS.profile, p);
export const loadTrips = () => getJSON(KEYS.trips);
export const saveTrips = (trips) => setJSON(KEYS.trips, trips);
export const loadStamps = () => getJSON(KEYS.stamps);
export const saveStamps = (s) => setJSON(KEYS.stamps, s);
export const loadTheme = () => getJSON(KEYS.theme);
export const saveTheme = (mode) => setJSON(KEYS.theme, mode);

export async function clearAll() {
  try { await AsyncStorage.multiRemove(Object.values(KEYS)); } catch {}
}
