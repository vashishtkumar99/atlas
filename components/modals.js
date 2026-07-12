import React, { useState, useEffect } from 'react';
import {
  View, Text, Modal, TextInput, Pressable, ScrollView,
  KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import Icon from './Icons';
import CityInput from './CityInput';
import { Section, Pill, TripHero, MemoryCard, AddMemoryTile } from './bits';
import { SEARCH_DATA, MODE_WORD } from '../data/demo';
import { fonts, capsStyle, radius, card } from '../theme';
import { fmtDay, legsOf, originOf, segmentsOf, tripKm, haversineKm } from '../utils';

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
              value={q} onChangeText={setQ}
              placeholder="Cities, trips, journeys..." placeholderTextColor={t.muted}
              autoFocus style={[styles.searchInput, { color: t.ink }]}
            />
          </View>
          <Pressable onPress={() => { setQ(''); onClose(); }} hitSlop={10} style={styles.searchClose}>
            <Icon name="close" size={18} color={t.muted} />
          </Pressable>
        </View>
        <Text style={[styles.searchHint, { color: t.muted }]}>
          {query ? (hits.length ? `Found ${hits.length} for "${query}"` : '') : 'Try "florence" or "train"'}
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
              <View style={[styles.kind, { borderColor: t.sageLine }]}>
                <Text style={[styles.kindText, { color: t.sage }]}>{d.kind}</Text>
              </View>
            </Pressable>
          )) : (
            <Text style={[styles.noResults, { color: t.muted }]}>
              Nothing yet — but that sounds like a trip worth taking
            </Text>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

/* ---------------- Add / edit trip (multi-leg) ---------------- */
const MODES = ['plane', 'train', 'car', 'ferry', 'walk'];
const blankLeg = () => ({ cityText: '', picked: null, mode: 'plane' });

export function AddTripSheet({ t, visible, onClose, onSave, onDelete, editing, profile }) {
  const [originText, setOriginText] = useState('');
  const [originPick, setOriginPick] = useState(null);
  const [legs, setLegs] = useState([blankLeg()]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [note, setNote] = useState('');
  const [journal, setJournal] = useState('');
  const [rating, setRating] = useState(0);
  const [wouldReturn, setWouldReturn] = useState(true);
  const [picker, setPicker] = useState(null);

  const homePlaceholder = profile && profile.homeCity ? `Defaults to ${profile.homeCity.split(',')[0]}` : 'Where the trip starts';

  useEffect(() => {
    if (visible && editing) {
      const o = editing.origin;
      setOriginText(o && o.city ? o.city : '');
      setOriginPick(o && o.ll ? { city: o.city, ll: o.ll } : null);
      setLegs(legsOf(editing).map((l) => ({
        cityText: l.city || '',
        picked: l.ll ? { city: l.city, ll: l.ll, country: l.country } : null,
        mode: l.mode || 'plane',
      })));
      setFromDate(editing.fromISO ? new Date(editing.fromISO) : null);
      setToDate(editing.toISO ? new Date(editing.toISO) : null);
      setNote(editing.pills && editing.pills[0] ? editing.pills[0] : '');
      setJournal(editing.journal || '');
      setRating(editing.rating ? Math.round(editing.rating) : 0);
      setWouldReturn(editing.wouldReturn !== false);
    } else if (visible) {
      setOriginText(''); setOriginPick(null);
      setLegs([blankLeg()]);
      setFromDate(null); setToDate(null);
      setNote(''); setJournal(''); setRating(0); setWouldReturn(true);
    }
    setPicker(null);
  }, [visible, editing]);

  const setLeg = (i, patch) => setLegs((prev) => prev.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  const addLeg = () => { setLegs((prev) => [...prev, blankLeg()]); Haptics.selectionAsync().catch(() => {}); };
  const removeLeg = (i) => setLegs((prev) => prev.filter((_, j) => j !== i));

  const save = () => {
    const cleanLegs = legs
      .filter((l) => l.cityText.trim())
      .map((l) => ({
        city: l.picked ? l.picked.city : l.cityText.trim(),
        ll: l.picked ? l.picked.ll : null,
        country: l.picked ? l.picked.country : (l.cityText.includes(',') ? l.cityText.split(',').pop().trim() : null),
        mode: l.mode,
      }));
    if (!cleanLegs.length) cleanLegs.push({ city: 'Somewhere new', ll: null, country: null, mode: 'plane' });
    const last = cleanLegs[cleanLegs.length - 1];
    const dates = fromDate ? `${fmtDay(fromDate)}${toDate ? ` – ${fmtDay(toDate)}` : ''}` : 'Soon';
    onSave({
      id: editing ? editing.id : `trip-${Date.now()}`,
      user: true,
      origin: originPick ? { city: originPick.city, ll: originPick.ll } : (originText.trim() ? { city: originText.trim(), ll: null } : null),
      legs: cleanLegs,
      city: last.city, ll: last.ll, country: last.country,
      mode: cleanLegs[0].mode, modeWord: MODE_WORD[cleanLegs[0].mode],
      fromISO: fromDate ? fromDate.toISOString() : null,
      toISO: toDate ? toDate.toISOString() : null,
      dates,
      pills: note.trim() ? [note.trim()] : [],
      journal: journal.trim(),
      rating: rating || null,
      wouldReturn,
      skyline: 'new',
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  };

  const DateField = ({ label, value, which }) => (
    <View style={{ flex: 1 }}>
      <Text style={[styles.label, { color: t.sage }]}>{label}</Text>
      <Pressable
        onPress={() => { setPicker(picker === which ? null : which); Haptics.selectionAsync().catch(() => {}); }}
        style={[styles.input, styles.dateField, { borderColor: picker === which ? t.sage : t.sageLine, backgroundColor: t.card }]}
      >
        <Text style={{ fontFamily: fonts.body, fontSize: 15, color: value ? t.ink : t.muted }}>
          {value ? fmtDay(value) : 'Pick a date'}
        </Text>
        <Icon name="chev" size={13} color={t.muted} />
      </Pressable>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.sheet, { backgroundColor: t.bg }]}>
          <View style={[styles.grab, { backgroundColor: t.sageLine }]} />
          <ScrollView style={{ maxHeight: 560 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={[styles.sheetTitle, { color: t.ink }]}>{editing ? 'Edit trip' : 'Add a trip'}</Text>
            <Text style={[styles.sheetSub, { color: t.muted }]}>Add stops for a multi-city trip</Text>

            <Text style={[styles.label, { color: t.sage }]}>From</Text>
            <CityInput
              t={t}
              value={originText}
              onChangeText={(txt) => { setOriginText(txt); setOriginPick(null); }}
              onPick={(c) => { setOriginText(c.city); setOriginPick(c); Haptics.selectionAsync().catch(() => {}); }}
              placeholder={homePlaceholder}
            />

            {legs.map((leg, i) => (
              <View key={i}>
                <View style={styles.legHead}>
                  <Text style={[styles.label, { color: t.sage, marginTop: 15 }]}>
                    {legs.length > 1 ? `Stop ${i + 1}` : 'Where to'}
                  </Text>
                  {legs.length > 1 && (
                    <Pressable onPress={() => removeLeg(i)} hitSlop={8}>
                      <Text style={[styles.removeLeg, { color: '#C77B6B' }]}>Remove</Text>
                    </Pressable>
                  )}
                </View>
                <CityInput
                  t={t}
                  value={leg.cityText}
                  onChangeText={(txt) => setLeg(i, { cityText: txt, picked: null })}
                  onPick={(c) => { setLeg(i, { cityText: c.city, picked: c }); Haptics.selectionAsync().catch(() => {}); }}
                />
                <View style={{ flexDirection: 'row', gap: 9, marginTop: 9 }}>
                  {MODES.map((m) => (
                    <Pressable
                      key={m}
                      onPress={() => { setLeg(i, { mode: m }); Haptics.selectionAsync().catch(() => {}); }}
                      style={[
                        styles.modePick,
                        { borderColor: leg.mode === m ? t.sage : t.sageLine, backgroundColor: leg.mode === m ? t.sageTint : t.card },
                      ]}
                    >
                      <Icon name={m} size={17} color={leg.mode === m ? t.sageDeep : t.muted} />
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}

            <Pressable onPress={addLeg} style={[styles.addLeg, { borderColor: t.sageLine }]}>
              <Icon name="plus" size={13} color={t.sage} />
              <Text style={[styles.addLegText, { color: t.muted }]}>Add another stop</Text>
            </Pressable>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <DateField label="From" value={fromDate} which="from" />
              <DateField label="Until" value={toDate} which="to" />
            </View>

            {picker && (
              <View style={[styles.pickerBox, { backgroundColor: t.card, borderColor: t.sageLine }]}>
                <DateTimePicker
                  value={(picker === 'from' ? fromDate : toDate) || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  themeVariant="dark"
                  onChange={(e, d) => {
                    if (Platform.OS !== 'ios') setPicker(null);
                    if (d) { picker === 'from' ? setFromDate(d) : setToDate(d); }
                  }}
                />
                {Platform.OS === 'ios' && (
                  <Pressable onPress={() => setPicker(null)} style={[styles.doneBtn, { backgroundColor: t.sageTint }]}>
                    <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, color: t.sageDeep }}>Done</Text>
                  </Pressable>
                )}
              </View>
            )}

            <Text style={[styles.label, { color: t.sage }]}>Your score</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Pressable key={n} onPress={() => { setRating(n === rating ? 0 : n); Haptics.selectionAsync().catch(() => {}); }} hitSlop={6}>
                  <Icon name="star" size={26} color={n <= rating ? t.gold : t.sageLine} />
                </Pressable>
              ))}
            </View>

            <Text style={[styles.label, { color: t.sage }]}>A little note · optional</Text>
            <TextInput value={note} onChangeText={setNote} placeholder="The best gelato of my life..." placeholderTextColor={t.muted}
              style={[styles.input, { borderColor: t.sageLine, backgroundColor: t.card, color: t.ink }]} />

            <Text style={[styles.label, { color: t.sage }]}>From your journal · optional</Text>
            <TextInput
              value={journal} onChangeText={setJournal} multiline numberOfLines={3}
              placeholder="What do you want to remember?" placeholderTextColor={t.muted}
              style={[styles.input, styles.journalInput, { borderColor: t.sageLine, backgroundColor: t.card, color: t.ink }]}
            />

            <Pressable
              onPress={() => { setWouldReturn(!wouldReturn); Haptics.selectionAsync().catch(() => {}); }}
              style={[styles.returnToggle, { backgroundColor: t.sageTint }]}
            >
              <Text style={[styles.returnQ, { color: t.ink }]}>Would you return?</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                <Icon name={wouldReturn ? 'check' : 'close'} size={15} color={wouldReturn ? t.sageDeep : t.muted} />
                <Text style={[styles.returnQ, { color: wouldReturn ? t.sageDeep : t.muted }]}>
                  {wouldReturn ? 'Absolutely' : 'Probably not'}
                </Text>
              </View>
            </Pressable>

            <Pressable onPress={save} style={({ pressed }) => [styles.saveBtn, { backgroundColor: t.sageDeep, transform: [{ scale: pressed ? 0.97 : 1 }] }]}>
              <Text style={[styles.saveText, { color: t.saveText }]}>{editing ? 'Save changes' : 'Save to my map'}</Text>
            </Pressable>

            {editing && (
              <Pressable onPress={() => onDelete(editing.id)} style={({ pressed }) => [styles.deleteBtn, { opacity: pressed ? 0.6 : 1 }]}>
                <Text style={[styles.deleteText, { color: '#C77B6B' }]}>Delete this trip</Text>
              </Pressable>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* ---------------- Your trip detail ---------------- */
export function UserTripDetail({ t, trip, profile, visible, onClose, onEdit }) {
  if (!trip) return null;
  const segs = segmentsOf(trip, profile);
  const km = Math.round(tripKm(trip, profile));
  const cityName = (trip.city || '').split(',')[0];
  const countryName = trip.country || '';

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView style={{ backgroundColor: t.bg }} contentContainerStyle={{ paddingBottom: 44 }} showsVerticalScrollIndicator={false}>
        <View>
          <TripHero t={t} variant={trip.skyline || 'new'} height={220} />
          <Pressable onPress={onClose} style={[styles.backBtn, card(t)]}>
            <Icon name="chevBack" size={17} color={t.ink} />
          </Pressable>
        </View>
        <View style={{ paddingHorizontal: 18 }}>
          <View style={styles.detailTop}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={[styles.detailEyebrow, { color: t.sage }]}>{countryName || 'Your trip'}</Text>
              <Text style={[styles.detailTitle, { color: t.ink }]}>{cityName}</Text>
            </View>
            {trip.rating ? (
              <View style={[styles.rating, card(t)]}>
                <Text style={[styles.ratingNum, { color: t.gold }]}>{trip.rating}</Text>
                <Text style={[styles.ratingLab, { color: t.muted }]}>your score</Text>
              </View>
            ) : null}
          </View>

          <View style={[styles.handNote, { backgroundColor: t.sageTint }]}>
            <Text style={[styles.handNoteText, { color: t.sageDeep }]}>{trip.dates}{km ? ` · ${km.toLocaleString()} km` : ''}</Text>
          </View>

          <Section t={t} title="The route" />
          {segs.map((seg, i) => (
            <View key={i} style={[styles.segRow, card(t)]}>
              <View style={[styles.segIcon, { backgroundColor: t.sageTint }]}>
                <Icon name={seg.to.mode || 'plane'} size={15} color={t.sageDeep} />
              </View>
              <Text style={[styles.segText, { color: t.ink }]} numberOfLines={1}>
                {(seg.from.city || 'Home').split(',')[0]}  →  {(seg.to.city || '').split(',')[0]}
              </Text>
              <Text style={[styles.segKm, { color: t.muted }]}>
                {seg.from.ll && seg.to.ll ? `${Math.round(haversineKm(seg.from.ll, seg.to.ll)).toLocaleString()} km` : ''}
              </Text>
            </View>
          ))}

          {trip.journal ? (
            <>
              <Section t={t} title="From your journal" />
              <View style={[styles.quote, { borderLeftColor: t.gold }]}>
                <Text style={[styles.quoteText, { color: t.ink }]}>"{trip.journal}"</Text>
              </View>
            </>
          ) : null}

          <View style={[styles.returnPill, { backgroundColor: t.sageTint }]}>
            <Text style={[styles.returnQ, { color: t.ink }]}>Would you return?</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
              <Icon name={trip.wouldReturn !== false ? 'check' : 'close'} size={15} color={t.sageDeep} />
              <Text style={[styles.returnQ, { color: t.sageDeep }]}>{trip.wouldReturn !== false ? 'Absolutely' : 'Probably not'}</Text>
            </View>
          </View>

          <Pressable onPress={() => onEdit(trip)} style={({ pressed }) => [styles.saveBtn, { backgroundColor: t.sageDeep, transform: [{ scale: pressed ? 0.97 : 1 }] }]}>
            <Text style={[styles.saveText, { color: t.saveText }]}>Edit this trip</Text>
          </Pressable>
        </View>
      </ScrollView>
    </Modal>
  );
}

/* ---------------- Trips in a country (from a stamp) ---------------- */
export function CountryTripsModal({ t, visible, country, trips, profile, onClose, onOpenTrip }) {
  const matches = trips.filter((tr) => legsOf(tr).some((l) => l.country === country));
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { backgroundColor: t.bg }]}>
        <View style={[styles.grab, { backgroundColor: t.sageLine }]} />
        <Text style={[styles.sheetTitle, { color: t.ink }]}>{country}</Text>
        <Text style={[styles.sheetSub, { color: t.muted }]}>
          {matches.length} {matches.length === 1 ? 'trip' : 'trips'} in your passport
        </Text>
        <ScrollView style={{ maxHeight: 380, marginTop: 14 }} showsVerticalScrollIndicator={false}>
          {matches.map((tr) => (
            <Pressable
              key={tr.id}
              onPress={() => { onClose(); setTimeout(() => onOpenTrip(tr), 260); }}
              style={({ pressed }) => [styles.result, card(t), pressed && { transform: [{ scale: 0.975 }] }]}
            >
              <View style={[styles.resultIcon, { backgroundColor: t.sageTint }]}>
                <Icon name={tr.mode || 'plane'} size={17} color={t.sageDeep} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.resultTitle, { color: t.ink }]}>{(tr.city || '').split(',')[0]}</Text>
                <Text style={[styles.resultSub, { color: t.muted }]}>{tr.dates}{tr.rating ? ` · rated ${tr.rating}` : ''}</Text>
              </View>
              <Icon name="chev" size={14} color={t.muted} />
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

/* ---------------- Profile ("login") ---------------- */
export function ProfileModal({ t, visible, profile, onSaveProfile, onLogout, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [homeText, setHomeText] = useState('');
  const [home, setHome] = useState(null);

  useEffect(() => {
    if (visible && profile) {
      setName(profile.name || '');
      setEmail(profile.email || '');
      setHomeText(profile.homeCity || '');
      setHome(profile.homeLL ? { city: profile.homeCity, ll: profile.homeLL } : null);
    }
  }, [visible, profile]);

  const save = () => {
    onSaveProfile({
      ...profile,
      name: name.trim() || (profile && profile.name) || 'Traveler',
      email: email.trim(),
      homeCity: home ? home.city : homeText.trim(),
      homeLL: home ? home.ll : (profile ? profile.homeLL : null),
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.sheet, { backgroundColor: t.bg }]}>
          <View style={[styles.grab, { backgroundColor: t.sageLine }]} />
          <Text style={[styles.sheetTitle, { color: t.ink }]}>Your account</Text>
          <Text style={[styles.sheetSub, { color: t.muted }]}>Saved on this device · cloud sync coming soon</Text>

          <Text style={[styles.label, { color: t.sage }]}>Name</Text>
          <TextInput value={name} onChangeText={setName} placeholderTextColor={t.muted}
            style={[styles.input, { borderColor: t.sageLine, backgroundColor: t.card, color: t.ink }]} />

          <Text style={[styles.label, { color: t.sage }]}>Email</Text>
          <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholderTextColor={t.muted}
            style={[styles.input, { borderColor: t.sageLine, backgroundColor: t.card, color: t.ink }]} />

          <Text style={[styles.label, { color: t.sage }]}>Home base</Text>
          <CityInput
            t={t}
            value={homeText}
            onChangeText={(txt) => { setHomeText(txt); setHome(null); }}
            onPick={(c) => { setHomeText(c.city); setHome(c); }}
          />

          <Pressable onPress={save} style={({ pressed }) => [styles.saveBtn, { backgroundColor: t.sageDeep, transform: [{ scale: pressed ? 0.97 : 1 }] }]}>
            <Text style={[styles.saveText, { color: t.saveText }]}>Save</Text>
          </Pressable>

          <Pressable onPress={onLogout} style={({ pressed }) => [styles.deleteBtn, { opacity: pressed ? 0.6 : 1 }]}>
            <Text style={[styles.deleteText, { color: '#C77B6B' }]}>Log out</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* ---------------- Florence detail (showcase) ---------------- */
const FACTS = [
  ['Arrived', 'By train from Milan', 'train'],
  ['Stayed', '6 days, 5 nights', 'pin'],
  ['Walked', '42.6 km', 'walk'],
  ['Weather', '31° and golden', 'sun'],
  ['Best bite', 'Gelateria dei Neri', 'cup'],
  ['Mood', 'Slow and sunny', 'star'],
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
            <MemoryCard t={t} caption="The Duomo" variant="duomo" tilt="-2deg" />
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
  searchPage: { flex: 1, paddingTop: 64, paddingHorizontal: 18 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 999, borderWidth: 1, paddingVertical: 12, paddingHorizontal: 17 },
  searchInput: { flex: 1, fontFamily: fonts.body, fontSize: 15.5, padding: 0 },
  searchClose: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  searchHint: { fontFamily: fonts.bodySemi, fontSize: 12.5, marginVertical: 14, marginLeft: 4, letterSpacing: 0.2 },
  result: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: radius.md, paddingVertical: 13, paddingHorizontal: 15, marginBottom: 10 },
  resultIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  resultTitle: { fontFamily: fonts.bodyBold, fontSize: 14 },
  resultSub: { fontFamily: fonts.bodySemi, fontSize: 12.5, marginTop: 2 },
  kind: { borderRadius: 999, borderWidth: 1, paddingVertical: 4, paddingHorizontal: 10 },
  kindText: { ...capsStyle, fontSize: 9 },
  noResults: { fontFamily: fonts.bodySemi, fontSize: 14, textAlign: 'center', paddingVertical: 30 },
  backdrop: { flex: 1, backgroundColor: 'rgba(10,13,8,0.55)' },
  sheet: { borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 34 },
  grab: { width: 40, height: 4.5, borderRadius: 999, alignSelf: 'center', marginBottom: 14 },
  sheetTitle: { fontFamily: fonts.display, fontSize: 20, letterSpacing: -0.3 },
  sheetSub: { fontFamily: fonts.bodySemi, fontSize: 13, marginTop: 3 },
  label: { ...capsStyle, marginTop: 15, marginBottom: 7 },
  input: { borderWidth: 1, borderRadius: 14, paddingVertical: 13, paddingHorizontal: 15, fontFamily: fonts.body, fontSize: 15 },
  journalInput: { minHeight: 76, textAlignVertical: 'top' },
  dateField: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pickerBox: { borderWidth: 1, borderRadius: 16, marginTop: 10, overflow: 'hidden', paddingBottom: 8 },
  doneBtn: { alignSelf: 'center', borderRadius: 999, paddingVertical: 7, paddingHorizontal: 22 },
  modePick: { flex: 1, borderWidth: 1, borderRadius: 14, paddingVertical: 11, alignItems: 'center', justifyContent: 'center' },
  legHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  removeLeg: { fontFamily: fonts.bodySemi, fontSize: 12 },
  addLeg: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, borderWidth: 1.5, borderStyle: 'dashed', borderRadius: 14, paddingVertical: 11, marginTop: 14 },
  addLegText: { fontFamily: fonts.bodySemi, fontSize: 12.5 },
  returnToggle: { marginTop: 16, borderRadius: radius.md, paddingVertical: 13, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  saveBtn: { marginTop: 20, borderRadius: 999, paddingVertical: 15, alignItems: 'center' },
  saveText: { fontFamily: fonts.bodyHeavy, fontSize: 15 },
  deleteBtn: { marginTop: 12, alignItems: 'center', paddingVertical: 6 },
  deleteText: { fontFamily: fonts.bodySemi, fontSize: 13.5 },
  backBtn: { position: 'absolute', top: 60, left: 16, width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  detailTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 18 },
  detailEyebrow: { ...capsStyle },
  detailTitle: { fontFamily: fonts.display, fontSize: 28, letterSpacing: -0.5, marginTop: 4 },
  rating: { borderRadius: 16, paddingVertical: 8, paddingHorizontal: 13, alignItems: 'center' },
  ratingNum: { fontFamily: fonts.display, fontSize: 18 },
  ratingLab: { fontFamily: fonts.bodySemi, fontSize: 10.5, marginTop: 1 },
  handNote: { marginTop: 14, borderRadius: 16, paddingVertical: 13, paddingHorizontal: 16 },
  handNoteText: { fontFamily: fonts.bodySemi, fontSize: 13.5, lineHeight: 21 },
  factGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  fact: { width: '47.8%', borderRadius: radius.md, paddingVertical: 12, paddingHorizontal: 13 },
  factLabel: { ...capsStyle, fontSize: 9.5 },
  factValueRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 6 },
  factValue: { fontFamily: fonts.bodyBold, fontSize: 12.5, flexShrink: 1 },
  quote: { borderLeftWidth: 3, paddingLeft: 12 },
  quoteText: { fontFamily: fonts.displayItalic, fontSize: 14, lineHeight: 22 },
  returnPill: { marginTop: 16, borderRadius: radius.md, paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  returnQ: { fontFamily: fonts.bodyBold, fontSize: 13.5 },
  segRow: { flexDirection: 'row', alignItems: 'center', gap: 11, borderRadius: radius.md, paddingVertical: 12, paddingHorizontal: 14, marginBottom: 9 },
  segIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  segText: { fontFamily: fonts.bodyBold, fontSize: 13.5, flex: 1 },
  segKm: { fontFamily: fonts.bodySemi, fontSize: 11.5 },
});
