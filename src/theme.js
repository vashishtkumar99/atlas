// Atlas design tokens — off-white + sage, light and dark
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
    bg: '#181D17',
    card: '#232A21',
    ink: '#E9ECE1',
    muted: '#98A491',
    sage: '#9DB392',
    sageDeep: '#C7D6BC',
    sageTint: '#2C352A',
    sageLine: '#3A4536',
    gold: '#D2B47F',
    oceanA: '#3E4C44', oceanB: '#2C3830', oceanC: '#1F2822',
    land: '#B8BFA4', landLine: '#8F977C',
    sil1: '#141A13', sil2: '#0E120D',
    heroA: '#26332C', heroB: '#3A4438', sun: '#E8DCA8',
    globeCardA: '#28312A', globeCardB: '#161B16',
    onGlobe: '#EDEFE4', onGlobeMuted: '#BFCDB2',
    saveText: '#1E251C',
    shadow: 'rgba(0,0,0,0.35)',
  },
};

export const fonts = {
  display: 'Lora_500Medium',
  displaySemi: 'Lora_600SemiBold',
  displayItalic: 'Lora_400Regular_Italic',
  body: 'Karla_400Regular',
  bodySemi: 'Karla_600SemiBold',
  bodyBold: 'Karla_700Bold',
  bodyHeavy: 'Karla_800ExtraBold',
  accent: 'Fraunces_400Regular_Italic',
  accentMed: 'Fraunces_500Medium_Italic',
};

export const radius = { lg: 26, md: 18, sm: 14 };

export const card = (t) => ({
  backgroundColor: t.card,
  borderRadius: radius.lg,
  shadowColor: '#141C12',
  shadowOpacity: 0.10,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 6 },
  elevation: 4,
});
