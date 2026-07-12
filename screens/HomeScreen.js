import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import Icon from '../components/Icons';
import AtlasMark from '../components/AtlasMark';
import Globe from '../components/Globe';
import { Section, Pill, Chip, AddRow, TripHero, MemoryCard, AddMemoryTile } from '../components/bits';
import { fonts, capsStyle, radius, card } from '../theme';
import { haversineKm, countryOf, legsOf, tripKm, tripCountries } from '../utils';

const MODE_ICON = { plane: 'plane', train: 'train', car: 'car', ferry: 'ferry', walk: 'walk' };

export default function HomeScreen({ t, dark, onToggleTheme, onSearch, onAddTrip, onOpenDetail, onOpenUserTrip, onProfile, trips, memories, onAddMemory, profile }) {
  const hour = new Date().getHours();
  const daypart = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = profile && profile.name ? profile.name : 'traveler';

  // real stats from the user's trips
  const countries = new Set(trips.flatMap(tripCountries));
  const cities = new Set(trips.flatMap((tr) => legsOf(tr).map((l) => (l.city || '').split(',')[0].trim())).filter(Boolean));
  const km = Math.round(trips.reduce((sum, tr) => sum + tripKm(tr, profile), 0));
  const pct = Math.max(1, Math.round((countries.size / 195) * 100));
  const modeCount = (m) => trips.filter((tr) => tr.mode === m).length;

  const globeCities = trips.flatMap((tr) =>
    legsOf(tr)
      .filter((l) => l.ll)
      .map((l) => ({ name: (l.city || '').split(',')[0], ll: l.ll, sub: `${tr.dates}` }))
  );

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* header */}
      <View style={styles.headRow}>
        <View style={{ flex: 1 }}>
          <View style={styles.brandRow}>
            <AtlasMark size={24} ink={t.ink} gold={t.gold} />
            <Text style={[styles.eyebrow, { color: t.sage }]}>Atlas</Text>
          </View>
          <Text style={[styles.big, { color: t.ink }]}>{daypart}, {firstName}</Text>
          <Text style={[styles.sub, { color: t.muted }]}>Your world is {pct}% explored</Text>
        </View>
        <View style={styles.headActions}>
          <Pressable onPress={onProfile} style={[styles.roundBtn, styles.avatar, { backgroundColor: t.sageTint }]}>
            <Text style={[styles.avatarText, { color: t.sageDeep }]}>{firstName.charAt(0).toUpperCase()}</Text>
          </Pressable>
          <Pressable onPress={onSearch} style={[styles.roundBtn, card(t)]}>
            <Icon name="search" size={19} color={t.sageDeep} />
          </Pressable>
          <Pressable onPress={onToggleTheme} style={[styles.roundBtn, card(t)]}>
            <Icon name={dark ? 'sun' : 'moon'} size={19} color={t.sageDeep} />
          </Pressable>
        </View>
      </View>

      {/* globe card */}
      <View style={[styles.globeCard, { backgroundColor: t.globeCardA, borderColor: t.sageLine }]}>
        <Text style={[styles.globeEyebrow, { color: t.onGlobeMuted }]}>Where you've been</Text>
        <View style={{ alignItems: 'center' }}>
          <Globe t={t} extraCities={globeCities} />
        </View>
        <Text style={[styles.globeHint, { color: t.onGlobeMuted }]}>Drag the Earth to spin it</Text>
        <View style={styles.globeStats}>
          {[[countries.size, countries.size === 1 ? 'country' : 'countries'], [cities.size, cities.size === 1 ? 'city' : 'cities'], [km.toLocaleString(), 'km from home']].map(([n, l]) => (
            <View key={l} style={{ alignItems: 'center' }}>
              <Text style={[styles.statNum, { color: t.onGlobe }]}>{n}</Text>
              <Text style={[styles.statLab, { color: t.onGlobeMuted }]}>{l}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ticket chips */}
      <View style={styles.chipRow}>
        <Chip t={t} icon="plane" num={String(modeCount('plane'))} label="flights" />
        <Chip t={t} icon="train" num={String(modeCount('train'))} label="trains" />
        <Chip t={t} icon="ferry" num={String(modeCount('ferry'))} label="ferries" />
      </View>

      <Section t={t} title="Your journeys" />

      {trips.map((trip) => {
        const onPress = trip.user ? () => onOpenUserTrip(trip) : (trip.openable ? onOpenDetail : undefined);
        return (
          <Pressable
            key={trip.id}
            onPress={onPress}
            style={({ pressed }) => [styles.tripCard, card(t), pressed && onPress && { transform: [{ scale: 0.975 }] }]}
          >
            <TripHero t={t} variant={trip.skyline} />
            <View style={styles.tripBody}>
              <View style={styles.tripTop}>
                <Text style={[styles.tripTitle, { color: t.ink }]}>{trip.city}</Text>
                <Text style={[styles.tripDate, { color: t.muted }]}>{trip.dates}</Text>
              </View>
              {trip.routeFrom ? (
                <View style={styles.route}>
                  <Text style={[styles.routeCode, { color: t.muted }]}>{trip.routeFrom}</Text>
                  <View style={[styles.routeLine, { borderColor: t.sageLine }]}>
                    <View style={styles.routeIcon}>
                      <Icon name={MODE_ICON[trip.mode]} size={15} color={t.sage} />
                    </View>
                  </View>
                  <Text style={[styles.routeCode, { color: t.muted }]}>{trip.routeTo}</Text>
                </View>
              ) : null}
              <View style={styles.pillRow}>
                <Pill t={t} icon={MODE_ICON[trip.mode]}>{trip.modeWord}</Pill>
                {legsOf(trip).length > 1 ? (
                  <Pill t={t} icon="pin">{`+${legsOf(trip).length - 1} ${legsOf(trip).length === 2 ? 'stop' : 'stops'}`}</Pill>
                ) : null}
                {(trip.pills || []).map((p, i) => (
                  <Pill t={t} key={i}>{p}</Pill>
                ))}
              </View>
            </View>
          </Pressable>
        );
      })}

      <AddRow t={t} label="Add a trip" onPress={onAddTrip} />

      <Section t={t} title="Memories" action="See all" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8, paddingHorizontal: 2 }}>
        {memories.map((m) => (
          <MemoryCard key={m.id} t={t} caption={m.caption} variant={m.variant} tilt={m.tilt} />
        ))}
        <AddMemoryTile t={t} onPress={onAddMemory} />
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, paddingTop: 6, paddingBottom: 118 },
  headRow: { flexDirection: 'row', alignItems: 'flex-start' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyebrow: { ...capsStyle, fontSize: 11, letterSpacing: 3 },
  big: { fontFamily: fonts.display, fontSize: 26, letterSpacing: -0.5, marginTop: 6 },
  sub: { fontFamily: fonts.bodySemi, fontSize: 13, marginTop: 4 },
  headActions: { flexDirection: 'row', gap: 9, marginTop: 4 },
  roundBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatar: { shadowOpacity: 0, elevation: 0 },
  avatarText: { fontFamily: fonts.display, fontSize: 17 },
  globeCard: { marginTop: 16, borderRadius: radius.lg, padding: 16, borderWidth: 1 },
  globeEyebrow: { ...capsStyle, fontSize: 9.5, marginBottom: 4 },
  globeHint: { fontFamily: fonts.bodySemi, fontSize: 11, textAlign: 'center', marginTop: 4, letterSpacing: 0.2 },
  globeStats: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 12 },
  statNum: { fontFamily: fonts.display, fontSize: 21, letterSpacing: -0.3 },
  statLab: { ...capsStyle, fontSize: 9, marginTop: 3 },
  chipRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  tripCard: { borderRadius: radius.lg, overflow: 'hidden', marginBottom: 14 },
  tripBody: { paddingHorizontal: 16, paddingVertical: 14 },
  tripTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  tripTitle: { fontFamily: fonts.displaySemi, fontSize: 17, letterSpacing: -0.2, flexShrink: 1, paddingRight: 8 },
  tripDate: { fontFamily: fonts.bodySemi, fontSize: 12.5 },
  route: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  routeCode: { fontFamily: fonts.bodyBold, fontSize: 11.5, letterSpacing: 1.2 },
  routeLine: { flex: 1, borderTopWidth: 2, borderStyle: 'dotted', height: 0, justifyContent: 'center' },
  routeIcon: { position: 'absolute', left: '46%', top: -9 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 11 },
});
