import React from 'react';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';

// Hand-drawn-feel line icons, same paths as the mockup. No emojis anywhere.
const SHAPES = {
  plane: <Path d="M10.5 13.5 3 11l1.5-2 6.5 1 5-6.5L18 4l-2.5 7.5 4.5 3-1.5 2-5-1.5-3 4-1.5-.5.5-5z" />,
  train: (
    <G>
      <Rect x="6" y="3.5" width="12" height="12.5" rx="3" />
      <Path d="M6 10h12" />
      <Circle cx="9.5" cy="13" r="0.6" />
      <Circle cx="14.5" cy="13" r="0.6" />
      <Path d="M8.5 16.5 6.5 20M15.5 16.5l2 3.5M8 20h8" />
    </G>
  ),
  ferry: (
    <G>
      <Path d="M4 15h16l-2.5 4.5h-11L4 15z" />
      <Path d="M7 15v-4h10v4M12 11V6M12 6h4l-1.5 2.5" />
      <Path d="M3 21c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0" strokeWidth={1.4} />
    </G>
  ),
  walk: (
    <G>
      <Circle cx="13" cy="4.5" r="2" />
      <Path d="M10 21l2.5-6L11 12l-2.5 2.5M11 12l1.5-4 3 1.5 2.5 2.5M13.5 15l2.5 6" />
    </G>
  ),
  car: (
    <G>
      <Path d="M4 16v-4l2-5h12l2 5v4" />
      <Path d="M4 12h16" />
      <Circle cx="7.5" cy="16.5" r="1.8" />
      <Circle cx="16.5" cy="16.5" r="1.8" />
    </G>
  ),
  sun: (
    <G>
      <Circle cx="12" cy="12" r="4.2" />
      <Path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5 5l1.8 1.8M17.2 17.2 19 19M19 5l-1.8 1.8M6.8 17.2 5 19" />
    </G>
  ),
  moon: <Path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z" />,
  compass: (
    <G>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M15.5 8.5 13.4 13.4 8.5 15.5l2.1-4.9z" />
    </G>
  ),
  camera: (
    <G>
      <Rect x="3" y="7" width="18" height="13" rx="3" />
      <Path d="M8.5 7 10 4.5h4L15.5 7" />
      <Circle cx="12" cy="13.2" r="3.4" />
    </G>
  ),
  star: <Path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.5 9.7l5.9-.8z" />,
  check: <Path d="M4.5 12.5 10 18 19.5 6.5" />,
  chevBack: <Path d="M15 5.5 8.5 12 15 18.5" />,
  pin: (
    <G>
      <Path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" />
      <Circle cx="12" cy="10" r="2.3" />
    </G>
  ),
  flag: (
    <G>
      <Path d="M6 21V4" />
      <Path d="M6 5c4-2 6 2 12 0v8c-6 2-8-2-12 0" />
    </G>
  ),
  book: (
    <G>
      <Path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4z" />
      <Path d="M5 17a3 3 0 0 1 3-3h11M9 8h6" />
    </G>
  ),
  home: (
    <G>
      <Path d="M4 11.5 12 4.5l8 7" />
      <Path d="M6.5 10v9.5h11V10" />
      <Path d="M10.5 19.5v-5h3v5" />
    </G>
  ),
  island: (
    <G>
      <Path d="M8 15c0-4 2-7 5-8M13 7c-2-1-4-1-5 0M13 7c2-1 4 0 5 2M13 7c0-2 1-3 2.5-3.5M13 7l-1 8" />
      <Path d="M3 18c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0" strokeWidth={1.4} />
    </G>
  ),
  cup: (
    <G>
      <Path d="M5 8h11v7a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8z" />
      <Path d="M16 9.5h1.5a2.5 2.5 0 0 1 0 5H16M8 5c0-1 .8-1 .8-2M12 5c0-1 .8-1 .8-2" />
    </G>
  ),
  mountain: (
    <G>
      <Path d="M3 19 9.5 7l4 7 2.5-4L21 19H3z" />
      <Path d="M8 10.5 9.5 9l1.5 1.5" />
    </G>
  ),
  search: (
    <G>
      <Circle cx="11" cy="11" r="6.5" />
      <Path d="M16 16l4.5 4.5" />
    </G>
  ),
  close: <Path d="M6 6l12 12M18 6 6 18" />,
  plus: <Path d="M12 5v14M5 12h14" />,
};

export default function Icon({ name, size = 20, color = '#333B31', strokeWidth = 1.8 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <G fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        {SHAPES[name] || SHAPES.pin}
      </G>
    </Svg>
  );
}
