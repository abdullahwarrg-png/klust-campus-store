import { useRef, useState, type ComponentRef } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { usePreventRemove } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, LockKeyhole, ShoppingBag } from 'lucide-react-native';
import { Button, EmptyState, Eyebrow, Label, PageHeader, PickupCard } from '../components/ui';
import { useShop } from '../state/ShopProvider';
import { getProduct } from '../data/products';
import { colours as c, fonts } from '../theme';
import { ProductImage } from '../components/ProductImage';
import { money, validateCustomer } from '../utils/shop';
import type { Customer } from '../types/shop';
import type { RootStackParams } from '../navigation/types';

export function CheckoutScreen({
  navigation,
}: NativeStackScreenProps<RootStackParams, 'Checkout'>) {
  const { cart, itemCount, total, placeOrder } = useShop();
  const [customer, setCustomer] = useState<Customer>({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof Customer, string>>>({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);
  const submitting = useRef(false);
  const insets = useSafeAreaInsets();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const inputs = useRef<Partial<Record<keyof Customer, ComponentRef<typeof TextInput> | null>>>({});
  usePreventRemove(saving, () => undefined);

  const submit = async () => {
    if (submitting.current) return;
    const nextErrors = validateCustomer(customer);
    setErrors(nextErrors);
    const firstInvalid = (['name', 'email', 'phone'] as const).find((field) => nextErrors[field]);
    if (firstInvalid) {
      scroll.current?.scrollTo({ y: 0, animated: true });
      inputs.current[firstInvalid]?.focus();
      return;
    }
    Keyboard.dismiss();
    submitting.current = true;
    setSaving(true);
    setError('');
    try {
      const orderId = await placeOrder(customer);
      setCompleted(true);
      setSaving(false);
      // Wait for the removal guard to release before replacing Checkout.
      setTimeout(() => navigation.replace('Receipt', { orderId }), 0);
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : 'Please try placing your order again.');
      setSaving(false);
      submitting.current = false;
    }
  };

  if (!cart.length && !saving && !completed)
    return (
      <View style={{ flex: 1, backgroundColor: c.surface }}>
        <PageHeader title="Checkout" back={() => navigation.goBack()} />
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          description="Add products to your bag to continue to checkout."
          action="Back to Shop"
          onAction={() => navigation.popTo('Main', { screen: 'Shop' })}
        />
      </View>
    );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: c.surface }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <PageHeader
        title="Checkout"
        subtitle="Review your items and enter your contact details."
        back={saving ? undefined : () => navigation.goBack()}
      />
      <ScrollView
        ref={scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 22, paddingBottom: 30 }}
      >
        <View style={s.progress}>
          <View style={s.progressDone}>
            <Check size={12} color={c.white} />
          </View>
          <Label style={s.progressLabel}>Your bag</Label>
          <View style={s.progressLine} />
          <View style={s.progressActive}>
            <Label style={{ color: c.white, fontSize: 12, fontFamily: fonts.bold }}>2</Label>
          </View>
          <Label style={[s.progressLabel, { color: c.blue }]}>Pickup details</Label>
        </View>
        <Eyebrow style={{ color: c.blue, fontSize: 11 }}>DEMO CHECKOUT</Eyebrow>
        <Label style={s.title}>Pickup order</Label>
        <Label muted style={{ fontSize: 12, lineHeight: 20, marginTop: 7, marginBottom: 23 }}>
          Add your contact details for this campus pickup demo.
        </Label>
        <Label style={s.sectionTitle}>Your details</Label>
        {(
          [
            {
              key: 'name',
              label: 'Full name',
              placeholder: 'e.g. Aina Rahman',
              keyboard: 'default',
              autocomplete: 'name',
            },
            {
              key: 'email',
              label: 'Email address',
              placeholder: 'you@example.com',
              keyboard: 'email-address',
              autocomplete: 'email',
            },
            {
              key: 'phone',
              label: 'Phone number',
              placeholder: 'e.g. 012 345 6789',
              keyboard: 'phone-pad',
              autocomplete: 'tel',
            },
          ] as const
        ).map((field) => (
          <View key={field.key} style={{ marginTop: 15 }}>
            <Label style={s.fieldLabel}>
              {field.label}
              <Label style={{ color: c.blue }}> *</Label>
            </Label>
            <TextInput
              ref={(input) => {
                inputs.current[field.key] = input;
              }}
              accessibilityLabel={field.label}
              editable={!saving}
              autoComplete={field.autocomplete}
              autoCapitalize={field.key === 'name' ? 'words' : 'none'}
              autoCorrect={false}
              keyboardType={field.keyboard}
              returnKeyType={field.key === 'phone' ? 'done' : 'next'}
              onSubmitEditing={() =>
                field.key === 'name'
                  ? inputs.current.email?.focus()
                  : field.key === 'email'
                    ? inputs.current.phone?.focus()
                    : Keyboard.dismiss()
              }
              placeholder={field.placeholder}
              placeholderTextColor={c.muted}
              value={customer[field.key]}
              maxLength={field.key === 'name' ? 100 : field.key === 'email' ? 150 : 25}
              onChangeText={(value) => {
                setCustomer({ ...customer, [field.key]: value });
                setErrors({ ...errors, [field.key]: undefined });
                setError('');
              }}
              style={[
                s.input,
                !!errors[field.key] && { borderColor: c.red, backgroundColor: c.errorBackground },
              ]}
            />
            {!!errors[field.key] && (
              <Label accessibilityRole="alert" style={s.error}>
                {errors[field.key]}
              </Label>
            )}
          </View>
        ))}
        <View style={s.divider} />
        <Label style={[s.sectionTitle, { marginBottom: 14 }]}>Collection method</Label>
        <PickupCard />
        <View style={s.divider} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 15,
          }}
        >
          <Label style={s.sectionTitle}>Order summary</Label>
          <Label muted style={{ fontSize: 12.5 }}>
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </Label>
        </View>
        {cart.map((item) => {
          const product = getProduct(item.productId);
          if (!product) return null;
          return (
            <View key={item.key} style={s.summaryItem}>
              <ProductImage
                source={
                  (
                    product.colours.find((option) => option.name === item.colour) ??
                    product.colours[0]
                  ).image
                }
                category={product.category}
                colour={item.colour}
                fill={product.category === 'mugs' ? 0.74 : 0.84}
                style={s.thumbnail}
              />
              <View style={{ flex: 1 }}>
                <Label style={{ fontSize: 14, fontFamily: fonts.semibold }}>{product.name}</Label>
                <Label muted style={{ fontSize: 12, marginTop: 4 }}>
                  {item.colour}
                  {item.size ? ` / ${item.size}` : ''} · Qty {item.quantity}
                </Label>
              </View>
              <Label style={{ fontSize: 12, fontFamily: fonts.bold }}>
                {money(product.price * item.quantity)}
              </Label>
            </View>
          );
        })}
        <View style={s.total}>
          <Label style={{ fontFamily: fonts.bold, fontSize: 17 }}>Total</Label>
          <Label style={{ fontSize: 23, fontFamily: fonts.bold, color: c.blue }}>
            {money(total)}
          </Label>
        </View>
        <Label muted style={{ fontSize: 12, lineHeight: 17, marginTop: 8 }}>
          Campus pickup is complimentary. Prices are in MYR.
        </Label>
      </ScrollView>
      <View style={[s.bottom, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        {!!error && (
          <Label accessibilityRole="alert" style={[s.error, { marginBottom: 10 }]}>
            {error}
          </Label>
        )}
        <Button
          title={saving ? 'Saving your order…' : 'Place demo order'}
          loading={saving}
          disabled={!cart.length}
          onPress={() => {
            void submit();
          }}
        />
        <View style={s.demo}>
          <LockKeyhole size={12} color={c.muted} />
          <Label muted style={{ fontSize: 11 }}>
            Demo checkout. No payment or real reservation.
          </Label>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  progress: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 25 },
  progressDone: {
    width: 21,
    height: 21,
    backgroundColor: c.paleGreen,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressActive: {
    width: 21,
    height: 21,
    backgroundColor: c.action,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressLabel: { fontSize: 12, fontFamily: fonts.semibold, color: c.muted },
  progressLine: { height: 1, backgroundColor: c.line, width: 32, marginHorizontal: 5 },
  title: { fontFamily: fonts.bold, fontSize: 27, letterSpacing: -0.9, marginTop: 9 },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 15 },
  fieldLabel: { fontFamily: fonts.medium, fontSize: 12.5, marginBottom: 7 },
  input: {
    height: 49,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: c.line,
    backgroundColor: c.background,
    paddingHorizontal: 14,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: c.ink,
  },
  error: { color: c.red, fontSize: 12.5, lineHeight: 17, marginTop: 6 },
  divider: { height: 1, backgroundColor: c.line, marginVertical: 23 },
  summaryItem: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 14 },
  thumbnail: { width: 60, height: 68, borderRadius: 12 },
  total: {
    borderTopWidth: 1,
    borderTopColor: c.line,
    marginTop: 3,
    paddingTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottom: { paddingHorizontal: 22, paddingTop: 15, borderTopWidth: 1, borderTopColor: c.line },
  demo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 11,
  },
});
