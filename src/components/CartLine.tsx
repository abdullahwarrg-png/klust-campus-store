import { StyleSheet, View } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { getProduct } from '../data/products';
import type { CartItem } from '../types/shop';
import { colours as c, fonts, radius } from '../theme';
import { ProductImage } from './ProductImage';
import { money } from '../utils/shop';
import { useShop } from '../state/ShopProvider';
import { IconButton, Label, QuantityControl } from './ui';

export function CartLine({ item }: { item: CartItem }) {
  const { setQuantity, removeItem } = useShop();
  const product = getProduct(item.productId);
  if (!product) return null;
  const colour =
    product.colours.find((option) => option.name === item.colour) ?? product.colours[0];
  return (
    <View style={s.line}>
      <ProductImage
        source={colour.image}
        category={product.category}
        colour={colour.name}
        fill={product.category === 'mugs' ? 0.74 : 0.84}
        label={`${product.name}, ${item.colour}`}
        style={s.imageBox}
      />
      <View style={{ flex: 1, paddingVertical: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 3 }}>
          <Label style={{ fontFamily: fonts.bold, fontSize: 15, flex: 1, marginTop: 4 }}>
            {product.name}
          </Label>
          <IconButton
            label={`Remove ${product.name}, ${item.colour}${item.size ? `, ${item.size}` : ''}`}
            onPress={() => removeItem(item.key)}
            style={{ minWidth: 32, minHeight: 32, marginTop: -4 }}
          >
            <Trash2 size={15} color={c.muted} />
          </IconButton>
        </View>
        <Label muted style={{ fontSize: 13, marginTop: 2 }}>
          {item.colour}
          {item.size
            ? ` / ${item.size}`
            : ` / ${product.category === 'mugs' ? product.capacity : ''}`}
        </Label>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 15,
            gap: 4,
          }}
        >
          <QuantityControl
            small
            quantity={item.quantity}
            onChange={(value) => setQuantity(item.key, value)}
          />
          <Label style={{ fontFamily: fonts.bold, fontSize: 15 }}>
            {money(product.price * item.quantity)}
          </Label>
        </View>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  line: {
    flexDirection: 'row',
    gap: 15,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: c.line,
  },
  imageBox: { width: 96, height: 116, borderRadius: radius.md },
});
