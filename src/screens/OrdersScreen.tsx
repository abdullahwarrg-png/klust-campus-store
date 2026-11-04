import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowUpRight, ClipboardList, PackageCheck } from 'lucide-react-native';
import { EmptyState, Eyebrow, Label, PageHeader } from '../components/ui';
import { useShop } from '../state/ShopProvider';
import { colours as c, fonts } from '../theme';
import { money } from '../utils/shop';
import type { AppNavigation } from '../navigation/types';

export function OrdersScreen() {
  const { orders } = useShop();
  const navigation = useNavigation<AppNavigation>();
  return (
    <View style={{ flex: 1, backgroundColor: c.white }}>
      <PageHeader title="Your orders" subtitle="A little history of your campus favourites." />
      {!orders.length ? (
        <EmptyState
          icon={ClipboardList}
          title="Your story starts here"
          description="Once you place a demo order, you can find its details and pickup summary right here."
          action="Find your first favourite"
          onAction={() => navigation.navigate('Main', { screen: 'Shop' })}
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(order) => order.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 22 }}
          ListHeaderComponent={
            <View style={{ marginBottom: 17 }}>
              <Eyebrow>
                {orders.length} {orders.length === 1 ? 'CAMPUS ORDER' : 'CAMPUS ORDERS'}
              </Eyebrow>
              <Label muted style={{ fontSize: 12.5, lineHeight: 19, marginTop: 8 }}>
                Demo orders are saved on this device.
              </Label>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`View order ${item.id}`}
              onPress={() => navigation.navigate('Receipt', { orderId: item.id })}
              style={s.order}
            >
              <View style={s.row}>
                <View style={s.icon}>
                  <PackageCheck size={22} color={c.blue} strokeWidth={1.7} />
                </View>
                <View style={{ flex: 1 }}>
                  <Label style={{ fontFamily: fonts.bold, fontSize: 12 }}>{item.id}</Label>
                  <Label muted style={{ fontSize: 12, marginTop: 5 }}>
                    {new Date(item.createdAt).toLocaleDateString('en-MY', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Label>
                </View>
                <ArrowUpRight size={18} color={c.blue} />
              </View>
              <View style={s.divider} />
              <Label style={{ fontSize: 12, fontFamily: fonts.medium }}>
                {item.items[0].name}
                {item.items.length > 1 ? ` + ${item.items.length - 1} more` : ''}
              </Label>
              <View style={[s.row, { marginTop: 14 }]}>
                <View style={s.status}>
                  <Label style={{ color: c.green, fontFamily: fonts.semibold, fontSize: 11 }}>
                    Demo order placed
                  </Label>
                </View>
                <Label
                  style={{ flex: 1, textAlign: 'right', fontFamily: fonts.bold, fontSize: 16 }}
                >
                  {money(item.total)}
                </Label>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
const s = StyleSheet.create({
  order: { borderWidth: 1, borderColor: c.line, borderRadius: 18, padding: 18, marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: {
    width: 43,
    height: 43,
    backgroundColor: c.paleBlue,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: { height: 1, backgroundColor: c.line, marginVertical: 17 },
  status: { backgroundColor: c.paleGreen, padding: 8, paddingHorizontal: 10, borderRadius: 7 },
});
