import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Minus,
  Plus,
  type LucideIcon,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';
import { colours as c, fonts } from '../theme';
import { PICKUP_LOCATION } from '../data/store';

export function Label({ style, muted = false, ...props }: TextProps & { muted?: boolean }) {
  return <Text {...props} style={[styles.text, muted && { color: c.muted }, style]} />;
}

export function Eyebrow({ children, style }: { children: ReactNode; style?: TextStyle }) {
  return <Label style={[styles.eyebrow, style ?? {}]}>{children}</Label>;
}

export function Button({
  title,
  onPress,
  secondary,
  disabled,
  loading,
  icon: Icon = ArrowRight,
  style,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon | null;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: !!disabled || !!loading, busy: !!loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondary,
        (disabled || loading) && { opacity: 0.5 },
        pressed && { opacity: 0.8 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={secondary ? c.blue : c.white} />
      ) : (
        <>
          <Label
            style={{ fontFamily: fonts.bold, color: secondary ? c.blue : c.white, fontSize: 15 }}
          >
            {title}
          </Label>
          {Icon && <Icon size={19} color={secondary ? c.blue : c.white} strokeWidth={1.8} />}
        </>
      )}
    </Pressable>
  );
}

export function IconButton({
  label,
  onPress,
  children,
  style,
}: {
  label: string;
  onPress: () => void;
  children: ReactNode;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.iconButton, pressed && { opacity: 0.55 }, style]}
    >
      {children}
    </Pressable>
  );
}

export function PageHeader({
  title,
  subtitle,
  back,
  right,
}: {
  title: string;
  subtitle?: string;
  back?: () => void;
  right?: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, 14) }]}>
      <View style={styles.row}>
        {back && (
          <IconButton label="Go back" onPress={back} style={{ marginLeft: -8 }}>
            <ArrowLeft size={22} color={c.ink} />
          </IconButton>
        )}
        <View style={{ flex: 1 }}>
          <Label style={styles.headerTitle}>{title}</Label>
          {subtitle && (
            <Label muted style={{ fontSize: 13, marginTop: 3 }}>
              {subtitle}
            </Label>
          )}
        </View>
        {right}
      </View>
    </View>
  );
}

export function QuantityControl({
  quantity,
  onChange,
  small = false,
}: {
  quantity: number;
  onChange: (value: number) => void;
  small?: boolean;
}) {
  return (
    <View style={[styles.quantity, small && { height: 40 }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
        accessibilityState={{ disabled: quantity <= 1 }}
        disabled={quantity <= 1}
        onPress={() => onChange(quantity - 1)}
        style={styles.quantityButton}
      >
        <Minus size={15} color={quantity <= 1 ? '#C2CAD7' : c.ink} />
      </Pressable>
      <Label style={{ fontFamily: fonts.bold, minWidth: 20, textAlign: 'center' }}>
        {quantity}
      </Label>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
        accessibilityState={{ disabled: quantity >= 10 }}
        disabled={quantity >= 10}
        onPress={() => onChange(quantity + 1)}
        style={styles.quantityButton}
      >
        <Plus size={15} color={quantity >= 10 ? '#C2CAD7' : c.ink} />
      </Pressable>
    </View>
  );
}

export function PickupCard({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.pickup, compact && { padding: 14 }]}>
      <View style={styles.pickupIcon}>
        <MapPin size={19} color={c.blue} />
      </View>
      <View style={{ flex: 1 }}>
        <Label style={{ fontFamily: fonts.bold, fontSize: 14 }}>Pickup · {PICKUP_LOCATION}</Label>
        <Label muted style={{ fontSize: 12, lineHeight: 18, marginTop: 3 }}>
          {compact
            ? 'Campus pickup · Complimentary'
            : 'Complimentary campus pickup\nDemonstration only; no collection is reserved.'}
        </Label>
      </View>
      <Check size={16} color={c.blue} />
    </View>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  onAction,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action: string;
  onAction: () => void;
}) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Icon size={34} color={c.blue} strokeWidth={1.5} />
      </View>
      <Label style={{ fontSize: 24, fontFamily: fonts.bold, textAlign: 'center' }}>{title}</Label>
      <Label muted style={{ lineHeight: 23, textAlign: 'center', marginTop: 12, marginBottom: 24 }}>
        {description}
      </Label>
      <Button title={action} onPress={onAction} style={{ width: '100%' }} />
    </View>
  );
}

export function Brand() {
  return (
    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
      <Image
        source={require('../../assets/branding/klust-crest.png')}
        style={{ width: 40, height: 40 }}
        resizeMode="contain"
      />
      <View>
        <Label style={{ fontSize: 18, fontFamily: fonts.bold, letterSpacing: -0.7 }}>
          KLUST<Label style={{ fontFamily: fonts.regular, fontSize: 18 }}> / store</Label>
        </Label>
        <Label muted style={{ fontSize: 9, letterSpacing: 1.6, marginTop: 2 }}>
          CAMPUS MERCHANDISE
        </Label>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  text: { fontFamily: fonts.regular, fontSize: 14, color: c.ink },
  eyebrow: { fontFamily: fonts.bold, fontSize: 11, letterSpacing: 1.6, color: c.muted },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  button: {
    minHeight: 54,
    borderRadius: 14,
    backgroundColor: c.blue,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  secondary: { backgroundColor: c.paleBlue },
  iconButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  header: {
    backgroundColor: c.white,
    paddingHorizontal: 22,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: c.line,
  },
  headerTitle: { fontSize: 22, fontFamily: fonts.bold, letterSpacing: -0.7 },
  quantity: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.line,
    backgroundColor: c.white,
  },
  quantityButton: { minWidth: 40, height: '100%', justifyContent: 'center', alignItems: 'center' },
  pickup: {
    padding: 18,
    borderRadius: 15,
    backgroundColor: c.paleBlue,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  pickupIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: c.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: { flex: 1, padding: 36, alignItems: 'center', justifyContent: 'center', minHeight: 400 },
  emptyIcon: {
    width: 86,
    height: 86,
    borderRadius: 30,
    backgroundColor: c.paleBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
});
