import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Check, CheckCircle2, ChevronRight, Package, ShoppingBag } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getProduct } from '../data/products';
import {
  Button,
  EmptyState,
  Eyebrow,
  IconButton,
  Label,
  PageHeader,
  QuantityControl,
} from '../components/ui';
import { colours as c, fonts, radius } from '../theme';
import { ProductImage } from '../components/ProductImage';
import { useShop } from '../state/ShopProvider';
import { money } from '../utils/shop';
import type { RootStackParams } from '../navigation/types';
import type { Size } from '../types/shop';

export function ProductScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParams, 'Product'>) {
  const product = getProduct(route.params.productId);
  const { addItem, itemCount } = useShop();
  const [colourIndex, setColourIndex] = useState(0);
  const [size, setSize] = useState<Size>();
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const insets = useSafeAreaInsets();
  if (!product)
    return (
      <EmptyState
        icon={Package}
        title="Product not found"
        description="Return to the collection to find your next campus favourite."
        action="Back to Shop"
        onAction={() => navigation.popTo('Main', { screen: 'Shop' })}
      />
    );
  const colour = product.colours[colourIndex];

  const add = () => {
    if (product.category === 'tshirts' && !size) {
      setError('Choose a size before adding this T-shirt.');
      setMessage('');
      return;
    }
    const added = addItem(product, colour.name, quantity, size);
    setError('');
    setMessage(
      added
        ? `${added} ${added === 1 ? 'item' : 'items'} added to your bag${added < quantity ? ' (10-item limit)' : ''}.`
        : 'This variant has reached the 10-item bag limit.',
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.white }}>
      <PageHeader
        title="The campus collection"
        back={() => navigation.goBack()}
        right={
          <IconButton
            label={`View bag, ${itemCount} items`}
            onPress={() => navigation.popTo('Main', { screen: 'Cart' })}
          >
            <ShoppingBag size={21} color={c.ink} />
            {itemCount > 0 && (
              <View style={s.bagBadge}>
                <Label style={{ fontSize: 9, color: c.white, fontFamily: fonts.bold }}>
                  {itemCount}
                </Label>
              </View>
            )}
          </IconButton>
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 26 }}
      >
        <View style={s.gallery}>
          <ProductImage
            source={colour.image}
            category={product.category}
            colour={colour.name}
            fill={product.category === 'mugs' ? 0.72 : 0.78}
            label={`${product.name} in ${colour.name}`}
            style={s.imagePanel}
          />
          <View style={s.imageTop} pointerEvents="none">
            <View style={s.tag}>
              <Label style={s.tagLabel}>
                KLUST / {product.category === 'tshirts' ? 'APPAREL' : 'LIFESTYLE'}
              </Label>
            </View>
            {product.badge && (
              <View style={s.badge}>
                <Label style={{ fontSize: 11, fontFamily: fonts.semibold, color: c.navy }}>
                  {product.badge}
                </Label>
              </View>
            )}
          </View>
        </View>
        {product.colours.length > 1 && (
          <View style={s.thumbs}>
            {product.colours.map((option, index) => (
              <Pressable
                key={option.name}
                accessibilityRole="button"
                accessibilityLabel={`Show ${option.name} photo`}
                accessibilityState={{ selected: index === colourIndex }}
                onPress={() => {
                  setColourIndex(index);
                  setMessage('');
                }}
                style={[s.thumb, index === colourIndex && s.thumbActive]}
              >
                <ProductImage
                  source={option.image}
                  category={product.category}
                  colour={option.name}
                  fill={product.category === 'mugs' ? 0.7 : 0.82}
                  style={s.thumbImage}
                />
              </Pressable>
            ))}
          </View>
        )}
        <View style={{ padding: 22 }}>
          <Eyebrow style={{ color: c.blue, fontSize: 10 }}>{product.collection}</Eyebrow>
          <View style={s.titleRow}>
            <Label style={s.title}>{product.name}</Label>
            <Label style={s.price}>{money(product.price)}</Label>
          </View>
          <View style={s.quality}>
            <CheckCircle2 size={14} color={c.green} />
            <Label style={{ fontSize: 12, color: c.green, fontFamily: fonts.medium }}>
              Campus pride, thoughtfully made
            </Label>
          </View>
          <Label muted style={{ fontSize: 14, lineHeight: 22, marginTop: 14 }}>
            {product.description}
          </Label>
          <View style={s.divider} />
          <Label style={s.optionLabel}>
            Colour{' '}
            <Label muted style={{ fontSize: 13 }}>
              {' '}
              / {colour.name}
            </Label>
          </Label>
          <View style={s.swatches}>
            {product.colours.map((option, index) => (
              <Pressable
                key={option.name}
                accessibilityRole="button"
                accessibilityLabel={`Colour ${option.name}`}
                accessibilityState={{ selected: index === colourIndex }}
                onPress={() => {
                  setColourIndex(index);
                  setMessage('');
                }}
                style={[s.swatchOuter, index === colourIndex && { borderColor: c.blue }]}
              >
                <View style={[s.swatchInner, { backgroundColor: option.hex }]}>
                  {index === colourIndex && (
                    <Check size={15} color={option.name === 'Cloud' ? c.navy : c.white} />
                  )}
                </View>
              </Pressable>
            ))}
          </View>
          {product.category === 'tshirts' ? (
            <>
              <Label style={s.optionLabel}>
                Size{' '}
                <Label muted style={{ fontSize: 13 }}>
                  {' '}
                  / Unisex fit
                </Label>
              </Label>
              <View style={s.sizes}>
                {product.sizes.map((option) => (
                  <Pressable
                    key={option}
                    accessibilityRole="button"
                    accessibilityLabel={`Size ${option}`}
                    accessibilityState={{ selected: size === option }}
                    onPress={() => {
                      setSize(option);
                      setError('');
                      setMessage('');
                    }}
                    style={[
                      s.size,
                      size === option && { backgroundColor: c.navy, borderColor: c.navy },
                    ]}
                  >
                    <Label
                      style={{
                        fontSize: 14,
                        fontFamily: fonts.semibold,
                        color: size === option ? c.white : c.ink,
                      }}
                    >
                      {option}
                    </Label>
                  </Pressable>
                ))}
              </View>
              {!!error && (
                <Label style={s.error} accessibilityRole="alert">
                  {error}
                </Label>
              )}
            </>
          ) : (
            <View style={{ marginBottom: 20 }}>
              <Label style={s.optionLabel}>Capacity</Label>
              <View style={s.capacity}>
                <Label style={{ fontFamily: fonts.semibold, fontSize: 13 }}>
                  {product.capacity} · Ceramic
                </Label>
              </View>
            </View>
          )}
          <View style={s.quantityRow}>
            <Label style={s.optionLabel}>Quantity</Label>
            <QuantityControl
              quantity={quantity}
              onChange={(value) => {
                setQuantity(value);
                setMessage('');
              }}
            />
          </View>
          <View style={s.divider} />
          <Label style={[s.optionLabel, { marginBottom: 12 }]}>The details</Label>
          {product.details.map((detail) => (
            <View key={detail} style={s.detail}>
              <View style={s.detailDot} />
              <Label muted style={{ fontSize: 13 }}>
                {detail}
              </Label>
            </View>
          ))}
          <View style={s.pickupLine}>
            <Package size={16} color={c.blue} />
            <Label style={{ fontSize: 13, color: c.blue, fontFamily: fonts.medium }}>
              Complimentary campus pickup
            </Label>
          </View>
        </View>
      </ScrollView>
      <View style={[s.actionBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        {!!message && (
          <View style={s.feedback}>
            <CheckCircle2 size={16} color={c.green} />
            <Label
              style={{ fontSize: 12, color: c.green, flex: 1 }}
              accessibilityLiveRegion="polite"
            >
              {message}
            </Label>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="View cart"
              onPress={() => navigation.popTo('Main', { screen: 'Cart' })}
              style={{ flexDirection: 'row', alignItems: 'center', minHeight: 36 }}
            >
              <Label style={{ fontSize: 12, fontFamily: fonts.bold, color: c.blue }}>
                View bag
              </Label>
              <ChevronRight size={14} color={c.blue} />
            </Pressable>
          </View>
        )}
        {!!error && (
          <Label style={[s.error, { marginBottom: 8 }]} accessibilityRole="alert">
            {error}
          </Label>
        )}
        <Button
          title={`Add to bag  ·  ${money(product.price * quantity)}`}
          onPress={add}
          icon={ShoppingBag}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  gallery: { margin: 16, marginBottom: 0 },
  imagePanel: { aspectRatio: 1, borderRadius: radius.xl },
  imageTop: {
    position: 'absolute',
    left: 14,
    right: 14,
    top: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tag: {
    backgroundColor: '#FFFFFFB3',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagLabel: { fontFamily: fonts.bold, fontSize: 9, letterSpacing: 1.4, color: c.navy },
  badge: {
    backgroundColor: c.white,
    borderRadius: radius.pill,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  thumbs: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginTop: 12 },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 2,
  },
  thumbActive: { borderColor: c.blue },
  thumbImage: { flex: 1, borderRadius: radius.sm },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  title: { fontSize: 26, fontFamily: fonts.bold, letterSpacing: -0.9, flex: 1 },
  price: { fontSize: 20, fontFamily: fonts.bold, color: c.blue },
  quality: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 9 },
  divider: { height: 1, backgroundColor: c.line, marginVertical: 21 },
  optionLabel: { fontFamily: fonts.semibold, fontSize: 14 },
  swatches: { flexDirection: 'row', gap: 10, marginTop: 12, marginBottom: 22 },
  swatchOuter: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'transparent',
    padding: 4,
  },
  swatchInner: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00000012',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizes: { flexDirection: 'row', gap: 9, marginTop: 12, marginBottom: 20 },
  size: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: c.line,
    borderRadius: radius.md,
  },
  capacity: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F5F8',
    borderRadius: 9,
    padding: 13,
    marginTop: 10,
  },
  quantityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  error: { fontSize: 12, color: c.red, lineHeight: 18 },
  detail: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 9 },
  detailDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: c.blue },
  pickupLine: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 18 },
  actionBar: {
    paddingHorizontal: 22,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: c.line,
    backgroundColor: c.white,
  },
  feedback: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  bagBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    minWidth: 17,
    height: 17,
    backgroundColor: c.blue,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
