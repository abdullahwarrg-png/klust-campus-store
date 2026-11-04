import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { products } from '../data/products';
import type { Customer, Product, ShopState, Size } from '../types/shop';
import {
  cartKey,
  cartTotal,
  createOrder,
  emptyState,
  MAX_QUANTITY,
  restoreState,
  shopReducer,
  type ShopAction,
} from '../utils/shop';

export const STORAGE_KEY = '@klust/campus-store/v1';

type ShopContextValue = ShopState & {
  ready: boolean;
  storageError: string;
  itemCount: number;
  total: number;
  addItem: (product: Product, colour: string, quantity: number, size?: Size) => number;
  setQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  placeOrder: (customer: Customer) => Promise<string>;
};

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(shopReducer, emptyState);
  const current = useRef(state);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState('');
  const writeQueue = useRef<Promise<void>>(Promise.resolve());
  const placing = useRef(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!active) return;
        const restored = restoreState(raw, products);
        current.current = restored;
        dispatch({ type: 'hydrate', state: restored });
      })
      .catch(() => {
        if (active)
          setStorageError('Saved shopping data could not be loaded. Please try reopening the app.');
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const save = useCallback((next: ShopState) => {
    const serialized = JSON.stringify({ version: 1, ...next });
    // Serial writes stop a slower, older cart update overwriting a newer order.
    const operation = writeQueue.current
      .catch(() => undefined)
      .then(() => AsyncStorage.setItem(STORAGE_KEY, serialized));
    writeQueue.current = operation;
    operation
      .then(() => setStorageError(''))
      .catch(() =>
        setStorageError(
          'Changes could not be saved on this device. Your current bag is still available.',
        ),
      );
    return operation;
  }, []);

  const updateCart = useCallback(
    (action: ShopAction) => {
      if (placing.current) return;
      const next = shopReducer(current.current, action);
      current.current = next;
      dispatch({ type: 'hydrate', state: next });
      void save(next).catch(() => undefined);
    },
    [save],
  );

  const addItem = (product: Product, colour: string, quantity: number, size?: Size) => {
    if (
      !ready ||
      placing.current ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      !product.colours.some((option) => option.name === colour)
    )
      return 0;
    if (
      product.category === 'tshirts' ? !size || !product.sizes.includes(size) : size !== undefined
    )
      return 0;
    const key = cartKey(product.id, colour, size);
    const previous = current.current.cart.find((item) => item.key === key)?.quantity ?? 0;
    const added = Math.min(quantity, MAX_QUANTITY - previous);
    if (added)
      updateCart({
        type: 'add',
        item: { key, productId: product.id, colour, size, quantity: added },
      });
    return added;
  };

  const placeOrder = async (customer: Customer) => {
    if (placing.current) throw new Error('Your order is already being saved.');
    if (!ready) throw new Error('Your bag is still loading. Please try again.');
    placing.current = true;
    try {
      const id = `KL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
      const order = createOrder(
        current.current.cart,
        products,
        customer,
        id,
        new Date().toISOString(),
      );
      const next = shopReducer(current.current, { type: 'placed', order });
      // Confirm durable storage before clearing the bag or showing a receipt.
      await save(next);
      current.current = next;
      dispatch({ type: 'hydrate', state: next });
      return id;
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('Your')) throw error;
      throw new Error('We could not save this order. Your bag is unchanged; please try again.');
    } finally {
      placing.current = false;
    }
  };

  return (
    <ShopContext.Provider
      value={{
        ...state,
        ready,
        storageError,
        addItem,
        itemCount: state.cart.reduce((sum, item) => sum + item.quantity, 0),
        total: cartTotal(state.cart, products),
        setQuantity: (key, quantity) => {
          if (Number.isInteger(quantity)) updateCart({ type: 'quantity', key, quantity });
        },
        removeItem: (key) => updateCart({ type: 'remove', key }),
        placeOrder,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used inside ShopProvider.');
  return context;
}
