import React from 'react';
import Svg, { Path, Circle, Text as SvgText } from 'react-native-svg';
import { fonts } from '../theme';

// The Atlas Monogram: bold sans "A" with a golden route landing in a dot.
export default function AtlasMark({ size = 26, ink = '#EDEFE6', gold = '#D2B47F' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 56 56">
      <SvgText
        x="28" y="43" textAnchor="middle"
        fontFamily={fonts.display} fontSize="40" fill={ink}
      >A</SvgText>
      <Path d="M9 35 Q 28 26 44 30" fill="none" stroke={gold} strokeWidth={3.4} strokeLinecap="round" />
      <Circle cx="44" cy="30" r="4.6" fill={gold} />
    </Svg>
  );
}
