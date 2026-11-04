import { ActivityIndicator, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ClipboardList, ShoppingBag, Store } from 'lucide-react-native';
import { ShopScreen } from '../screens/ShopScreen';
import { ProductScreen } from '../screens/ProductScreen';
import { CartScreen } from '../screens/CartScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { ReceiptScreen } from '../screens/ReceiptScreen';
import { useShop } from '../state/ShopProvider';
import { colours as c, fonts } from '../theme';
import { Label } from '../components/ui';
import type { RootStackParams, TabParams } from './types';

const Tab = createBottomTabNavigator<TabParams>();
const Stack = createNativeStackNavigator<RootStackParams>();
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: c.blue,
    background: c.white,
    card: c.white,
    text: c.ink,
    border: c.line,
  },
};

function MainTabs() {
  const { itemCount } = useShop();
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: c.blue,
        tabBarInactiveTintColor: '#8C97AA',
        tabBarStyle: {
          height: 70 + insets.bottom,
          paddingTop: 7,
          paddingBottom: Math.max(insets.bottom, 7),
          borderTopColor: c.line,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 11, marginTop: 4 },
        tabBarBadgeStyle: {
          backgroundColor: c.blue,
          color: c.white,
          fontFamily: fonts.bold,
          fontSize: 9,
          minWidth: 16,
          height: 16,
          lineHeight: 16,
        },
        tabBarIcon: ({ color, focused }) => {
          const Icon =
            route.name === 'Shop' ? Store : route.name === 'Cart' ? ShoppingBag : ClipboardList;
          return (
            <View
              style={{
                width: 47,
                height: 29,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused ? c.paleBlue : 'transparent',
              }}
            >
              <Icon size={20} color={color} strokeWidth={focused ? 2 : 1.7} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Shop"
        component={ShopScreen}
        options={{ tabBarAccessibilityLabel: 'Shop tab' }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: 'Bag',
          tabBarAccessibilityLabel: 'Cart tab',
          tabBarBadge: itemCount || undefined,
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{ tabBarAccessibilityLabel: 'Orders tab' }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { ready, storageError } = useShop();
  if (!ready)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={c.blue} />
        <Label muted style={{ marginTop: 12, fontSize: 12 }}>
          Getting your campus favourites ready…
        </Label>
      </View>
    );
  return (
    <View style={{ flex: 1 }}>
      {!!storageError && (
        <View style={{ backgroundColor: '#FFF2E3', padding: 12 }}>
          <Label
            accessibilityRole="alert"
            style={{ color: '#84461A', fontSize: 11, lineHeight: 17 }}
          >
            {storageError}
          </Label>
        </View>
      )}
      <NavigationContainer theme={theme}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: c.white },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Product" component={ProductScreen} />
          <Stack.Screen
            name="Checkout"
            component={CheckoutScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name="Receipt" component={ReceiptScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
