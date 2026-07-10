import AsyncStorage from '@react-native-async-storage/async-storage';

// Tiny wrapper around device storage. Everything is saved as JSON.
const KEYS = { profile: 'atlas.profile', trips: 'atlas.trips' };

export async function loadProfile() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.profile);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export async function saveProfile(profile) {
  try { await AsyncStorage.setItem(KEYS.profile, JSON.stringify(profile)); } catch {}
}

export async function loadTrips() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.trips);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export async function saveTrips(trips) {
  try { await AsyncStorage.setItem(KEYS.trips, JSON.stringify(trips)); } catch {}
}

export async function clearAll() {
  try { await AsyncStorage.multiRemove(Object.values(KEYS)); } catch {}
}
