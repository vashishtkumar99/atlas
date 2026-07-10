import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useFonts, Lora_400Regular_Italic, Lora_500Medium, Lora_600SemiBold } from '@expo-google-fonts/lora';
import { Karla_400Regular, Karla_600SemiBold, Karla_700Bold, Karla_800ExtraBold } from '@expo-google-fonts/karla';
import { Fraunces_400Regular_Italic, Fraunces_500Medium_Italic } from '@expo-google-fonts/fraunces';

import { palettes, fonts } from './src/theme';
import Icon from './src/components/Icons';
import HomeScreen from './src/screens/HomeScreen';
import PassportScreen from './src/screens/PassportScreen';
import TransportScreen from './src/screens/TransportScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { SearchModal, AddTripSheet, DetailSheet } from './src/components/modals';
import { INITIAL_TRIPS, MEMORIES } from './src/data/demo';
import { loadProfile, saveProfile, loadTrips, saveTrips } from './src/storage';

const TABS = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'passport', label: 'Passport', icon: 'book' },
  { key: 'transport', label: 'Transport', icon: 'plane' },
];

export default function App() {
  const [fontsLoaded] = useFonts({
    Lora_400Regular_Italic, Lora_500Medium, Lora_600SemiBold,
    Karla_400Regular, Karla_600SemiBold, Karla_700Bold, Karla_800ExtraBold,
    Fraunces_400Regular_Italic, Fraunces_500Medium_Italic,
  });

  const [booted, setBooted] = useState(false);
  const [profile, setProfile] = useState(null);
  const [dark, setDark] = useState(false);
  const [tab, setTab] = useState('home');
  const [searchOpen, setSearchOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [trips, setTrips] = useState(INITIAL_TRIPS);
  const [memories, setMemories] = useState(MEMORIES);

  const t = dark ? palettes.dark : palettes.light;

  // load saved profile + trips once on launch
  useEffect(() => {
    (async () => {
      const [p, savedTrips] = await Promise.all([loadProfile(), loadTrips()]);
      if (p) setProfile(p);
      if (savedTrips && savedTrips.length) setTrips(savedTrips);
      setBooted(true);
    })();
  }, []);

  // save trips whenever they change (after boot, so we don't overwrite with defaults)
  useEffect(() => {
    if (booted) saveTrips(trips);
  }, [trips, booted]);

  const haptic = () => Haptics.selectionAsync().catch(() => {});

  const switchTab = (key) => {
    if (key !== tab) { setTab(key); haptic(); }
  };

  const finishOnboarding = useCallback((p) => {
    setProfile(p);
    saveProfile(p);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, []);

  const saveTrip = useCallback((trip) => {
    setTrips((prev) => [trip, ...prev]);
    setAddOpen(false);
    setTab('home');
  }, []);

  const addMemory = useCallback(() => {
    setMemories((prev) => [
      ...prev,
      { id: `m-${Date.now()}`, caption: 'new memory', variant: 'new', tilt: `${(Math.random() * 4 - 2).toFixed(1)}deg` },
    ]);
    haptic();
  }, []);

  if (!fontsLoaded || !booted) {
    return <View style={{ flex: 1, backgroundColor: palettes.light.bg }} />;
  }

  // first launch: sign up
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
            onAddTrip={() => setAddOpen(true)}
            onOpenDetail={() => setDetailOpen(true)}
            trips={trips}
            memories={memories}
            onAddMemory={addMemory}
          />
        )}
        {tab === 'passport' && <PassportScreen t={t} />}
        {tab === 'transport' && (
          <TransportScreen t={t} onAddTrip={() => setAddOpen(true)} onOpenDetail={() => setDetailOpen(true)} />
        )}

        <View style={[styles.tabbar, { backgroundColor: t.card, shadowColor: '#141C12' }]}>
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
      <AddTripSheet t={t} visible={addOpen} onClose={() => setAddOpen(false)} onSave={saveTrip} />
      <DetailSheet t={t} visible={detailOpen} onClose={() => setDetailOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    position: 'absolute', left: 14, right: 14, bottom: 14, height: 70,
    borderRadius: 26, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    paddingHorizontal: 6,
    shadowOpacity: 0.16, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 10,
  },
  tab: { alignItems: 'center', gap: 4, paddingVertical: 9, paddingHorizontal: 16, borderRadius: 16 },
  tabLabel: { fontFamily: fonts.bodyHeavy, fontSize: 10.5 },
});
