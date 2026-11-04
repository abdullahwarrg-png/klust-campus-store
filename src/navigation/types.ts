import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type TabParams = { Shop: undefined; Cart: undefined; Orders: undefined };
export type RootStackParams = {
  Main: NavigatorScreenParams<TabParams> | undefined;
  Product: { productId: string };
  Checkout: undefined;
  Receipt: { orderId: string };
};
export type AppNavigation = NativeStackNavigationProp<RootStackParams>;
