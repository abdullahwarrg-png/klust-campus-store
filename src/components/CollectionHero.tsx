import { Image, Pressable, StyleSheet, View } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { Label } from './ui';
import { colours as c, fonts } from '../theme';

/** Campaign artwork stays separate from the shoppable T-shirt and mug catalog. */
export function CollectionHero({ onExplore }: { onExplore: () => void }) {
  return (
    <View style={s.hero}>
      <View style={s.artwork}>
        <View style={s.edition}>
          <View style={s.editionDot} />
          <Label style={s.editionLabel}>THE CAMPUS COLLECTION</Label>
        </View>
        <View style={s.halo} />
        <Image
          source={require('../../assets/campaigns/campus-collection.png')}
          style={s.image}
          resizeMode="contain"
          accessibilityLabel="KLUST merchandise collection featuring teal and red T-shirts, a cap, a mug, and a pen"
        />
      </View>
      <View style={s.copy}>
        <Label style={s.title}>KLUST Campus Store</Label>
        <Label style={s.description}>T-shirts and mugs with KLUST designs.</Label>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Browse products"
          onPress={onExplore}
          style={({ pressed }) => [s.button, pressed && { opacity: 0.8 }]}
        >
          <Label style={s.buttonLabel}>Browse products</Label>
          <ArrowRight size={17} color={c.white} strokeWidth={1.8} />
        </Pressable>
        <Label style={s.note}>Guest checkout · Campus pickup</Label>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  hero: { borderRadius: 26, overflow: 'hidden', backgroundColor: c.background },
  artwork: {
    height: 254,
    backgroundColor: '#E3EDF8',
    overflow: 'hidden',
    alignItems: 'center',
  },
  edition: {
    position: 'absolute',
    top: 14,
    left: 14,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#FFFFFFB3',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    zIndex: 1,
  },
  editionDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: c.action },
  editionLabel: { fontFamily: fonts.bold, fontSize: 10, letterSpacing: 1.6, color: c.navy },
  halo: {
    position: 'absolute',
    top: 47,
    width: 235,
    height: 235,
    borderRadius: 118,
    backgroundColor: '#CEDFF3',
  },
  image: { width: '100%', height: 222, marginTop: 26 },
  copy: { padding: 22, paddingTop: 19 },
  title: {
    fontSize: 34,
    lineHeight: 36,
    fontFamily: fonts.bold,
    letterSpacing: -1,
    color: c.white,
  },
  description: { fontSize: 14, lineHeight: 20, color: '#C5D5ED', marginTop: 10 },
  button: {
    minHeight: 50,
    marginTop: 18,
    borderRadius: 14,
    paddingHorizontal: 18,
    backgroundColor: c.action,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonLabel: { fontFamily: fonts.bold, fontSize: 14, color: c.white },
  note: { fontSize: 11, color: '#AABFD9', textAlign: 'center', marginTop: 11 },
});
