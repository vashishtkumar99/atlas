import React from 'react';
import Svg, { Circle, Ellipse, Path, G } from 'react-native-svg';

// The Atlas mark: line-drawn globe with a golden route and destination dot.
export default function AtlasMark({ size = 26, line = '#55654F', thin = '#7C8F74', gold = '#C2A268' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <G fill="none" strokeLinecap="round">
        <Circle cx="24" cy="24" r="14" stroke={line} strokeWidth={2.4} />
        <Ellipse cx="24" cy="24" rx="6" ry="14" stroke={thin} strokeWidth={1.3} />
        <Ellipse cx="24" cy="24" rx="10.4" ry="14" stroke={thin} strokeWidth={1.3} />
        <Ellipse cx="24" cy="24" rx="14" ry="5" stroke={thin} strokeWidth={1.3} />
        <Ellipse cx="24" cy="24" rx="14" ry="9.8" stroke={thin} strokeWidth={1.3} />
        <Path d="M10 32 Q 22 14 31.5 16.5" stroke={gold} strokeWidth={2.2} />
      </G>
      <Circle cx="31.5" cy="16.5" r="3" fill={gold} stroke={line} strokeWidth={1.2} />
    </Svg>
  );
}
