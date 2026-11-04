import { Pressable, StyleSheet, View } from 'react-native';
import type { Product } from '../types/shop';
import { colours as c, fonts, radius } from '../theme';
import { Label } from './ui';
import { ProductImage } from './ProductImage';
import { money } from '../utils/shop';

export function ProductCard({ product, onPress }: { product: Product; onPress: () => void }) {
  const lead = product.colours[0];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View ${product.name}, ${money(product.price)}`}
      onPress={onPress}
      style={({ pressed }) => [s.card, pressed && { opacity: 0.85, transform: [{ scale: 0.985 }] }]}
    >
      <View>
        <ProductImage
          source={lead.image}
          category={product.category}
          colour={lead.name}
          fill={product.category === 'mugs' ? 0.72 : 0.8}
          label={`${product.name} in ${lead.name} with the KLUST crest`}
          style={s.imageBox}
        />
        {product.badge && (
          <View style={s.badge}>
            <Label style={s.badgeLabel}>{product.badge}</Label>
          </View>
        )}
        <View style={s.swatches}>
          {product.colours.map((colour) => (
            <View key={colour.name} style={[s.swatch, { backgroundColor: colour.hex }]} />
          ))}
        </View>
      </View>
      <View style={s.body}>
        <Label style={s.category}>
          {product.category === 'tshirts' ? 'Campus apparel' : 'Everyday essentials'}
        </Label>
        <Label style={s.name} numberOfLines={1}>
          {product.name}
        </Label>
        <View style={s.meta}>
          <Label style={s.price}>{money(product.price)}</Label>
          <Label style={s.variants}>
            {product.colours.length} {product.colours.length === 1 ? 'colour' : 'colours'}
          </Label>
        </View>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: { flex: 1, minWidth: 0, marginBottom: 22 },
  imageBox: { aspectRatio: 0.86, borderRadius: radius.lg },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: c.white,
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: radius.pill,
  },
  badgeLabel: { fontSize: 10, fontFamily: fonts.semibold, color: c.navy },
  swatches: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    borderRadius: radius.pill,
    backgroundColor: '#FFFFFFCC',
  },
  swatch: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#0000001A',
  },
  body: { paddingHorizontal: 2, paddingTop: 11 },
  category: { fontSize: 10, color: c.muted, fontFamily: fonts.medium },
  name: { fontSize: 14, fontFamily: fonts.semibold, marginTop: 3, letterSpacing: -0.2 },
  meta: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  price: { fontSize: 14, fontFamily: fonts.bold, color: c.blue },
  variants: { fontSize: 10, color: c.muted },
});
