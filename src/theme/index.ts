export const colours = {
  blue: '#175CDB',
  action: '#175CDB',
  surface: '#FFFFFF',
  canvas: '#EAF0F8',
  errorBackground: '#FFF9F9',
  warningBackground: '#FFF2E3',
  warningText: '#84461A',
  navy: '#102952',
  ink: '#142543',
  muted: '#6B778D',
  line: '#E7ECF3',
  background: '#F6F8FB',
  paleBlue: '#EAF1FE',
  white: '#FFFFFF',
  green: '#26745D',
  paleGreen: '#ECF6F0',
  red: '#BB3E48',
  gold: '#C9A646',
};

export const fonts = {
  regular: 'DMSans_400Regular',
  medium: 'DMSans_500Medium',
  semibold: 'DMSans_600SemiBold',
  bold: 'DMSans_700Bold',
};

export const radius = { sm: 10, md: 14, lg: 20, xl: 26, pill: 999 };

export const shadow = {
  shadowColor: '#163A70',
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.05,
  shadowRadius: 15,
  elevation: 2,
};

export const liftedShadow = {
  shadowColor: '#0F2240',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.1,
  shadowRadius: 24,
  elevation: 5,
};

/** Studio backdrops that keep light garments and dark garments equally legible. */
const backdrops: Record<string, string> = {
  Cloud: '#E3EAF3',
  Navy: '#EEF0EA',
  Blue: '#F1F0EA',
};

export function backdrop(colourName: string) {
  return backdrops[colourName] ?? '#EEF1F5';
}
