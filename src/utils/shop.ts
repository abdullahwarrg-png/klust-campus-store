import type { CartItem, Customer, Order, Product, ShopState, Size, SortOrder } from '../types/shop';

export const MAX_QUANTITY = 10;
export const emptyState: ShopState = { cart: [], orders: [] };
export const money = (sen: number) => `RM ${(sen / 100).toFixed(2)}`;
export const cartKey = (productId: string, colour: string, size?: Size) =>
  `${productId}:${colour}:${size ?? 'standard'}`;

export function filterProducts(
  catalog: Product[],
  search: string,
  category: string,
  sort: SortOrder,
) {
  const query = search.trim().toLowerCase();
  const result = catalog.filter(
    (product) =>
      (category === 'all' || product.category === category) &&
      `${product.name} ${product.collection} ${product.category === 'tshirts' ? 't-shirt tshirt' : 'mug'}`
        .toLowerCase()
        .includes(query),
  );
  if (sort !== 'featured')
    result.sort((a, b) => (sort === 'low' ? a.price - b.price : b.price - a.price));
  return result;
}

export function cartTotal(cart: CartItem[], catalog: Product[]) {
  return cart.reduce(
    (sum, item) => sum + (catalog.find((p) => p.id === item.productId)?.price ?? 0) * item.quantity,
    0,
  );
}

export function validateCustomer(customer: Customer): Partial<Record<keyof Customer, string>> {
  const errors: Partial<Record<keyof Customer, string>> = {};
  if (customer.name.trim().length < 2)
    errors.name = 'Enter your full name (at least 2 characters).';
  return errors;
}

export type ShopAction =
  | { type: 'hydrate'; state: ShopState }
  | { type: 'add'; item: CartItem }
  | { type: 'quantity'; key: string; quantity: number }
  | { type: 'remove'; key: string }
  | { type: 'placed'; order: Order };

export function shopReducer(state: ShopState, action: ShopAction): ShopState {
  switch (action.type) {
    case 'hydrate':
      return action.state;
    case 'add': {
      const existing = state.cart.find((item) => item.key === action.item.key);
      return {
        ...state,
        cart: existing
          ? state.cart.map((item) =>
              item.key === action.item.key
                ? {
                    ...item,
                    quantity: Math.min(MAX_QUANTITY, item.quantity + action.item.quantity),
                  }
                : item,
            )
          : [
              ...state.cart,
              {
                ...action.item,
                quantity: Math.max(1, Math.min(MAX_QUANTITY, action.item.quantity)),
              },
            ],
      };
    }
    case 'quantity':
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.key === action.key
            ? { ...item, quantity: Math.max(1, Math.min(MAX_QUANTITY, action.quantity)) }
            : item,
        ),
      };
    case 'remove':
      return { ...state, cart: state.cart.filter((item) => item.key !== action.key) };
    case 'placed':
      return state.orders.some((order) => order.id === action.order.id)
        ? state
        : { cart: [], orders: [action.order, ...state.orders] };
  }
}

export function createOrder(
  cart: CartItem[],
  catalog: Product[],
  customer: Customer,
  id: string,
  createdAt: string,
): Order {
  if (!cart.length) throw new Error('Your bag is empty. Add an item before checking out.');
  if (Object.keys(validateCustomer(customer)).length)
    throw new Error('Please check your contact details.');
  return {
    id,
    createdAt,
    customer: {
      name: customer.name.trim(),
      email: customer.email.trim().toLowerCase(),
      phone: customer.phone.trim(),
    },
    items: cart.map((item) => {
      const product = catalog.find((p) => p.id === item.productId);
      if (!product) throw new Error('A product is unavailable. Please review your bag.');
      return { ...item, name: product.name, price: product.price, category: product.category };
    }),
    total: cartTotal(cart, catalog),
  };
}

// Accept only catalog-compatible cart variants and internally consistent receipts.
export function restoreState(raw: string | null, catalog: Product[]): ShopState {
  if (!raw) return emptyState;
  try {
    const saved = JSON.parse(raw);
    if (saved.version !== 1 || !Array.isArray(saved.cart) || !Array.isArray(saved.orders))
      return emptyState;
    const cart: CartItem[] = [];
    for (const item of saved.cart) {
      const product = catalog.find((p) => p.id === item?.productId);
      if (!product || !product.colours.some((colour) => colour.name === item.colour)) continue;
      if (
        product.category === 'tshirts'
          ? !product.sizes.includes(item.size)
          : item.size !== undefined
      )
        continue;
      if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_QUANTITY)
        continue;
      const key = cartKey(item.productId, item.colour, item.size);
      if (!cart.some((line) => line.key === key))
        cart.push({
          key,
          productId: item.productId,
          colour: item.colour,
          size: item.size,
          quantity: item.quantity,
        });
    }
    const ids = new Set<string>();
    const orders: Order[] = saved.orders.filter((order: Order) => {
      if (
        !order ||
        typeof order.id !== 'string' ||
        ids.has(order.id) ||
        typeof order.createdAt !== 'string' ||
        !Number.isFinite(Date.parse(order.createdAt))
      )
        return false;
      if (
        !order.customer ||
        typeof order.customer.name !== 'string' ||
        typeof order.customer.email !== 'string' ||
        typeof order.customer.phone !== 'string'
      )
        return false;
      if (
        Object.keys(validateCustomer(order.customer)).length ||
        !Array.isArray(order.items) ||
        !order.items.length
      )
        return false;
      const valid = order.items.every(
        (item) =>
          item &&
          typeof item.key === 'string' &&
          typeof item.productId === 'string' &&
          typeof item.name === 'string' &&
          typeof item.colour === 'string' &&
          (item.category === 'tshirts' || item.category === 'mugs') &&
          (item.size === undefined || ['S', 'M', 'L', 'XL', 'XXL'].includes(item.size)) &&
          Number.isSafeInteger(item.price) &&
          item.price >= 0 &&
          Number.isInteger(item.quantity) &&
          item.quantity >= 1 &&
          item.quantity <= MAX_QUANTITY,
      );
      if (
        !valid ||
        !Number.isSafeInteger(order.total) ||
        order.total !== order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      )
        return false;
      ids.add(order.id);
      return true;
    });
    return { cart, orders };
  } catch {
    return emptyState;
  }
}
