import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, Animated, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import Icon from '../components/Icons';
import { Section } from '../components/bits';
import { STAMPS, PORTUGAL_STAMP, BADGES } from '../data/demo';
import { fonts, radius, card } from '../theme';

function Stamp({ t, stamp, isNew }) {
  const scale = useRef(new Animated.Value(isNew ? 2.1 : 1)).current;
  React.useEffect(() => {
    if (isNew) {
      Animated.spring(scale, { toValue: 1, friction: 4.5, tension: 120, useNativeDriver: true }).start();
    }
  }, [isNew, scale]);
  return (
    <View style={[styles.stamp, card(t)]}>
      <Animated.View style={[styles.stampFrame, { borderColor: t.gold, transform: [{ rotate: stamp.rot }, { scale }] }]}>
        <Icon name={stamp.mode} size={19} color={t.gold} />
        <Text style={[styles.stampCountry, { color: t.gold }]}>{stamp.country.toUpperCase()}</Text>
        <Text style={[styles.stampVia, { color: t.gold }]}>{stamp.via}</Text>
        <Text style={[styles.stampDate, { color: t.gold }]}>{stamp.date}</Text>
      </Animated.View>
    </View>
  );
}

function Badge({ t, badge }) {
  const R = 28, C = 2 * Math.PI * R;
  const color = badge.done ? t.gold : t.sage;
  return (
    <View style={[styles.badge, card(t)]}>
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
      <Text style={[styles.badgeName, { color: badge.done ? t.gold : t.ink }]}>{badge.name}</Text>
      <Text style={[styles.badgeSub, { color: t.muted }]}>{badge.sub}</Text>
    </View>
  );
}

export default function PassportScreen({ t }) {
  const [stamps, setStamps] = useState(STAMPS);
  const [stamped, setStamped] = useState(false);

  const addStamp = () => {
    if (stamped) return;
    setStamps([PORTUGAL_STAMP, ...stamps]);
    setStamped(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={[styles.eyebrow, { color: t.sage }]}>digital passport</Text>
      <Text style={[styles.big, { color: t.ink }]}>Your stamps</Text>
      <Text style={[styles.sub, { color: t.muted }]}>One for every border you've crossed</Text>

      <View style={[styles.cover, { backgroundColor: t.globeCardA }]}>
        <Icon name="compass" size={34} color={t.gold} />
        <Text style={styles.coverTitle}>P A S S P O R T</Text>
        <Text style={[styles.coverSub, { color: t.onGlobeMuted }]}>
          Maya · {stamped ? '24' : '23'} countries and counting
        </Text>
        <View style={[styles.goldLine, { backgroundColor: t.gold }]} />
      </View>

      <View style={styles.grid}>
        {stamps.map((s, i) => (
          <Stamp key={s.id} t={t} stamp={s} isNew={stamped && i === 0} />
        ))}
      </View>

      <Pressable
        onPress={addStamp}
        disabled={stamped}
        style={({ pressed }) => [
          styles.stampBtn,
          { backgroundColor: t.sageDeep, opacity: stamped ? 0.6 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] },
        ]}
      >
        <Icon name={stamped ? 'check' : 'flag'} size={17} color={t.saveText} />
        <Text style={[styles.stampBtnText, { color: t.saveText }]}>
          {stamped ? 'Stamped — country 24 unlocked' : 'Stamp Portugal — you just landed'}
        </Text>
      </Pressable>

      <Section t={t} title="Your badges" action="All 24" />
      <View style={styles.grid}>
        {BADGES.map((b) => (
          <Badge key={b.id} t={t} badge={b} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, paddingTop: 6, paddingBottom: 118 },
  eyebrow: { fontFamily: fonts.accentMed, fontSize: 15 },
  big: { fontFamily: fonts.display, fontSize: 29, marginTop: 2 },
  sub: { fontFamily: fonts.bodySemi, fontSize: 13.5, marginTop: 3 },
  cover: { marginTop: 14, borderRadius: radius.lg, paddingVertical: 22, alignItems: 'center' },
  coverTitle: { fontFamily: fonts.display, fontSize: 20, color: '#EFF1E3', marginTop: 8, letterSpacing: 4 },
  coverSub: { fontFamily: fonts.accent, fontSize: 15, marginTop: 5 },
  goldLine: { height: 1.5, width: '70%', marginTop: 12, opacity: 0.8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  stamp: { width: '47.5%', borderRadius: radius.md, padding: 13 },
  stampFrame: { borderWidth: 2.5, borderRadius: 13, paddingVertical: 11, paddingHorizontal: 6, alignItems: 'center' },
  stampCountry: { fontFamily: fonts.displaySemi, fontSize: 14.5, letterSpacing: 1.5, marginTop: 3 },
  stampVia: { fontFamily: fonts.accent, fontSize: 13, marginTop: 2 },
  stampDate: { fontFamily: fonts.bodyHeavy, fontSize: 10, letterSpacing: 1.4, marginTop: 4, opacity: 0.85 },
  stampBtn: { marginTop: 16, borderRadius: 999, paddingVertical: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  stampBtnText: { fontFamily: fonts.bodyHeavy, fontSize: 14.5 },
  badge: { width: '47.5%', borderRadius: 20, paddingVertical: 14, alignItems: 'center' },
  badgeName: { fontFamily: fonts.displaySemi, fontSize: 13.5, marginTop: 9 },
  badgeSub: { fontFamily: fonts.accent, fontSize: 12.5, marginTop: 2 },
});
