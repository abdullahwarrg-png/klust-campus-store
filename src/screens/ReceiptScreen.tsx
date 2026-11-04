import { ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Check, ClipboardList, Sparkles } from 'lucide-react-native';
import { Button, EmptyState, Eyebrow, Label, PageHeader, PickupCard } from '../components/ui';
import { useShop } from '../state/ShopProvider';
import { colours as c, fonts } from '../theme';
import { money } from '../utils/shop';
import type { RootStackParams } from '../navigation/types';

export function ReceiptScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParams, 'Receipt'>) {
  const { orders } = useShop();
  const order = orders.find((entry) => entry.id === route.params.orderId);
  const goTo = (screen: 'Shop' | 'Orders') =>
    navigation.reset({ index: 0, routes: [{ name: 'Main', params: { screen } }] });
  if (!order)
    return (
      <EmptyState
        icon={ClipboardList}
        title="Receipt unavailable"
        description="This order is not saved on this device."
        action="View orders"
        onAction={() => goTo('Orders')}
      />
    );
  return (
    <View style={{ flex: 1, backgroundColor: c.surface }}>
      <PageHeader title="Your order receipt" back={() => goTo('Orders')} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 22, paddingBottom: 30 }}
      >
        <View style={s.celebration}>
          <View style={s.sparkleLeft}>
            <Sparkles size={18} color="#80A4E1" />
          </View>
          <View style={s.tick}>
            <Check size={37} color={c.white} strokeWidth={2} />
          </View>
          <View style={s.sparkleRight}>
            <Sparkles size={14} color="#80A4E1" />
          </View>
          <Eyebrow style={{ color: c.blue, marginTop: 22 }}>ORDER CONFIRMATION</Eyebrow>
          <Label style={s.title}>Demo order saved</Label>
          <Label muted style={{ textAlign: 'center', fontSize: 12, lineHeight: 20, marginTop: 9 }}>
            Your receipt is saved on this device.
          </Label>
        </View>
        <View style={s.receipt}>
          <View style={s.row}>
            <Eyebrow style={{ fontSize: 10 }}>ORDER REFERENCE</Eyebrow>
            <View style={s.demo}>
              <Label style={{ fontSize: 10, color: c.green, fontFamily: fonts.semibold }}>
                DEMO ORDER
              </Label>
            </View>
          </View>
          <Label style={{ fontFamily: fonts.bold, fontSize: 13, marginTop: 9 }}>{order.id}</Label>
          <Label muted style={{ fontSize: 12, marginTop: 5 }}>
            {new Date(order.createdAt).toLocaleDateString('en-MY', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Label>
          <View style={s.divider} />
          {order.items.map((item) => (
            <View key={item.key} style={[s.row, { marginBottom: 17, alignItems: 'flex-start' }]}>
              <View style={{ flex: 1 }}>
                <Label style={{ fontFamily: fonts.semibold, fontSize: 12 }}>{item.name}</Label>
                <Label muted style={{ fontSize: 12, marginTop: 4 }}>
                  {item.colour}
                  {item.size ? ` / ${item.size}` : ''} · Qty {item.quantity}
                </Label>
              </View>
              <Label style={{ fontSize: 12, fontFamily: fonts.semibold }}>
                {money(item.price * item.quantity)}
              </Label>
            </View>
          ))}
          <View style={[s.row, { borderTopWidth: 1, borderTopColor: c.line, paddingTop: 17 }]}>
            <Label style={{ fontFamily: fonts.bold }}>Total</Label>
            <Label style={{ fontSize: 21, fontFamily: fonts.bold, color: c.blue }}>
              {money(order.total)}
            </Label>
          </View>
        </View>
        <PickupCard />
        <View style={{ paddingVertical: 22 }}>
          <Label style={{ fontFamily: fonts.bold, fontSize: 13 }}>Contact details</Label>
          <Label muted style={{ fontSize: 12, lineHeight: 22, marginTop: 10 }}>
            {order.customer.name}
            {`\n`}
            {order.customer.email}
            {`\n`}
            {order.customer.phone}
          </Label>
        </View>
        <Label muted style={{ fontSize: 12, lineHeight: 18, marginBottom: 22 }}>
          This is a demonstration receipt. No payment was taken, no email was sent, and no real
          collection has been reserved.
        </Label>
        <Button title="Browse products" onPress={() => goTo('Shop')} />
        <Button
          title="View my orders"
          onPress={() => goTo('Orders')}
          secondary
          icon={null}
          style={{ marginTop: 10 }}
        />
      </ScrollView>
    </View>
  );
}
const s = StyleSheet.create({
  celebration: { alignItems: 'center', paddingVertical: 23, paddingBottom: 30 },
  tick: {
    width: 79,
    height: 79,
    borderRadius: 29,
    backgroundColor: c.action,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-7deg' }],
  },
  sparkleLeft: { position: 'absolute', top: 35, left: '22%' },
  sparkleRight: { position: 'absolute', top: 15, right: '23%' },
  title: {
    fontSize: 25,
    fontFamily: fonts.bold,
    letterSpacing: -0.8,
    marginTop: 10,
    textAlign: 'center',
  },
  receipt: { borderWidth: 1, borderColor: c.line, borderRadius: 18, padding: 20, marginBottom: 19 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  demo: { backgroundColor: c.paleGreen, padding: 6, paddingHorizontal: 8, borderRadius: 5 },
  divider: { height: 1, backgroundColor: c.line, marginVertical: 18 },
});
