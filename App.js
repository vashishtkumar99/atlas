import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_500Medium_Italic,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';

import { palettes, fonts } from './src/theme';
import Icon from './src/components/Icons';
import HomeScreen from './src/screens/HomeScreen';
import PassportScreen from './src/screens/PassportScreen';
import TransportScreen from './src/screens/TransportScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import {
  SearchModal, AddTripSheet, DetailSheet,
  UserTripDetail, CountryTripsModal, ProfileModal,
} from './src/components/modals';
import { INITIAL_TRIPS, INITIAL_STAMPS, MEMORIES } from './src/data/demo';
import {
  loadProfile, saveProfile, loadTrips, saveTrips,
  loadStamps, saveStamps, loadTheme, saveTheme, clearAll,
} from './src/storage';
import { fmtStampDate, normalizeTrip, legsOf } from './src/utils';

const TABS = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'passport', label: 'Passport', icon: 'book' },
  { key: 'journeys', label: 'Journeys', icon: 'plane' },
];
const ROTS = ['-4deg', '3deg', '-2deg', '4deg', '-3deg', '2deg'];

export default function App() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_500Medium_Italic,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  const [booted, setBooted] = useState(false);
  const [profile, setProfile] = useState(null);
  const [dark, setDark] = useState(true);
  const [tab, setTab] = useState('home');
  const [searchOpen, setSearchOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [userTrip, setUserTrip] = useState(null);      // trip open in UserTripDetail
  const [countryOpen, setCountryOpen] = useState(null); // country whose trips are shown
  const [profileOpen, setProfileOpen] = useState(false);
  const [trips, setTrips] = useState(INITIAL_TRIPS);
  const [stamps, setStamps] = useState(INITIAL_STAMPS);
  const [newStampId, setNewStampId] = useState(null);
  const [memories, setMemories] = useState(MEMORIES);

  const t = dark ? palettes.dark : palettes.light;

  useEffect(() => {
    (async () => {
      const [p, savedTrips, savedStamps, savedTheme] = await Promise.all([
        loadProfile(), loadTrips(), loadStamps(), loadTheme(),
      ]);
      if (p) setProfile(p);
      if (savedTrips && savedTrips.length) {
        // migrate old saves: wrap in legs, and add any new starter trips they don't have
        const normalized = savedTrips.map(normalizeTrip);
        const ids = new Set(normalized.map((x) => x.id));
        const merged = [...normalized, ...INITIAL_TRIPS.filter((d) => !ids.has(d.id))];
        setTrips(merged);
      }
      if (savedStamps && savedStamps.length) {
        const countries = new Set(savedStamps.map((s) => s.country));
        const merged = [...savedStamps, ...INITIAL_STAMPS.filter((d) => !countries.has(d.country))];
        setStamps(merged);
      }
      if (savedTheme === 'light') setDark(false);
      setBooted(true);
    })();
  }, []);

  useEffect(() => { if (booted) saveTrips(trips); }, [trips, booted]);
  useEffect(() => { if (booted) saveStamps(stamps); }, [stamps, booted]);
  useEffect(() => { if (booted) saveTheme(dark ? 'dark' : 'light'); }, [dark, booted]);

  const haptic = () => Haptics.selectionAsync().catch(() => {});

  const switchTab = (key) => {
    if (key !== tab) { setTab(key); haptic(); }
  };

  const finishOnboarding = useCallback((p) => {
    setProfile(p);
    saveProfile(p);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, []);

  const updateProfile = useCallback((p) => {
    setProfile(p);
    saveProfile(p);
  }, []);

  const logout = useCallback(() => {
    // keeps trips on the device, clears the account — sign-in screen returns
    setProfileOpen(false);
    setProfile(null);
    saveProfile(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
  }, []);

  // mint stamps for every new country a trip's legs reach
  const mintStamps = useCallback((trip, currentStamps) => {
    const have = new Set(currentStamps.map((s) => s.country.toLowerCase()));
    const minted = [];
    for (const leg of legsOf(trip)) {
      if (!leg.country || have.has(leg.country.toLowerCase())) continue;
      have.add(leg.country.toLowerCase());
      minted.push({
        id: `stamp-${Date.now()}-${minted.length}`,
        country: leg.country,
        via: `Arrived by ${leg.mode === 'plane' ? 'air' : leg.mode}`,
        date: fmtStampDate(trip.fromISO || new Date()),
        mode: leg.mode || 'plane',
        rot: ROTS[(currentStamps.length + minted.length) % ROTS.length],
      });
    }
    return minted;
  }, []);

  const handleSaveTrip = useCallback((trip) => {
    setTrips((prev) => {
      const exists = prev.some((x) => x.id === trip.id);
      return exists ? prev.map((x) => (x.id === trip.id ? trip : x)) : [trip, ...prev];
    });
    setStamps((prev) => {
      const minted = mintStamps(trip, prev);
      if (minted.length) {
        setNewStampId(minted[0].id);
        return [...minted, ...prev];
      }
      return prev;
    });
    setAddOpen(false);
    setEditingTrip(null);
    setUserTrip(null);
    setTab('home');
  }, [mintStamps]);

  const handleDeleteTrip = useCallback((id) => {
    setTrips((prev) => prev.filter((x) => x.id !== id));
    setAddOpen(false);
    setEditingTrip(null);
    setUserTrip(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
  }, []);

  const openAdd = () => { setEditingTrip(null); setAddOpen(true); };
  const openEdit = (trip) => { setUserTrip(null); setEditingTrip(trip); setAddOpen(true); haptic(); };
  const openUserTrip = (trip) => { setUserTrip(trip); haptic(); };

  const addMemory = useCallback(() => {
    setMemories((prev) => [
      ...prev,
      { id: `m-${Date.now()}`, caption: 'New memory', variant: 'new', tilt: `${(Math.random() * 4 - 2).toFixed(1)}deg` },
    ]);
    haptic();
  }, []);

  if (!fontsLoaded || !booted) {
    return <View style={{ flex: 1, backgroundColor: palettes.dark.bg }} />;
  }

  if (!profile) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
        <StatusBar style={dark ? 'light' : 'dark'} />
        <OnboardingScreen t={t} onDone={finishOnboarding} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <View style={{ flex: 1 }}>
        {tab === 'home' && (
          <HomeScreen
            t={t} dark={dark}
            profile={profile}
            onToggleTheme={() => { setDark(!dark); haptic(); }}
            onSearch={() => setSearchOpen(true)}
            onAddTrip={openAdd}
            onOpenUserTrip={openUserTrip}
            onOpenDetail={() => setDetailOpen(true)}
            onProfile={() => setProfileOpen(true)}
            trips={trips}
            memories={memories}
            onAddMemory={addMemory}
          />
        )}
        {tab === 'passport' && (
          <PassportScreen
            t={t} stamps={stamps} trips={trips} profile={profile}
            newStampId={newStampId}
            onStampPress={(country) => { setCountryOpen(country); haptic(); }}
          />
        )}
        {tab === 'journeys' && (
          <TransportScreen
            t={t} trips={trips} profile={profile}
            onAddTrip={openAdd}
            onEditTrip={openEdit}
            onOpenUserTrip={openUserTrip}
            onOpenDetail={() => setDetailOpen(true)}
          />
        )}

        <View style={[styles.tabbar, { backgroundColor: t.card, borderColor: t.sageLine }]}>
          {TABS.map(({ key, label, icon }) => {
            const on = tab === key;
            return (
              <Pressable key={key} onPress={() => switchTab(key)} style={[styles.tab, on && { backgroundColor: t.sageTint }]}>
                <Icon name={icon} size={21} color={on ? t.sageDeep : t.muted} />
                <Text style={[styles.tabLabel, { color: on ? t.sageDeep : t.muted }]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <SearchModal t={t} visible={searchOpen} onClose={() => setSearchOpen(false)} onOpenDetail={() => setDetailOpen(true)} />
      <AddTripSheet
        t={t}
        visible={addOpen}
        editing={editingTrip}
        profile={profile}
        onClose={() => { setAddOpen(false); setEditingTrip(null); }}
        onSave={handleSaveTrip}
        onDelete={handleDeleteTrip}
      />
      <UserTripDetail
        t={t}
        trip={userTrip}
        profile={profile}
        visible={!!userTrip}
        onClose={() => setUserTrip(null)}
        onEdit={openEdit}
      />
      <CountryTripsModal
        t={t}
        visible={!!countryOpen}
        country={countryOpen}
        trips={trips}
        profile={profile}
        onClose={() => setCountryOpen(null)}
        onOpenTrip={openUserTrip}
      />
      <ProfileModal
        t={t}
        visible={profileOpen}
        profile={profile}
        onSaveProfile={updateProfile}
        onLogout={logout}
        onClose={() => setProfileOpen(false)}
      />
      <DetailSheet t={t} visible={detailOpen} onClose={() => setDetailOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    position: 'absolute', left: 14, right: 14, bottom: 14, height: 70,
    borderRadius: 26, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    paddingHorizontal: 6,
    shadowColor: '#0A0D08', shadowOpacity: 0.2, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 10,
  },
  tab: { alignItems: 'center', gap: 4, paddingVertical: 9, paddingHorizontal: 16, borderRadius: 16 },
  tabLabel: { fontFamily: fonts.bodySemi, fontSize: 10.5, letterSpacing: 0.3 },
});
