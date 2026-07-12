import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';
import Icon from '../components/Icons';
import { Section, Chip, AddRow } from '../components/bits';
import { LAND } from '../data/geo';
import { fonts, capsStyle, radius, card } from '../theme';
import { haversineKm, segmentsOf, tripKm, tripCountries, tripYear } from '../utils';

const MODE_COLORS = { plane: '#5A6E8C', train: '#7C8F74', car: '#A3623F', ferry: '#B9A15E', walk: '#8A7F9E' };
const MODE_LABEL = { plane: 'flights', train: 'trains', car: 'road', ferry: 'ferry', walk: 'on foot' };

const MW = 340, MH = 170;
const mx = (lon) => ((lon + 180) / 360) * MW;
const my = (lat) => ((90 - lat) / 180) * MH;

function MiniWorld({ t, segments }) {
  const landPaths = Object.values(LAND).map(
    (ring) => 'M' + ring.map(([lo, la]) => `${mx(lo).toFixed(1)},${my(la).toFixed(1)}`).join('L') + 'Z'
  );
  return (
    <Svg width="100%" height={MH} viewBox={`0 0 ${MW} ${MH}`}>
      <Rect width={MW} height={MH} rx={18} fill={t.sageTint} />
      <G fill={t.sageLine} opacity={0.85}>
        {landPaths.map((d, i) => <Path key={i} d={d} />)}
      </G>
      {segments.map((seg, i) => {
        if (!seg.from.ll || !seg.to.ll) return null;
        const x1 = mx(seg.from.ll[0]), y1 = my(seg.from.ll[1]);
        const x2 = mx(seg.to.ll[0]), y2 = my(seg.to.ll[1]);
        const cx = (x1 + x2) / 2, cy = Math.min(y1, y2) - Math.abs(x2 - x1) * 0.18 - 6;
        return (
          <Path key={`r${i}`} d={`M${x1},${y1} Q ${cx},${cy} ${x2},${y2}`}
            fill="none" stroke={t.gold} strokeWidth={1.4} strokeDasharray="2 4" opacity={0.9} />
        );
      })}
      {segments.map((seg, i) => (
        <G key={`d${i}`}>
          {seg.from.ll && <Circle cx={mx(seg.from.ll[0])} cy={my(seg.from.ll[1])} r={3} fill={t.card} stroke={t.sageDeep} strokeWidth={1.4} />}
          {seg.to.ll && <Circle cx={mx(seg.to.ll[0])} cy={my(seg.to.ll[1])} r={3.4} fill={t.gold} stroke={t.card} strokeWidth={1.2} />}
        </G>
      ))}
    </Svg>
  );
}

export default function TransportScreen({ t, trips, profile, onAddTrip, onOpenDetail, onEditTrip, onOpenUserTrip }) {
  const [year, setYear] = useState('all');

  const years = [...new Set(trips.map(tripYear).filter(Boolean))].sort((a, b) => b - a);
  const shown = year === 'all' ? trips : trips.filter((tr) => tripYear(tr) === year);

  // one journey row per leg, newest trips first
  const rows = shown.flatMap((trip) =>
    segmentsOf(trip, profile).map((seg, i) => ({
      key: `${trip.id}-${i}`,
      trip, seg,
      km: seg.from.ll && seg.to.ll ? Math.round(haversineKm(seg.from.ll, seg.to.ll)) : null,
    }))
  );

  const totalLegs = rows.length || 1;
  const breakdown = Object.keys(MODE_COLORS)
    .map((m) => [m, rows.filter((r) => (r.seg.to.mode || 'plane') === m).length])
    .filter(([, n]) => n > 0)
    .map(([m, n]) => [m, Math.round((n / totalLegs) * 100)]);

  const segments = shown.flatMap((trip) => segmentsOf(trip, profile));
  const totalKm = Math.round(shown.reduce((s, tr) => s + tripKm(tr, profile), 0));
  const countries = new Set(shown.flatMap(tripCountries)).size;

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={[styles.eyebrow, { color: t.sage }]}>How you move</Text>
      <Text style={[styles.big, { color: t.ink }]}>Your journeys</Text>

      {/* Flighty-style year filter */}
      <View style={styles.filters}>
        {['all', ...years].map((y) => {
          const on = year === y;
          return (
            <Pressable
              key={y}
              onPress={() => setYear(y)}
              style={[styles.fPill, { borderColor: on ? t.sageLine : 'transparent', backgroundColor: on ? t.sageTint : 'transparent' }]}
            >
              <Text style={[styles.fPillText, { color: on ? t.ink : t.muted }]}>{y === 'all' ? 'All-Time' : y}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.routesCard, card(t)]}>
        <MiniWorld t={t} segments={segments} />
        {breakdown.length > 0 && (
          <>
            <View style={styles.modeBar}>
              {breakdown.map(([m, pct]) => (
                <View key={m} style={{ width: `${pct}%`, backgroundColor: MODE_COLORS[m] }} />
              ))}
            </View>
            <View style={styles.legend}>
              {breakdown.map(([m, pct]) => (
                <View key={m} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: MODE_COLORS[m] }]} />
                  <Text style={[styles.legendText, { color: t.muted }]}>
                    <Text style={{ color: t.ink }}>{pct}%</Text> {MODE_LABEL[m]}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>

      <View style={styles.chipRow}>
        <Chip t={t} num={totalKm.toLocaleString()} label="km traveled" />
        <Chip t={t} num={String(rows.length)} label={rows.length === 1 ? 'journey' : 'journeys'} />
        <Chip t={t} num={String(countries)} label={countries === 1 ? 'country' : 'countries'} />
      </View>

      <Section t={t} title={year === 'all' ? 'All journeys' : `Journeys in ${year}`} />

      {rows.map((r) => {
        const onPress = r.trip.user
          ? () => onOpenUserTrip(r.trip)
          : (r.trip.openable ? onOpenDetail : undefined);
        return (
          <Pressable
            key={r.key}
            onPress={onPress}
            style={({ pressed }) => [styles.journey, card(t), pressed && onPress && { transform: [{ scale: 0.975 }] }]}
          >
            <View style={styles.jTop}>
              <Text style={[styles.jCity, { color: t.ink }]} numberOfLines={1}>{(r.seg.from.city || 'Home').split(',')[0]}</Text>
              <View style={[styles.jLine, { borderColor: t.sageLine }]}>
                <View style={[styles.jMode, { backgroundColor: t.sageTint, borderColor: t.card }]}>
                  <Icon name={r.seg.to.mode || 'plane'} size={15} color={t.sageDeep} />
                </View>
              </View>
              <Text style={[styles.jCity, { color: t.ink }]} numberOfLines={1}>{(r.seg.to.city || '').split(',')[0]}</Text>
            </View>
            <View style={styles.jSub}>
              <Text style={[styles.jStats, { color: t.muted }]}>
                {[r.km ? `${r.km.toLocaleString()} km` : null, r.trip.dates].filter(Boolean).join(' · ')}
              </Text>
              {r.trip.pills && r.trip.pills[0] ? (
                <Text style={[styles.jNote, { color: t.sage }]} numberOfLines={1}>{r.trip.pills[0]}</Text>
              ) : null}
            </View>
          </Pressable>
        );
      })}

      <AddRow t={t} label="Log a journey" onPress={onAddTrip} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, paddingTop: 6, paddingBottom: 118 },
  eyebrow: { ...capsStyle, fontSize: 11, letterSpacing: 3 },
  big: { fontFamily: fonts.display, fontSize: 26, letterSpacing: -0.5, marginTop: 6 },
  filters: { flexDirection: 'row', gap: 6, marginTop: 12 },
  fPill: { borderWidth: 1, borderRadius: 999, paddingVertical: 7, paddingHorizontal: 15 },
  fPillText: { fontFamily: fonts.bodyBold, fontSize: 13.5 },
  routesCard: { marginTop: 14, borderRadius: radius.lg, padding: 16 },
  modeBar: { flexDirection: 'row', height: 12, borderRadius: 999, overflow: 'hidden', marginTop: 16 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  legendDot: { width: 9, height: 9, borderRadius: 3 },
  legendText: { fontFamily: fonts.bodySemi, fontSize: 12 },
  chipRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  journey: { borderRadius: 20, paddingHorizontal: 15, paddingVertical: 14, marginBottom: 11 },
  jTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  jCity: { fontFamily: fonts.displaySemi, fontSize: 15, letterSpacing: -0.1, maxWidth: '32%' },
  jLine: { flex: 1, borderTopWidth: 2, borderStyle: 'dotted', height: 0, alignItems: 'center', justifyContent: 'center' },
  jMode: { position: 'absolute', top: -15, width: 30, height: 30, borderRadius: 15, borderWidth: 4, alignItems: 'center', justifyContent: 'center' },
  jSub: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 13 },
  jStats: { fontFamily: fonts.bodySemi, fontSize: 11.5, letterSpacing: 0.1 },
  jNote: { fontFamily: fonts.body, fontSize: 11.5, flexShrink: 1 },
});
