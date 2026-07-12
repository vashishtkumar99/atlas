import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, Modal, Animated, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Icon from '../components/Icons';
import { Section } from '../components/bits';
import { fonts, capsStyle, radius, card } from '../theme';
import { computeBadges } from '../utils';

function Stamp({ t, stamp, isNew, onPress }) {
  const scale = useRef(new Animated.Value(isNew ? 2.1 : 1)).current;
  React.useEffect(() => {
    if (isNew) {
      Animated.spring(scale, { toValue: 1, friction: 4.5, tension: 120, useNativeDriver: true }).start();
    }
  }, [isNew, scale]);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.stamp, card(t), pressed && { transform: [{ scale: 0.97 }] }]}>
      <Animated.View style={[styles.stampFrame, { borderColor: t.gold, transform: [{ rotate: stamp.rot }, { scale }] }]}>
        <Icon name={stamp.mode} size={19} color={t.gold} />
        <Text style={[styles.stampCountry, { color: t.gold }]}>{stamp.country}</Text>
        <Text style={[styles.stampVia, { color: t.gold }]}>{stamp.via}</Text>
        <Text style={[styles.stampDate, { color: t.gold }]}>{stamp.date}</Text>
      </Animated.View>
    </Pressable>
  );
}

function Badge({ t, badge }) {
  const R = 28, C = 2 * Math.PI * R;
  const color = badge.done ? t.gold : t.sage;
  return (
    <View style={[styles.badge, card(t), !badge.done && badge.progress === 0 && { opacity: 0.55 }]}>
      <View style={{ width: 64, height: 64, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={64} height={64} style={StyleSheet.absoluteFill}>
          <Circle cx={32} cy={32} r={R} stroke={t.sageTint} strokeWidth={6} fill="none" />
          <Circle
            cx={32} cy={32} r={R} stroke={color} strokeWidth={6} fill="none"
            strokeDasharray={`${(C * badge.progress) / 100} ${C}`}
            strokeLinecap="round" transform="rotate(-90 32 32)"
          />
        </Svg>
        <Icon name={badge.icon} size={26} color={badge.done ? t.gold : t.sageDeep} />
      </View>
      <Text style={[styles.badgeName, { color: badge.done ? t.gold : t.ink }]} numberOfLines={1}>{badge.name}</Text>
      <Text style={[styles.badgeSub, { color: t.muted }]} numberOfLines={1}>{badge.sub}</Text>
    </View>
  );
}

export default function PassportScreen({ t, stamps, trips, profile, newStampId, onStampPress }) {
  const [allBadges, setAllBadges] = useState(false);
  const name = profile && profile.name ? profile.name : 'Traveler';
  const countryCount = new Set(stamps.map((s) => s.country)).size;
  const badges = computeBadges(trips, profile);
  const earned = badges.filter((b) => b.done).length;

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={[styles.eyebrow, { color: t.sage }]}>Digital passport</Text>
      <Text style={[styles.big, { color: t.ink }]}>Your stamps</Text>
      <Text style={[styles.sub, { color: t.muted }]}>Tap a stamp to see your trips there</Text>

      <View style={[styles.cover, { backgroundColor: t.globeCardA, borderColor: t.sageLine }]}>
        <Icon name="compass" size={32} color={t.gold} />
        <Text style={[styles.coverTitle, { color: t.ink }]}>PASSPORT</Text>
        <Text style={[styles.coverSub, { color: t.onGlobeMuted }]}>
          {name} · {countryCount} {countryCount === 1 ? 'country' : 'countries'} and counting
        </Text>
        <View style={[styles.goldLine, { backgroundColor: t.gold }]} />
      </View>

      {stamps.length === 0 ? (
        <Text style={[styles.empty, { color: t.muted }]}>
          Add a trip with a city from the suggestions and your first stamp appears here.
        </Text>
      ) : (
        <View style={styles.grid}>
          {stamps.map((s) => (
            <Stamp key={s.id} t={t} stamp={s} isNew={s.id === newStampId} onPress={() => onStampPress(s.country)} />
          ))}
        </View>
      )}

      <Section t={t} title={`Badges · ${earned} of ${badges.length}`} action="See all" onAction={() => setAllBadges(true)} />
      <View style={styles.grid}>
        {badges.slice(0, 4).map((b) => (
          <Badge key={b.id} t={t} badge={b} />
        ))}
      </View>

      {/* all badges gallery */}
      <Modal visible={allBadges} animationType="slide" onRequestClose={() => setAllBadges(false)}>
        <View style={{ flex: 1, backgroundColor: t.bg, paddingTop: 64 }}>
          <View style={styles.galleryHead}>
            <View>
              <Text style={[styles.eyebrow, { color: t.sage }]}>Gamified geography</Text>
              <Text style={[styles.big, { color: t.ink }]}>All badges</Text>
              <Text style={[styles.sub, { color: t.muted }]}>{earned} earned · {badges.length - earned} to go</Text>
            </View>
            <Pressable onPress={() => setAllBadges(false)} hitSlop={10} style={styles.closeBtn}>
              <Icon name="close" size={19} color={t.muted} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
            <View style={styles.grid}>
              {badges.map((b) => (
                <Badge key={b.id} t={t} badge={b} />
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, paddingTop: 6, paddingBottom: 118 },
  eyebrow: { ...capsStyle, fontSize: 11, letterSpacing: 3 },
  big: { fontFamily: fonts.display, fontSize: 26, letterSpacing: -0.5, marginTop: 6 },
  sub: { fontFamily: fonts.bodySemi, fontSize: 13, marginTop: 4 },
  cover: { marginTop: 14, borderRadius: radius.lg, paddingVertical: 22, alignItems: 'center', borderWidth: 1 },
  coverTitle: { fontFamily: fonts.display, fontSize: 17, marginTop: 9, letterSpacing: 5 },
  coverSub: { fontFamily: fonts.bodySemi, fontSize: 12.5, marginTop: 6 },
  goldLine: { height: 1.5, width: '70%', marginTop: 13, opacity: 0.7 },
  empty: { fontFamily: fonts.bodySemi, fontSize: 13, textAlign: 'center', marginTop: 22, lineHeight: 20, paddingHorizontal: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  stamp: { width: '47.5%', borderRadius: radius.md, padding: 13 },
  stampFrame: { borderWidth: 2, borderRadius: 13, paddingVertical: 12, paddingHorizontal: 6, alignItems: 'center' },
  stampCountry: { fontFamily: fonts.displaySemi, fontSize: 12.5, letterSpacing: 1, textTransform: 'uppercase', marginTop: 4, textAlign: 'center' },
  stampVia: { fontFamily: fonts.bodySemi, fontSize: 11, marginTop: 3, letterSpacing: 0.2 },
  stampDate: { ...capsStyle, fontSize: 9, marginTop: 5, opacity: 0.85 },
  badge: { width: '47.5%', borderRadius: 20, paddingVertical: 14, paddingHorizontal: 8, alignItems: 'center' },
  badgeName: { fontFamily: fonts.displaySemi, fontSize: 12.5, marginTop: 9, letterSpacing: -0.1 },
  badgeSub: { fontFamily: fonts.bodySemi, fontSize: 11, marginTop: 2 },
  galleryHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 18, paddingBottom: 8 },
  closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
});
