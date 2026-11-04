import type { ImageSourcePropType } from 'react-native';

export type Category = 'tshirts' | 'mugs';
export type Size = 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type ProductColour = { name: string; hex: string; image: ImageSourcePropType };

type ProductBase = {
  id: string;
  name: string;
  collection: string;
  price: number; // Integer sen; RM 49.00 is 4900.
  description: string;
  details: string[];
  badge?: string;
  colours: ProductColour[];
};

export type Product = ProductBase &
  ({ category: 'tshirts'; sizes: Size[] } | { category: 'mugs'; capacity: string });

export type CartItem = {
  key: string;
  productId: string;
  colour: string;
  size?: Size;
  quantity: number;
};

export type Customer = { name: string; email: string; phone: string };
export type OrderItem = CartItem & { name: string; price: number; category: Category };
export type Order = {
  id: string;
  createdAt: string;
  customer: Customer;
  items: OrderItem[];
  total: number;
};
export type ShopState = { cart: CartItem[]; orders: Order[] };
export type SortOrder = 'featured' | 'low' | 'high';
