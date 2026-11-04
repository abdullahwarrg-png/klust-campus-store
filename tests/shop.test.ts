import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  cartKey,
  cartTotal,
  createOrder,
  emptyState,
  filterProducts,
  money,
  restoreState,
  shopReducer,
  validateCustomer,
} from '../src/utils/shop';
import type { CartItem, Product } from '../src/types/shop';

const catalog: Product[] = [
  {
    id: 'tee',
    name: 'Heritage Tee',
    collection: 'Campus',
    category: 'tshirts',
    sizes: ['S', 'M', 'L'],
    price: 4900,
    description: '',
    details: [],
    colours: [
      { name: 'Cloud', hex: '#eee', image: 1 },
      { name: 'Navy', hex: '#123', image: 2 },
    ],
  },
  {
    id: 'mug',
    name: 'Campus Mug',
    collection: 'Rituals',
    category: 'mugs',
    capacity: '350 ml',
    price: 2900,
    description: '',
    details: [],
    colours: [{ name: 'Cloud', hex: '#eee', image: 3 }],
  },
];
const tee: CartItem = {
  key: cartKey('tee', 'Cloud', 'M'),
  productId: 'tee',
  colour: 'Cloud',
  size: 'M',
  quantity: 1,
};
const customer = { name: ' Aina Rahman ', email: ' AINA@example.com ', phone: '+60 12-345 6789' };
const savedOrder = () => createOrder([tee], catalog, customer, 'KL-TEST', '2026-11-03T12:00:00Z');

test('money preserves integer-sen precision', () => {
  assert.equal(money(4910), 'RM 49.10');
  assert.equal(money(0), 'RM 0.00');
});
test('search, category, and sorting combine without changing catalog order', () => {
  assert.deepEqual(
    filterProducts(catalog, ' CAMPUS ', 'mugs', 'low').map((p) => p.id),
    ['mug'],
  );
  assert.deepEqual(
    filterProducts(catalog, '', 'all', 'low').map((p) => p.id),
    ['mug', 'tee'],
  );
  assert.deepEqual(
    filterProducts(catalog, '', 'all', 'high').map((p) => p.id),
    ['tee', 'mug'],
  );
  assert.equal(catalog[0].id, 'tee');
});
test('search supports T-shirt terminology and no-results states', () => {
  assert.equal(filterProducts(catalog, 't-shirt', 'all', 'featured').length, 1);
  assert.equal(filterProducts(catalog, 'hoodie', 'all', 'featured').length, 0);
});
test('matching variants merge and are capped at ten', () => {
  let state = shopReducer(emptyState, { type: 'add', item: { ...tee, quantity: 8 } });
  state = shopReducer(state, { type: 'add', item: { ...tee, quantity: 5 } });
  assert.equal(state.cart.length, 1);
  assert.equal(state.cart[0].quantity, 10);
});
test('different sizes and colours have separate cart identities', () => {
  let state = shopReducer(emptyState, { type: 'add', item: tee });
  state = shopReducer(state, {
    type: 'add',
    item: { ...tee, key: cartKey('tee', 'Cloud', 'L'), size: 'L' },
  });
  state = shopReducer(state, {
    type: 'add',
    item: { ...tee, key: cartKey('tee', 'Navy', 'M'), colour: 'Navy' },
  });
  assert.equal(state.cart.length, 3);
});
test('quantities stay between one and ten', () => {
  const state = { cart: [tee], orders: [] };
  assert.equal(
    shopReducer(state, { type: 'quantity', key: tee.key, quantity: -4 }).cart[0].quantity,
    1,
  );
  assert.equal(
    shopReducer(state, { type: 'quantity', key: tee.key, quantity: 40 }).cart[0].quantity,
    10,
  );
});
test('removal affects only the matching line', () => {
  const state = shopReducer({ cart: [tee], orders: [] }, { type: 'remove', key: tee.key });
  assert.deepEqual(state.cart, []);
});
test('totals multiply quantities in integer sen', () => {
  assert.equal(cartTotal([{ ...tee, quantity: 3 }], catalog), 14700);
});
test('checkout requires a name but accepts arbitrary contact details', () => {
  assert.deepEqual(Object.keys(validateCustomer({ name: '', email: 'oops', phone: '123' })), [
    'name',
  ]);
  assert.deepEqual(validateCustomer(customer), {});
});
test('orders accept empty or arbitrary email and phone values', () => {
  for (const contact of [
    { email: '', phone: '' },
    { email: 'oops', phone: 'anything' },
  ]) {
    const order = createOrder(
      [tee],
      catalog,
      { ...customer, ...contact },
      'id',
      new Date().toISOString(),
    );
    assert.equal(order.customer.email, contact.email);
    assert.equal(order.customer.phone, contact.phone);
  }
});
test('empty bags and invalid customers cannot create an order', () => {
  assert.throws(() => createOrder([], catalog, customer, 'id', new Date().toISOString()));
  assert.throws(() =>
    createOrder([tee], catalog, { ...customer, name: '' }, 'id', new Date().toISOString()),
  );
});
test('orders capture independent item, price, and customer snapshots', () => {
  const order = savedOrder();
  assert.equal(order.customer.name, 'Aina Rahman');
  assert.equal(order.customer.email, 'aina@example.com');
  const changedCatalog = catalog.map((p) => ({ ...p, price: 9900 }));
  assert.equal(cartTotal([tee], changedCatalog), 9900);
  assert.equal(order.items[0].price, 4900);
  assert.equal(order.total, 4900);
  assert.notEqual(order.items[0], tee);
});
test('placing an order clears the cart and prepends order history', () => {
  const order = savedOrder();
  const next = shopReducer({ cart: [tee], orders: [] }, { type: 'placed', order });
  assert.equal(next.cart.length, 0);
  assert.equal(next.orders[0].id, order.id);
});
test('duplicate order IDs are idempotent and do not clear a later bag', () => {
  const order = savedOrder();
  const state = { cart: [tee], orders: [order] };
  assert.equal(shopReducer(state, { type: 'placed', order }), state);
});
test('persistence round-trip preserves cart and complete receipts', () => {
  const state = { cart: [tee], orders: [savedOrder()] };
  assert.deepEqual(restoreState(JSON.stringify({ version: 1, ...state }), catalog), state);
});
test('missing, broken, or unsupported storage recovers safely', () => {
  for (const raw of [null, 'not-json', '{}', 'null', '{"version":2,"cart":[],"orders":[]}'])
    assert.deepEqual(restoreState(raw, catalog), emptyState);
});
test('restoration drops removed products, invalid variants, and quantities', () => {
  const cart = [
    tee,
    { ...tee, productId: 'missing' },
    { ...tee, colour: 'Purple' },
    { ...tee, size: 'XXXL' },
    { ...tee, quantity: 0 },
    { ...tee, quantity: 11 },
    { productId: 'mug', colour: 'Cloud', size: 'M', quantity: 1 },
  ];
  assert.deepEqual(restoreState(JSON.stringify({ version: 1, cart, orders: [] }), catalog).cart, [
    tee,
  ]);
});
test('restoration rejects receipts with manipulated totals and duplicate IDs', () => {
  const order = savedOrder();
  assert.equal(
    restoreState(
      JSON.stringify({
        version: 1,
        cart: [],
        orders: [order, order, { ...order, id: 'bad', total: 1 }],
      }),
      catalog,
    ).orders.length,
    1,
  );
});
test('historical receipts survive removal of a product from the catalog', () => {
  const state = restoreState(
    JSON.stringify({ version: 1, cart: [tee], orders: [savedOrder()] }),
    [],
  );
  assert.equal(state.cart.length, 0);
  assert.equal(state.orders.length, 1);
  assert.equal(state.orders[0].items[0].name, 'Heritage Tee');
});
