import type { Category } from '../types/shop';

export const PICKUP_LOCATION = 'Block 9 Foyer';
export type ShopCategoryId = 'all' | Category | 'pens' | 'caps';
type ShopCategory =
  | { id: 'all' | Category; label: string; availability: 'available' }
  | { id: 'pens' | 'caps'; label: string; availability: 'upcoming' };

export const shopCategories: readonly ShopCategory[] = [
  { id: 'all', label: 'All items', availability: 'available' },
  { id: 'tshirts', label: 'T-shirts', availability: 'available' },
  { id: 'mugs', label: 'Mugs', availability: 'available' },
  { id: 'pens', label: 'Pens', availability: 'upcoming' },
  { id: 'caps', label: 'Caps', availability: 'upcoming' },
];
