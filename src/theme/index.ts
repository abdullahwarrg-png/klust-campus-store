export const colours = {
  blue: '#8DB8FF',
  action: '#2864DB',
  navy: '#244A7C',
  ink: '#EEF3FC',
  muted: '#A6B4CA',
  line: '#2B3B53',
  background: '#162237',
  surface: '#0E1829',
  canvas: '#080F1B',
  paleBlue: '#1B3152',
  white: '#FFFFFF',
  green: '#83DCB4',
  paleGreen: '#17392F',
  red: '#FF9AA5',
  errorBackground: '#371F2B',
  warningBackground: '#382C1B',
  warningText: '#F5D29A',
  gold: '#E4C36C',
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
