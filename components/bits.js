import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import Icon from './Icons';
import { fonts, capsStyle, radius, card } from '../theme';

export function Section({ t, title, action, onAction }) {
  return (
    <View style={styles.sec}>
      <Text style={[styles.secTitle, { color: t.ink }]}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction} hitSlop={10}>
          <Text style={[styles.secAction, { color: t.sage }]}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

// Cleaner pill: outlined, medium weight — no more heavy bold
export function Pill({ t, icon, children }) {
  return (
    <View style={[styles.pill, { borderColor: t.sageLine }]}>
      {icon ? <Icon name={icon} size={13} color={t.sageDeep} /> : null}
      <Text style={[styles.pillText, { color: t.sageDeep }]}>{children}</Text>
    </View>
  );
}

export function Chip({ t, icon, num, label }) {
  return (
    <View style={[styles.chip, { backgroundColor: t.card, borderColor: t.sageLine }]}>
      <View style={styles.chipNumRow}>
        {icon ? <Icon name={icon} size={16} color={t.sage} /> : null}
        <Text style={[styles.chipNum, { color: t.ink }]}>{num}</Text>
      </View>
      <Text style={[styles.chipLab, { color: t.muted }]}>{label}</Text>
    </View>
  );
}

export function AddRow({ t, label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.addRow,
        { borderColor: t.sageLine, backgroundColor: pressed ? t.sageTint : 'transparent' },
      ]}
    >
      <Icon name="plus" size={15} color={t.sage} />
      <Text style={[styles.addRowText, { color: t.muted }]}>{label}</Text>
    </Pressable>
  );
}

// Illustrated skylines — Florence keeps its dome; 'new' is a generic town.
export function Skyline({ t, variant = 'florence', height = 74 }) {
  const paths =
    variant === 'florence'
      ? {
          back: 'M0 74 L0 48 L22 48 L22 38 L36 38 L36 48 L64 48 L64 30 L70 30 L70 22 L74 22 L74 30 L80 30 L80 48 L112 48 L112 40 L146 40 L146 52 L170 52 L170 34 Q170 20 200 16 Q230 20 230 34 L230 52 L233 52 L233 26 L239 26 L239 18 L243 14 L247 18 L247 26 L253 26 L253 52 L282 52 L282 42 L316 42 L316 54 L352 54 L352 44 L372 44 L372 54 L400 54 L400 74 Z',
          front: 'M0 74 L0 60 L52 60 L52 54 L118 54 L118 62 L206 62 L206 56 L288 56 L288 64 L400 64 L400 74 Z',
          dome: [200, 16],
        }
      : {
          back: 'M0 74 L0 50 L28 50 L28 40 L44 40 L44 50 L78 50 L78 32 L92 24 L106 32 L106 50 L142 50 L142 42 L178 42 L178 54 L214 54 L214 34 L226 26 L238 34 L238 54 L274 54 L274 44 L310 44 L310 56 L350 56 L350 46 L400 46 L400 74Z',
          front: 'M0 74 L0 62 L60 62 L60 56 L140 56 L140 64 L240 64 L240 58 L330 58 L330 66 L400 66 L400 74Z',
          dome: null,
        };
  return (
    <Svg width="100%" height={height} viewBox="0 0 400 74" preserveAspectRatio="none">
      <Path d={paths.back} fill={t.sil1} />
      <Path d={paths.front} fill={t.sil2} />
      {paths.dome ? <Circle cx={paths.dome[0]} cy={paths.dome[1]} r={3.4} fill={t.sil2} /> : null}
    </Svg>
  );
}

export function TripHero({ t, variant, height = 132 }) {
  return (
    <View style={{ height, overflow: 'hidden', backgroundColor: t.heroA }}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: t.heroB, opacity: 0.55 }]} />
      <View
        style={{
          position: 'absolute', top: 20, right: 36, width: 46, height: 46, borderRadius: 23,
          backgroundColor: t.sun, shadowColor: t.sun, shadowOpacity: 0.8, shadowRadius: 18, elevation: 6,
        }}
      />
      <View style={{ position: 'absolute', bottom: -1, left: 0, right: 0 }}>
        <Skyline t={t} variant={variant} />
      </View>
    </View>
  );
}

export function MemoryCard({ t, caption, variant = 'new', tilt = '0deg', onPress }) {
  const art = {
    duomo: (
      <Svg width="100%" height={82} viewBox="0 0 96 82">
        <Rect width="96" height="82" fill="#DCE5D2" />
        <Circle cx="70" cy="18" r="9" fill="#F2E9C8" />
        <Path d="M0 82 L0 56 L14 56 L14 46 L24 46 L24 56 L40 56 L40 34 Q40 26 52 24 Q64 26 64 34 L64 56 L78 56 L78 48 L96 48 L96 82Z" fill="#6D7F65" />
        <Circle cx="52" cy="24" r="2" fill="#55654F" />
      </Svg>
    ),
    coast: (
      <Svg width="100%" height={82} viewBox="0 0 96 82">
        <Rect width="96" height="82" fill="#D4E0DC" />
        <Circle cx="24" cy="16" r="8" fill="#F4EDD2" />
        <Path d="M0 82 L0 58 L18 58 L18 50 L30 50 L30 58 L44 58 L44 40 L50 34 L56 40 L56 58 L74 58 L74 52 L96 52 L96 82Z" fill="#5E7268" />
        <Path d="M8 70c4 2 8 2 12 0s8-2 12 0 8 2 12 0 8-2 12 0 8 2 12 0 8-2 12 0" stroke="#4A5C52" fill="none" strokeWidth={1.4} />
      </Svg>
    ),
    tower: (
      <Svg width="100%" height={82} viewBox="0 0 96 82">
        <Rect width="96" height="82" fill="#E3E0D0" />
        <Circle cx="72" cy="16" r="8" fill="#F6EFD8" />
        <Path d="M0 82 L0 60 L20 60 L20 52 L34 52 L34 60 L42 60 L48 18 L54 60 L64 60 L64 50 L80 50 L80 60 L96 60 L96 82Z" fill="#75705C" />
        <Path d="M45 40h6M43 50h10" stroke="#5C584A" strokeWidth={1.4} />
      </Svg>
    ),
    bridge: (
      <Svg width="100%" height={82} viewBox="0 0 96 82">
        <Rect width="96" height="82" fill="#E6E2CE" />
        <Path d="M0 62 L96 62 L96 82 L0 82Z" fill="#75705C" />
        <Path d="M12 62 L12 46 Q24 34 36 46 L36 62M40 62 L40 46 Q52 34 64 46 L64 62M68 62 L68 46 Q80 34 92 46 L92 62" fill="#8A8468" />
        <Path d="M0 70h96" stroke="#5C584A" strokeWidth={1.4} />
      </Svg>
    ),
    new: (
      <Svg width="100%" height={82} viewBox="0 0 96 82">
        <Rect width="96" height="82" fill="#E0E6D6" />
        <Circle cx="26" cy="18" r="8" fill="#F4EDD2" />
        <Path d="M0 82 L0 58 L96 58 L96 82Z" fill="#6D7F65" />
        <Path d="M14 58 L28 40 L42 58M52 58 L68 34 L84 58" fill="#7E8F74" />
      </Svg>
    ),
  };
  return (
    <Pressable onPress={onPress} style={[styles.mem, card(t), { transform: [{ rotate: tilt }] }]}>
      {art[variant] || art.new}
      <Text style={[styles.memCap, { color: t.muted }]}>{caption}</Text>
    </Pressable>
  );
}

export function AddMemoryTile({ t, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.mem, styles.memAdd,
        { borderColor: t.sageLine, backgroundColor: pressed ? t.sageTint : 'transparent' },
      ]}
    >
      <Icon name="camera" size={22} color={t.sage} />
      <Text style={[styles.memAddText, { color: t.muted }]}>Add a photo</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sec: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 24, marginBottom: 11, marginHorizontal: 2 },
  secTitle: { fontFamily: fonts.display, fontSize: 17, letterSpacing: -0.3 },
  secAction: { fontFamily: fonts.bodySemi, fontSize: 12.5 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 999, borderWidth: 1, paddingVertical: 6, paddingHorizontal: 13 },
  pillText: { fontFamily: fonts.bodySemi, fontSize: 12, letterSpacing: 0.2 },
  chip: { flex: 1, borderRadius: radius.md, borderWidth: 1, borderStyle: 'dashed', paddingVertical: 13, paddingHorizontal: 8, alignItems: 'center' },
  chipNumRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  chipNum: { fontFamily: fonts.display, fontSize: 20, letterSpacing: -0.3 },
  chipLab: { ...capsStyle, fontSize: 9.5, marginTop: 6 },
  addRow: { borderWidth: 1.5, borderStyle: 'dashed', borderRadius: 20, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, marginBottom: 14 },
  addRowText: { fontFamily: fonts.bodySemi, fontSize: 13.5, letterSpacing: 0.2 },
  mem: { width: 96, height: 122, borderRadius: 16, overflow: 'hidden', marginRight: 10 },
  memCap: { fontFamily: fonts.bodySemi, fontSize: 11.5, textAlign: 'center', paddingTop: 9, letterSpacing: 0.2 },
  memAdd: { borderWidth: 1.5, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 6, shadowOpacity: 0, elevation: 0 },
  memAddText: { fontFamily: fonts.bodySemi, fontSize: 11.5 },
});
