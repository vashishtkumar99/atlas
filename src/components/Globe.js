import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, PanResponder, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Circle, Path, G, Defs, RadialGradient, Stop } from 'react-native-svg';
import { geoOrthographic, geoPath, geoGraticule10, geoDistance } from 'd3-geo';
import { LAND, CITIES, ROUTES } from '../data/geo';
import { fonts } from '../theme';

const SIZE = 272;
const R = 118;
const AUTO = 0.05; // gentle auto-spin

export default function Globe({ t, extraCities = [] }) {
  const projection = useRef(
    geoOrthographic().translate([SIZE / 2, SIZE / 2]).scale(R).clipAngle(90).rotate([-8, -24])
  ).current;
  const pathGen = useMemo(() => geoPath(projection), [projection]);

  const [, force] = useState(0); // re-render tick
  const [callout, setCallout] = useState(null);
  const velocity = useRef(AUTO);
  const dragging = useRef(false);
  const startRot = useRef([0, 0]);
  const lastDX = useRef(0);
  const pulse = useRef(0);

  useEffect(() => {
    let raf;
    let frame = 0;
    const loop = () => {
      frame += 1;
      pulse.current += 0.08;
      if (!dragging.current) {
        velocity.current += (AUTO - velocity.current) * 0.02;
        const r = projection.rotate();
        projection.rotate([r[0] + velocity.current * 6, r[1], r[2]]);
      }
      if (frame % 2 === 0) force((n) => n + 1); // ~30fps redraw is plenty
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [projection]);

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > Math.abs(g.dy) + 4,
      onPanResponderGrant: () => {
        dragging.current = true;
        startRot.current = projection.rotate();
        setCallout(null);
      },
      onPanResponderMove: (_, g) => {
        lastDX.current = g.vx;
        const [l0, p0] = startRot.current;
        projection.rotate([
          l0 + g.dx * 0.45,
          Math.max(-70, Math.min(70, p0 - g.dy * 0.45)),
        ]);
      },
      onPanResponderRelease: () => {
        dragging.current = false;
        velocity.current = Math.max(-2.2, Math.min(2.2, lastDX.current * 8));
      },
      onPanResponderTerminate: () => { dragging.current = false; },
    })
  ).current;

  const graticuleD = pathGen(geoGraticule10());
  const landFeatures = useMemo(
    () => Object.values(LAND).map((ring) => ({ type: 'Polygon', coordinates: [ring] })),
    []
  );
  const routeFeatures = useMemo(
    () => ROUTES.map(([a, b]) => ({ type: 'LineString', coordinates: [CITIES[a].ll, CITIES[b].ll] })),
    []
  );
  const center = [-projection.rotate()[0], -projection.rotate()[1]];
  const haloR = 7 + 4 * Math.abs(Math.sin(pulse.current));

  return (
    <View style={{ width: SIZE, height: SIZE }} {...pan.panHandlers}>
      <Svg width={SIZE} height={SIZE}>
        <Defs>
          <RadialGradient id="ocean" cx="36%" cy="30%" r="80%">
            <Stop offset="0%" stopColor={t.oceanA} />
            <Stop offset="55%" stopColor={t.oceanB} />
            <Stop offset="100%" stopColor={t.oceanC} />
          </RadialGradient>
          <RadialGradient id="shade" cx="34%" cy="28%" r="80%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.26} />
            <Stop offset="42%" stopColor="#FFFFFF" stopOpacity={0} />
            <Stop offset="82%" stopColor="#101710" stopOpacity={0} />
            <Stop offset="100%" stopColor="#101710" stopOpacity={0.5} />
          </RadialGradient>
        </Defs>

        <Circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="url(#ocean)" />
        {graticuleD ? (
          <Path d={graticuleD} fill="none" stroke="#E9F0DF" strokeOpacity={0.16} strokeWidth={0.7} />
        ) : null}
        <G fill={t.land} stroke={t.landLine} strokeWidth={0.9}>
          {landFeatures.map((f, i) => {
            const d = pathGen(f);
            return d ? <Path key={i} d={d} /> : null;
          })}
        </G>
        <G fill="none" stroke="#EFDFA6" strokeWidth={1.5} strokeDasharray="3 5" opacity={0.95}>
          {routeFeatures.map((f, i) => {
            const d = pathGen(f);
            return d ? <Path key={i} d={d} /> : null;
          })}
        </G>
        {CITIES.map((c, i) => {
          if (geoDistance(c.ll, center) >= Math.PI / 2) return null;
          const p = projection(c.ll);
          return (
            <G key={i}>
              <Circle cx={p[0]} cy={p[1]} r={haloR} fill="#F2E6BC" opacity={0.18} />
              <Circle
                cx={p[0]} cy={p[1]} r={9} fill="transparent"
                onPress={() => setCallout({ ...c, x: p[0], y: p[1] })}
              />
              <Circle cx={p[0]} cy={p[1]} r={4.2} fill="#F2E6BC" stroke="#3E4C39" strokeWidth={1.2} />
            </G>
          );
        })}
        {extraCities.map((c, i) => {
          if (!c.ll || geoDistance(c.ll, center) >= Math.PI / 2) return null;
          const p = projection(c.ll);
          return (
            <G key={`x-${i}`}>
              <Circle cx={p[0]} cy={p[1]} r={haloR} fill={t.gold} opacity={0.22} />
              <Circle
                cx={p[0]} cy={p[1]} r={9} fill="transparent"
                onPress={() => setCallout({ ...c, x: p[0], y: p[1] })}
              />
              <Circle cx={p[0]} cy={p[1]} r={4.2} fill={t.gold} stroke="#3E4C39" strokeWidth={1.2} />
            </G>
          );
        })}
        <Circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="url(#shade)" pointerEvents="none" />
        <Circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="#93A88A" strokeWidth={1.5} />
      </Svg>

      {callout && (
        <Pressable
          onPress={() => setCallout(null)}
          style={[
            styles.callout,
            { backgroundColor: t.card, left: Math.max(4, Math.min(SIZE - 150, callout.x - 60)), top: Math.max(0, callout.y - 62) },
          ]}
        >
          <Text style={[styles.calloutTitle, { color: t.ink }]}>{callout.name}</Text>
          <Text style={[styles.calloutSub, { color: t.muted }]}>{callout.sub}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  callout: {
    position: 'absolute',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 13,
    shadowColor: '#141C12',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    maxWidth: 200,
  },
  calloutTitle: { fontFamily: fonts.bodyHeavy, fontSize: 12.5 },
  calloutSub: { fontFamily: fonts.accent, fontSize: 12, marginTop: 1 },
});
