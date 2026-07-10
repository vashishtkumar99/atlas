import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import Icon from '../components/Icons';
import AtlasMark from '../components/AtlasMark';
import Globe from '../components/Globe';
import { Section, Pill, Chip, AddRow, TripHero, MemoryCard, AddMemoryTile } from '../components/bits';
import { MEMORIES } from '../data/demo';
import { fonts, radius, card } from '../theme';

const MODE_ICON = { plane: 'plane', train: 'train', car: 'car', ferry: 'ferry', walk: 'walk' };

export default function HomeScreen({ t, dark, onToggleTheme, onSearch, onAddTrip, onOpenDetail, trips, memories, onAddMemory }) {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* header */}
      <View style={styles.headRow}>
        <View style={{ flex: 1 }}>
          <View style={styles.brandRow}>
            <AtlasMark size={22} line={t.sageDeep} thin={t.sage} gold={t.gold} />
            <Text style={[styles.eyebrow, { color: t.sage }]}>Atlas</Text>
          </View>
          <Text style={[styles.big, { color: t.ink }]}>Good evening, Maya</Text>
          <Text style={[styles.sub, { color: t.muted }]}>Your world is 12% explored</Text>
        </View>
        <View style={styles.headActions}>
          <Pressable onPress={onSearch} style={[styles.roundBtn, card(t)]}>
            <Icon name="search" size={19} color={t.sageDeep} />
          </Pressable>
          <Pressable onPress={onToggleTheme} style={[styles.roundBtn, card(t)]}>
            <Icon name={dark ? 'sun' : 'moon'} size={19} color={t.sageDeep} />
          </Pressable>
        </View>
      </View>

      {/* globe card */}
      <View style={[styles.globeCard, { backgroundColor: t.globeCardA }]}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: t.globeCardB, opacity: 0.45, borderRadius: radius.lg }]} />
        <Text style={[styles.globeEyebrow, { color: t.onGlobeMuted }]}>where you've been</Text>
        <View style={{ alignItems: 'center' }}>
          <Globe t={t} />
        </View>
        <Text style={[styles.globeHint, { color: t.onGlobeMuted }]}>drag the Earth to spin it</Text>
        <View style={styles.globeStats}>
          {[['23', 'countries'], ['61', 'cities'], ['48,210', 'km traveled']].map(([n, l]) => (
            <View key={l} style={{ alignItems: 'center' }}>
              <Text style={[styles.statNum, { color: t.onGlobe }]}>{n}</Text>
              <Text style={[styles.statLab, { color: t.onGlobeMuted }]}>{l}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ticket chips */}
      <View style={styles.chipRow}>
        <Chip t={t} icon="plane" num="31" label="flights" />
        <Chip t={t} icon="train" num="18" label="trains" />
        <Chip t={t} icon="ferry" num="5" label="ferries" />
      </View>

      <Section t={t} title="Latest journey" />

      {trips.map((trip) => (
        <Pressable
          key={trip.id}
          onPress={trip.openable ? onOpenDetail : undefined}
          style={({ pressed }) => [styles.tripCard, card(t), pressed && trip.openable && { transform: [{ scale: 0.975 }] }]}
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
              {trip.pills.map((p, i) => (
                <Pill t={t} key={i} icon={i === 0 ? 'sun' : 'star'}>{p}</Pill>
              ))}
            </View>
          </View>
        </Pressable>
      ))}

      <AddRow t={t} label="add a trip" onPress={onAddTrip} />

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
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  eyebrow: { fontFamily: fonts.accentMed, fontSize: 15 },
  big: { fontFamily: fonts.display, fontSize: 29, marginTop: 2 },
  sub: { fontFamily: fonts.bodySemi, fontSize: 13.5, marginTop: 3 },
  headActions: { flexDirection: 'row', gap: 9, marginTop: 4 },
  roundBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  globeCard: { marginTop: 16, borderRadius: radius.lg, padding: 16, overflow: 'hidden' },
  globeEyebrow: { fontFamily: fonts.accentMed, fontSize: 14.5, marginBottom: 2 },
  globeHint: { fontFamily: fonts.bodyBold, fontSize: 11.5, textAlign: 'center', marginTop: 2 },
  globeStats: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  statNum: { fontFamily: fonts.display, fontSize: 23 },
  statLab: { fontFamily: fonts.accent, fontSize: 13.5 },
  chipRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  tripCard: { borderRadius: radius.lg, overflow: 'hidden', marginBottom: 14 },
  tripBody: { paddingHorizontal: 16, paddingVertical: 14 },
  tripTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  tripTitle: { fontFamily: fonts.display, fontSize: 19 },
  tripDate: { fontFamily: fonts.accent, fontSize: 14 },
  route: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  routeCode: { fontFamily: fonts.bodyHeavy, fontSize: 12, letterSpacing: 1 },
  routeLine: { flex: 1, borderTopWidth: 2, borderStyle: 'dotted', height: 0, justifyContent: 'center' },
  routeIcon: { position: 'absolute', left: '46%', top: -9 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
});
