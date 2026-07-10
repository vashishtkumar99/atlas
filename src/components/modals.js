import React, { useState } from 'react';
import {
  View, Text, Modal, TextInput, Pressable, ScrollView,
  KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Icon from './Icons';
import { Section, Pill, TripHero, MemoryCard, AddMemoryTile } from './bits';
import { SEARCH_DATA, MODE_WORD } from '../data/demo';
import { fonts, radius, card } from '../theme';

/* ---------------- Search ---------------- */
export function SearchModal({ t, visible, onClose, onOpenDetail }) {
  const [q, setQ] = useState('');
  const query = q.trim().toLowerCase();
  const hits = query
    ? SEARCH_DATA.filter((d) => `${d.t} ${d.s} ${d.kind}`.toLowerCase().includes(query))
    : SEARCH_DATA.slice(0, 5);

  const pick = (d) => {
    setQ('');
    onClose();
    if (d.open) setTimeout(onOpenDetail, 260);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.searchPage, { backgroundColor: t.bg }]}>
        <View style={styles.searchBar}>
          <View style={[styles.searchBox, card(t), { borderColor: t.sageLine }]}>
            <Icon name="search" size={17} color={t.sage} />
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder="Cities, trips, journeys..."
              placeholderTextColor={t.muted}
              autoFocus
              style={[styles.searchInput, { color: t.ink }]}
            />
          </View>
          <Pressable onPress={() => { setQ(''); onClose(); }} hitSlop={10} style={styles.searchClose}>
            <Icon name="close" size={18} color={t.muted} />
          </Pressable>
        </View>
        <Text style={[styles.searchHint, { color: t.muted }]}>
          {query ? (hits.length ? `found ${hits.length} for "${query}"` : '') : 'try "florence" or "train"'}
        </Text>
        <ScrollView contentContainerStyle={{ paddingBottom: 30 }} keyboardShouldPersistTaps="handled">
          {hits.length ? hits.map((d, i) => (
            <Pressable key={i} onPress={() => pick(d)} style={({ pressed }) => [styles.result, card(t), pressed && { transform: [{ scale: 0.975 }] }]}>
              <View style={[styles.resultIcon, { backgroundColor: t.sageTint }]}>
                <Icon name={d.icon} size={17} color={t.sageDeep} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.resultTitle, { color: t.ink }]}>{d.t}</Text>
                <Text style={[styles.resultSub, { color: t.muted }]}>{d.s}</Text>
              </View>
              <View style={[styles.kind, { backgroundColor: t.sageTint }]}>
                <Text style={[styles.kindText, { color: t.sage }]}>{d.kind.toUpperCase()}</Text>
              </View>
            </Pressable>
          )) : (
            <Text style={[styles.noResults, { color: t.muted }]}>
              nothing yet — but that sounds like a trip worth taking
            </Text>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

/* ---------------- Add trip ---------------- */
const MODES = ['plane', 'train', 'car', 'ferry', 'walk'];

export function AddTripSheet({ t, visible, onClose, onSave }) {
  const [city, setCity] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [note, setNote] = useState('');
  const [mode, setMode] = useState('plane');

  const save = () => {
    onSave({
      id: `trip-${Date.now()}`,
      city: city.trim() || 'Somewhere new',
      dates: `${from.trim() || 'soon'}${to.trim() ? ` – ${to.trim()}` : ''}`,
      mode,
      modeWord: MODE_WORD[mode],
      pills: note.trim() ? [note.trim()] : [],
      skyline: 'new',
    });
    setCity(''); setFrom(''); setTo(''); setNote(''); setMode('plane');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.sheet, { backgroundColor: t.bg }]}>
          <View style={[styles.grab, { backgroundColor: t.sageLine }]} />
          <Text style={[styles.sheetTitle, { color: t.ink }]}>Add a trip</Text>
          <Text style={[styles.sheetSub, { color: t.muted }]}>just the basics — you can fill in the story later</Text>

          <Text style={[styles.label, { color: t.sage }]}>where to?</Text>
          <TextInput value={city} onChangeText={setCity} placeholder="City, country" placeholderTextColor={t.muted}
            style={[styles.input, { borderColor: t.sageLine, backgroundColor: t.card, color: t.ink }]} />

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: t.sage }]}>from</Text>
              <TextInput value={from} onChangeText={setFrom} placeholder="Jun 5" placeholderTextColor={t.muted}
                style={[styles.input, { borderColor: t.sageLine, backgroundColor: t.card, color: t.ink }]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: t.sage }]}>until</Text>
              <TextInput value={to} onChangeText={setTo} placeholder="Jun 11" placeholderTextColor={t.muted}
                style={[styles.input, { borderColor: t.sageLine, backgroundColor: t.card, color: t.ink }]} />
            </View>
          </View>

          <Text style={[styles.label, { color: t.sage }]}>how did you get there?</Text>
          <View style={{ flexDirection: 'row', gap: 9 }}>
            {MODES.map((m) => (
              <Pressable
                key={m}
                onPress={() => { setMode(m); Haptics.selectionAsync().catch(() => {}); }}
                style={[
                  styles.modePick,
                  { borderColor: mode === m ? t.sage : t.sageLine, backgroundColor: mode === m ? t.sageTint : t.card },
                  mode === m && { transform: [{ scale: 1.05 }] },
                ]}
              >
                <Icon name={m} size={18} color={mode === m ? t.sageDeep : t.muted} />
              </Pressable>
            ))}
          </View>

          <Text style={[styles.label, { color: t.sage }]}>a little note (optional)</Text>
          <TextInput value={note} onChangeText={setNote} placeholder="the best gelato of my life..." placeholderTextColor={t.muted}
            style={[styles.input, { borderColor: t.sageLine, backgroundColor: t.card, color: t.ink }]} />

          <Pressable onPress={save} style={({ pressed }) => [styles.saveBtn, { backgroundColor: t.sageDeep, transform: [{ scale: pressed ? 0.96 : 1 }] }]}>
            <Text style={[styles.saveText, { color: t.saveText }]}>Save to my map</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* ---------------- Florence detail ---------------- */
const FACTS = [
  ['arrived', 'By train from Milan', 'train'],
  ['stayed', '6 days, 5 nights', 'pin'],
  ['walked', '42.6 km', 'walk'],
  ['weather', '31° and golden', 'sun'],
  ['best bite', 'Gelateria dei Neri', 'cup'],
  ['mood', 'Slow and sunny', 'star'],
];

export function DetailSheet({ t, visible, onClose }) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView style={{ backgroundColor: t.bg }} contentContainerStyle={{ paddingBottom: 44 }} showsVerticalScrollIndicator={false}>
        <View>
          <TripHero t={t} variant="florence" height={250} />
          <Pressable onPress={onClose} style={[styles.backBtn, card(t)]}>
            <Icon name="chevBack" size={17} color={t.ink} />
          </Pressable>
        </View>
        <View style={{ paddingHorizontal: 18 }}>
          <View style={styles.detailTop}>
            <View>
              <Text style={[styles.detailEyebrow, { color: t.sage }]}>Italy · Tuscany</Text>
              <Text style={[styles.detailTitle, { color: t.ink }]}>Florence</Text>
            </View>
            <View style={[styles.rating, card(t)]}>
              <Text style={[styles.ratingNum, { color: t.gold }]}>4.8</Text>
              <Text style={[styles.ratingLab, { color: t.muted }]}>your score</Text>
            </View>
          </View>

          <View style={[styles.handNote, { backgroundColor: t.sageTint }]}>
            <Text style={[styles.handNoteText, { color: t.sageDeep }]}>
              June 5 – 11, 2026 · arrived by train from Milan · six golden days
            </Text>
          </View>

          <View style={styles.factGrid}>
            {FACTS.map(([label, value, icon]) => (
              <View key={label} style={[styles.fact, card(t)]}>
                <Text style={[styles.factLabel, { color: t.muted }]}>{label}</Text>
                <View style={styles.factValueRow}>
                  <Icon name={icon} size={15} color={t.sage} />
                  <Text style={[styles.factValue, { color: t.ink }]}>{value}</Text>
                </View>
              </View>
            ))}
          </View>

          <Section t={t} title="Neighborhoods" />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {['Duomo', 'Oltrarno', 'San Lorenzo', 'Santo Spirito'].map((n) => (
              <Pill t={t} key={n}>{n}</Pill>
            ))}
          </View>

          <Section t={t} title="From your journal" />
          <View style={[styles.quote, { borderLeftColor: t.gold }]}>
            <Text style={[styles.quoteText, { color: t.ink }]}>
              "Climbed the Duomo at sunset. 463 steps, worth every single one. The whole city turned the color of apricots."
            </Text>
          </View>

          <Section t={t} title="Memories" action="Add" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <MemoryCard t={t} caption="the Duomo" variant="duomo" tilt="-2deg" />
            <MemoryCard t={t} caption="Ponte Vecchio" variant="bridge" tilt="2deg" />
            <AddMemoryTile t={t} onPress={() => {}} />
          </ScrollView>

          <View style={[styles.returnPill, { backgroundColor: t.sageTint }]}>
            <Text style={[styles.returnQ, { color: t.ink }]}>Would you return?</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
              <Icon name="check" size={15} color={t.sageDeep} />
              <Text style={[styles.returnQ, { color: t.sageDeep }]}>Absolutely</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  /* search */
  searchPage: { flex: 1, paddingTop: 64, paddingHorizontal: 18 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 999, borderWidth: 1.5, paddingVertical: 12, paddingHorizontal: 17 },
  searchInput: { flex: 1, fontFamily: fonts.bodySemi, fontSize: 15.5, padding: 0 },
  searchClose: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  searchHint: { fontFamily: fonts.accent, fontSize: 14, marginVertical: 14, marginLeft: 4 },
  result: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: radius.md, paddingVertical: 13, paddingHorizontal: 15, marginBottom: 10 },
  resultIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  resultTitle: { fontFamily: fonts.bodyHeavy, fontSize: 14 },
  resultSub: { fontFamily: fonts.accent, fontSize: 13, marginTop: 1 },
  kind: { borderRadius: 999, paddingVertical: 4, paddingHorizontal: 9 },
  kindText: { fontFamily: fonts.bodyHeavy, fontSize: 10, letterSpacing: 1 },
  noResults: { fontFamily: fonts.accent, fontSize: 15, textAlign: 'center', paddingVertical: 30 },
  /* sheet */
  backdrop: { flex: 1, backgroundColor: 'rgba(24,29,23,0.45)' },
  sheet: { borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 34 },
  grab: { width: 40, height: 4.5, borderRadius: 999, alignSelf: 'center', marginBottom: 14 },
  sheetTitle: { fontFamily: fonts.display, fontSize: 21 },
  sheetSub: { fontFamily: fonts.accent, fontSize: 14, marginTop: 2 },
  label: { fontFamily: fonts.accent, fontSize: 13.5, marginTop: 14, marginBottom: 6 },
  input: { borderWidth: 1.5, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 14, fontFamily: fonts.bodySemi, fontSize: 15 },
  modePick: { flex: 1, borderWidth: 1.5, borderRadius: 14, paddingVertical: 11, alignItems: 'center', justifyContent: 'center' },
  saveBtn: { marginTop: 18, borderRadius: 999, paddingVertical: 15, alignItems: 'center' },
  saveText: { fontFamily: fonts.bodyHeavy, fontSize: 15 },
  /* detail */
  backBtn: { position: 'absolute', top: 60, left: 16, width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  detailTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 18 },
  detailEyebrow: { fontFamily: fonts.accentMed, fontSize: 15 },
  detailTitle: { fontFamily: fonts.display, fontSize: 30, marginTop: 2 },
  rating: { borderRadius: 16, paddingVertical: 8, paddingHorizontal: 13, alignItems: 'center' },
  ratingNum: { fontFamily: fonts.display, fontSize: 19 },
  ratingLab: { fontFamily: fonts.accent, fontSize: 11.5 },
  handNote: { marginTop: 14, borderRadius: 16, paddingVertical: 13, paddingHorizontal: 16 },
  handNoteText: { fontFamily: fonts.accent, fontSize: 15.5, lineHeight: 23 },
  factGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  fact: { width: '47.8%', borderRadius: radius.md, paddingVertical: 12, paddingHorizontal: 13 },
  factLabel: { fontFamily: fonts.accent, fontSize: 13 },
  factValueRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 4 },
  factValue: { fontFamily: fonts.bodyHeavy, fontSize: 12.5, flexShrink: 1 },
  quote: { borderLeftWidth: 3, paddingLeft: 12 },
  quoteText: { fontFamily: fonts.displayItalic, fontSize: 14.5, lineHeight: 22 },
  returnPill: { marginTop: 16, borderRadius: radius.md, paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  returnQ: { fontFamily: fonts.bodyHeavy, fontSize: 14 },
});
