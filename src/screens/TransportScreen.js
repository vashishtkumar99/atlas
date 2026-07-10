import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Text as SvgText, Rect } from 'react-native-svg';
import Icon from '../components/Icons';
import { Section, Chip, AddRow } from '../components/bits';
import { JOURNEYS } from '../data/demo';
import { fonts, radius, card } from '../theme';

const MODE_COLORS = { flights: '#5A6E8C', trains: '#7C8F74', road: '#A3623F', ferry: '#B9A15E' };
const BREAKDOWN = [
  ['flights', 46], ['trains', 32], ['road', 13], ['ferry', 9],
];

export default function TransportScreen({ t, onAddTrip, onOpenDetail }) {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={[styles.eyebrow, { color: t.sage }]}>how you move</Text>
      <Text style={[styles.big, { color: t.ink }]}>Your journeys</Text>
      <Text style={[styles.sub, { color: t.muted }]}>Every route, drawn on your map</Text>

      <View style={[styles.routesCard, card(t)]}>
        <Svg width="100%" height={170} viewBox="0 0 340 170">
          <Rect width="340" height="170" rx="18" fill={t.sageTint} />
          <Path d="M18 118q26-16 44-6 16 9 34-2 20-12 40-4" fill="none" stroke={t.sageLine} strokeWidth={1.2} />
          <Path d="M150 52q22-14 42-4 18 9 36 0 20-10 40 2" fill="none" stroke={t.sageLine} strokeWidth={1.2} />
          <Path d="M40 60q16-10 30-4" fill="none" stroke={t.sageLine} strokeWidth={1.2} />
          <Path d="M232 128q20-10 38-2 16 7 34 0" fill="none" stroke={t.sageLine} strokeWidth={1.2} />
          <Path d="M62 96 Q 120 30 188 62" fill="none" stroke={MODE_COLORS.flights} strokeWidth={1.8} strokeDasharray="3 5" />
          <Path d="M188 62 Q 232 96 282 84" fill="none" stroke={MODE_COLORS.road} strokeWidth={1.8} strokeDasharray="3 5" />
          <Path d="M62 96 Q 96 140 158 132" fill="none" stroke="#55654F" strokeWidth={1.8} strokeDasharray="3 5" />
          <Circle cx="62" cy="96" r="5" fill={t.card} stroke={t.sageDeep} strokeWidth={2} />
          <Circle cx="188" cy="62" r="5" fill={t.card} stroke={MODE_COLORS.flights} strokeWidth={2} />
          <Circle cx="282" cy="84" r="5" fill={t.card} stroke={MODE_COLORS.road} strokeWidth={2} />
          <Circle cx="158" cy="132" r="5" fill={t.card} stroke="#55654F" strokeWidth={2} />
          <SvgText x="42" y="84" fill={t.muted} fontSize="12" fontStyle="italic">Lisbon</SvgText>
          <SvgText x="174" y="50" fill={t.muted} fontSize="12" fontStyle="italic">Paris</SvgText>
          <SvgText x="258" y="72" fill={t.muted} fontSize="12" fontStyle="italic">Florence</SvgText>
          <SvgText x="138" y="152" fill={t.muted} fontSize="12" fontStyle="italic">Madeira</SvgText>
        </Svg>

        <View style={styles.modeBar}>
          {BREAKDOWN.map(([k, pct]) => (
            <View key={k} style={{ width: `${pct}%`, backgroundColor: MODE_COLORS[k] }} />
          ))}
        </View>
        <View style={styles.legend}>
          {BREAKDOWN.map(([k, pct]) => (
            <View key={k} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: MODE_COLORS[k] }]} />
              <Text style={[styles.legendText, { color: t.muted }]}>
                <Text style={{ color: t.ink }}>{pct}%</Text> {k}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.chipRow}>
        <Chip t={t} num="48,210" label="km traveled" />
        <Chip t={t} num="96h" label="in the air" />
        <Chip t={t} num="427" label="km on foot" />
      </View>

      <Section t={t} title="Recent journeys" />

      {JOURNEYS.map((j) => (
        <Pressable
          key={j.id}
          onPress={j.openable ? onOpenDetail : undefined}
          style={({ pressed }) => [styles.journey, card(t), pressed && j.openable && { transform: [{ scale: 0.975 }] }]}
        >
          <View style={styles.jTop}>
            <Text style={[styles.jCity, { color: t.ink }]}>{j.from}</Text>
            <View style={[styles.jLine, { borderColor: t.sageLine }]}>
              <View style={[styles.jMode, { backgroundColor: t.sageTint, borderColor: t.card }]}>
                <Icon name={j.mode} size={15} color={t.sageDeep} />
              </View>
            </View>
            <Text style={[styles.jCity, { color: t.ink }]}>{j.to}</Text>
          </View>
          <View style={styles.jSub}>
            <Text style={[styles.jStats, { color: t.muted }]}>{j.sub}</Text>
            <Text style={[styles.jNote, { color: t.sage }]}>{j.note}</Text>
          </View>
        </Pressable>
      ))}

      <AddRow t={t} label="log a journey" onPress={onAddTrip} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, paddingTop: 6, paddingBottom: 118 },
  eyebrow: { fontFamily: fonts.accentMed, fontSize: 15 },
  big: { fontFamily: fonts.display, fontSize: 29, marginTop: 2 },
  sub: { fontFamily: fonts.bodySemi, fontSize: 13.5, marginTop: 3 },
  routesCard: { marginTop: 14, borderRadius: radius.lg, padding: 16 },
  modeBar: { flexDirection: 'row', height: 14, borderRadius: 999, overflow: 'hidden', marginTop: 16 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  legendDot: { width: 9, height: 9, borderRadius: 3 },
  legendText: { fontFamily: fonts.bodyBold, fontSize: 12 },
  chipRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  journey: { borderRadius: 20, paddingHorizontal: 15, paddingVertical: 14, marginBottom: 11 },
  jTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  jCity: { fontFamily: fonts.displaySemi, fontSize: 16 },
  jLine: { flex: 1, borderTopWidth: 2, borderStyle: 'dotted', height: 0, alignItems: 'center', justifyContent: 'center' },
  jMode: { position: 'absolute', top: -15, width: 30, height: 30, borderRadius: 15, borderWidth: 4, alignItems: 'center', justifyContent: 'center' },
  jSub: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 13 },
  jStats: { fontFamily: fonts.bodyBold, fontSize: 11.5 },
  jNote: { fontFamily: fonts.accent, fontSize: 13 },
});
