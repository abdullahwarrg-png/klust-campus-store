import type { Category } from '../types/shop';

export const PICKUP_LOCATION = 'Block 9 Foyer (Not Real)🫣';
export type ShopCategoryId = 'all' | Category | 'more';
type ShopCategory =
  | { id: 'all' | Category; label: string; availability: 'available' }
  | { id: 'more'; label: string; availability: 'upcoming' };

export const shopCategories: readonly ShopCategory[] = [
  { id: 'all', label: 'All items', availability: 'available' },
  { id: 'tshirts', label: 'T-shirts', availability: 'available' },
  { id: 'mugs', label: 'Mugs', availability: 'available' },
  { id: 'more', label: 'More', availability: 'upcoming' },
];
