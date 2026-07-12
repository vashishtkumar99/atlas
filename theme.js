// Atlas design tokens — dark-first, sage + gold, Plus Jakarta Sans everywhere
export const palettes = {
  light: {
    bg: '#F7F5EE',
    card: '#FFFFFF',
    ink: '#333B31',
    muted: '#7D877B',
    sage: '#7C8F74',
    sageDeep: '#55654F',
    sageTint: '#E5EBDF',
    sageLine: '#CBD6C2',
    gold: '#C2A268',
    oceanA: '#8CA386', oceanB: '#63795C', oceanC: '#485942',
    land: '#EBE6CF', landLine: '#C9C3A5',
    sil1: '#6D7F65', sil2: '#55654F',
    heroA: '#CFE0C9', heroB: '#F0EAD4', sun: '#F6EFD8',
    globeCardA: '#55654F', globeCardB: '#333F2F',
    onGlobe: '#EDEFE4', onGlobeMuted: '#BFCDB2',
    saveText: '#F5F3E6',
    shadow: 'rgba(58,68,54,0.12)',
  },
  dark: {
    bg: '#121611',
    card: '#1C221A',
    ink: '#EDEFE6',
    muted: '#96A18F',
    sage: '#9DB392',
    sageDeep: '#C7D6BC',
    sageTint: '#2A3327',
    sageLine: '#39442F',
    gold: '#D2B47F',
    oceanA: '#3E4C44', oceanB: '#2C3830', oceanC: '#1F2822',
    land: '#B8BFA4', landLine: '#8F977C',
    sil1: '#12160F', sil2: '#0C0F0A',
    heroA: '#242E24', heroB: '#37412F', sun: '#E8DCA8',
    globeCardA: '#1A201A', globeCardB: '#141914',
    onGlobe: '#EDEFE4', onGlobeMuted: '#A9B8A0',
    saveText: '#171C15',
    shadow: 'rgba(0,0,0,0.4)',
  },
};

// One family, many weights. Lighter overall than before — cleaner.
export const fonts = {
  display: 'PlusJakartaSans_800ExtraBold',      // big titles, big numbers
  displaySemi: 'PlusJakartaSans_700Bold',        // card titles
  displayItalic: 'PlusJakartaSans_500Medium_Italic',
  body: 'PlusJakartaSans_400Regular',            // inputs, long text
  bodySemi: 'PlusJakartaSans_500Medium',         // most UI text
  bodyBold: 'PlusJakartaSans_600SemiBold',       // emphasis
  bodyHeavy: 'PlusJakartaSans_700Bold',          // buttons, tabs
  accent: 'PlusJakartaSans_500Medium',           // dates, notes (was italic serif)
  accentMed: 'PlusJakartaSans_600SemiBold',
  caps: 'PlusJakartaSans_600SemiBold',           // small uppercase labels
};

// shared style for small uppercase labels ("WHERE TO", "ATLAS")
export const capsStyle = { fontFamily: fonts.caps, fontSize: 10.5, letterSpacing: 1.8, textTransform: 'uppercase' };

export const radius = { lg: 26, md: 18, sm: 14 };

export const card = (t) => ({
  backgroundColor: t.card,
  borderRadius: radius.lg,
  shadowColor: '#0A0D08',
  shadowOpacity: 0.14,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 6 },
  elevation: 4,
});
