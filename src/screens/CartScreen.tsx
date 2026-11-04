import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, ShieldCheck, ShoppingBag } from 'lucide-react-native';
import { Button, EmptyState, Eyebrow, Label, PageHeader, PickupCard } from '../components/ui';
import { CartLine } from '../components/CartLine';
import { useShop } from '../state/ShopProvider';
import { colours as c, fonts } from '../theme';
import { money } from '../utils/shop';
import type { AppNavigation } from '../navigation/types';

export function CartScreen() {
  const { cart, itemCount, total } = useShop();
  const navigation = useNavigation<AppNavigation>();
  const shop = () => navigation.navigate('Main', { screen: 'Shop' });
  return (
    <View style={{ flex: 1, backgroundColor: c.white }}>
      <PageHeader
        title="Your bag"
        subtitle={
          itemCount
            ? `${itemCount} ${itemCount === 1 ? 'campus favourite' : 'campus favourites'}, ready for you.`
            : 'A little room for your next favourite.'
        }
        right={
          <View style={s.count}>
            <Label style={{ color: c.blue, fontFamily: fonts.bold, fontSize: 12 }}>
              {itemCount}
            </Label>
          </View>
        }
      />
      {!cart.length ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is taking a break"
          description="Find a tee for your next class or a mug for your morning ritual. Your campus favourites are waiting."
          action="Explore the collection"
          onAction={shop}
        />
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 20 }}
          >
            {cart.map((item) => (
              <CartLine key={item.key} item={item} />
            ))}
            <Pressable accessibilityRole="button" onPress={shop} style={s.continue}>
              <ArrowLeft size={15} color={c.blue} />
              <Label style={{ fontSize: 12, color: c.blue, fontFamily: fonts.semibold }}>
                Continue shopping
              </Label>
            </Pressable>
            <PickupCard compact />
            <View style={s.summary}>
              <Eyebrow>THE LITTLE DETAILS</Eyebrow>
              <View style={s.summaryLine}>
                <Label muted>Subtotal</Label>
                <Label style={{ fontFamily: fonts.semibold }}>{money(total)}</Label>
              </View>
              <View style={s.summaryLine}>
                <Label muted>Campus pickup</Label>
                <Label style={{ color: c.green, fontFamily: fonts.semibold }}>Complimentary</Label>
              </View>
              <View style={s.totalLine}>
                <Label style={{ fontSize: 18, fontFamily: fonts.bold }}>Total</Label>
                <Label style={{ fontSize: 23, fontFamily: fonts.bold, color: c.blue }}>
                  {money(total)}
                </Label>
              </View>
              <Label muted style={{ fontSize: 12, marginTop: 8 }}>
                All prices in MYR. No additional demo charges.
              </Label>
            </View>
          </ScrollView>
          <View style={s.bottom}>
            <Button title="Continue to checkout" onPress={() => navigation.navigate('Checkout')} />
            <View style={s.note}>
              <ShieldCheck size={13} color={c.muted} />
              <Label muted style={{ fontSize: 12 }}>
                Guest checkout · No payment required
              </Label>
            </View>
          </View>
        </>
      )}
    </View>
  );
}
const s = StyleSheet.create({
  count: {
    width: 33,
    height: 33,
    borderRadius: 11,
    backgroundColor: c.paleBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 20,
    alignSelf: 'flex-start',
  },
  summary: { marginTop: 27, paddingBottom: 12 },
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
  },
  totalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: c.line,
  },
  bottom: { borderTopWidth: 1, borderTopColor: c.line, padding: 20, paddingBottom: 14 },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 11,
  },
});
