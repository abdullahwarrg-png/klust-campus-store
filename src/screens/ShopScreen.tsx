import { useMemo, useRef, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowDownUp,
  BadgeCheck,
  ChevronDown,
  MapPin,
  Ruler,
  Search,
  ShoppingBag,
  X,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { products } from '../data/products';
import { PICKUP_LOCATION, shopCategories, type ShopCategoryId } from '../data/store';
import { ProductCard } from '../components/ProductCard';
import { CollectionHero } from '../components/CollectionHero';
import { Brand, Eyebrow, IconButton, Label } from '../components/ui';
import { colours as c, fonts, radius } from '../theme';
import { useShop } from '../state/ShopProvider';
import { filterProducts } from '../utils/shop';
import type { AppNavigation } from '../navigation/types';
import type { Product, SortOrder } from '../types/shop';

const perks = [
  { icon: MapPin, label: PICKUP_LOCATION },
  { icon: BadgeCheck, label: 'Official crest' },
  { icon: Ruler, label: 'Sizes S–XXL' },
];
const sorts: { id: SortOrder; label: string }[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'low', label: 'Price: low to high' },
  { id: 'high', label: 'Price: high to low' },
];

export function ShopScreen() {
  const navigation = useNavigation<AppNavigation>();
  const insets = useSafeAreaInsets();
  const { itemCount } = useShop();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ShopCategoryId>('all');
  const [sort, setSort] = useState<SortOrder>('featured');
  const [sortOpen, setSortOpen] = useState(false);
  const list = useRef<FlatList<Product>>(null);
  const [catalogOffset, setCatalogOffset] = useState(0);
  const filtered = useMemo(
    () => filterProducts(products, search, category, sort),
    [search, category, sort],
  );

  const selectedCategory = shopCategories.find((item) => item.id === category)!;
  const upcoming = selectedCategory.availability === 'upcoming';

  return (
    <View style={{ flex: 1, backgroundColor: c.white }}>
      <View style={[s.top, { paddingTop: Math.max(insets.top, 16) }]}>
        <Brand />
        <IconButton
          label={`Open bag, ${itemCount} items`}
          onPress={() => navigation.navigate('Main', { screen: 'Cart' })}
          style={s.bag}
        >
          <ShoppingBag size={21} color={c.ink} strokeWidth={1.7} />
          {itemCount > 0 && (
            <View style={s.count}>
              <Label style={{ fontSize: 9, color: c.white, fontFamily: fonts.bold }}>
                {itemCount}
              </Label>
            </View>
          )}
        </IconButton>
      </View>
      <FlatList
        ref={list}
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 22 }}
        columnWrapperStyle={{ gap: 14 }}
        ListHeaderComponent={
          <>
            <View style={s.search}>
              <Search size={18} color={c.muted} strokeWidth={1.8} />
              <TextInput
                accessibilityLabel="Search products"
                placeholder="Find your campus favourites"
                placeholderTextColor="#8A94A5"
                value={search}
                onChangeText={setSearch}
                style={s.input}
                returnKeyType="search"
              />
              {!!search && (
                <IconButton
                  label="Clear search"
                  onPress={() => setSearch('')}
                  style={{ minWidth: 32, minHeight: 36 }}
                >
                  <X size={17} color={c.muted} />
                </IconButton>
              )}
            </View>
            {!search && category === 'all' && (
              <>
                <CollectionHero
                  onExplore={() =>
                    list.current?.scrollToOffset({ offset: catalogOffset, animated: true })
                  }
                />
                <View style={s.perks}>
                  {perks.map(({ icon: Icon, label }) => (
                    <View key={label} style={s.perk}>
                      <Icon size={15} color={c.blue} strokeWidth={1.9} />
                      <Label style={s.perkLabel}>{label}</Label>
                    </View>
                  ))}
                </View>
              </>
            )}
            <View
              style={s.collectionHeading}
              onLayout={(event) => setCatalogOffset(event.nativeEvent.layout.y)}
            >
              <View>
                <Eyebrow>WEAR IT. USE IT. MAKE IT YOURS.</Eyebrow>
                <Label style={s.sectionTitle}>
                  {search ? 'Search results' : 'Campus essentials'}
                </Label>
              </View>
              <Label muted style={{ fontSize: 12, marginBottom: 3 }}>
                {upcoming ? 'Coming soon' : `${filtered.length} items`}
              </Label>
            </View>
            <View style={s.controls}>
              <View style={s.categories}>
                {shopCategories.map((item) => (
                  <Pressable
                    key={item.id}
                    accessibilityRole="button"
                    accessibilityLabel={`Filter ${item.label}${item.availability === 'upcoming' ? ' — Coming soon' : ''}`}
                    accessibilityState={{ selected: category === item.id }}
                    onPress={() => {
                      setCategory(item.id);
                      setSortOpen(false);
                    }}
                    style={[s.chip, category === item.id && s.activeChip]}
                  >
                    <Label
                      style={{
                        fontSize: 13,
                        fontFamily: fonts.semibold,
                        color: category === item.id ? c.white : '#4E5B73',
                      }}
                    >
                      {item.label}
                    </Label>
                    {item.availability === 'upcoming' && (
                      <Label
                        style={{ fontSize: 11, color: category === item.id ? c.white : c.muted }}
                      >
                        Coming soon
                      </Label>
                    )}
                  </Pressable>
                ))}
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Sort products"
                accessibilityState={{ expanded: sortOpen }}
                onPress={() => setSortOpen(!sortOpen)}
                style={s.sortButton}
              >
                <ArrowDownUp size={14} color={c.ink} />
                <Label style={{ fontSize: 12, fontFamily: fonts.semibold }}>
                  {sort === 'featured' ? 'Featured' : sort === 'low' ? 'Price ↑' : 'Price ↓'}
                </Label>
                <ChevronDown size={13} color={c.muted} />
              </Pressable>
            </View>
            {sortOpen && (
              <View style={s.sortOptions}>
                {sorts.map((option) => (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: sort === option.id }}
                    key={option.id}
                    onPress={() => {
                      setSort(option.id);
                      setSortOpen(false);
                    }}
                    style={{
                      padding: 13,
                      backgroundColor: sort === option.id ? c.paleBlue : c.white,
                      borderRadius: radius.sm,
                    }}
                  >
                    <Label
                      style={{
                        fontSize: 13,
                        color: sort === option.id ? c.blue : c.ink,
                        fontFamily: sort === option.id ? fonts.semibold : fonts.regular,
                      }}
                    >
                      {option.label}
                    </Label>
                  </Pressable>
                ))}
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: 50 }}>
            <Search size={30} color={c.muted} />
            <Label style={{ fontFamily: fonts.bold, fontSize: 19, marginTop: 16 }}>
              {upcoming ? 'More coming soon' : 'No campus finds just yet'}
            </Label>
            <Label muted style={{ textAlign: 'center', lineHeight: 22, marginTop: 10 }}>
              {upcoming
                ? 'More campus favourites are on the way. Browse our T-shirts and mugs while you wait.'
                : 'Try another search or choose a different category.'}
            </Label>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setSearch('');
                setCategory('all');
              }}
              style={{ padding: 18 }}
            >
              <Label style={{ color: c.blue, fontFamily: fonts.bold }}>
                {upcoming ? 'Browse available items' : 'Reset search and filters'}
              </Label>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('Product', { productId: item.id })}
          />
        )}
        ListFooterComponent={
          filtered.length ? (
            <View style={s.footer}>
              <Image
                source={require('../../assets/branding/klust-crest.png')}
                style={{ width: 27, height: 27 }}
              />
              <Label muted style={{ fontSize: 11, textAlign: 'center', lineHeight: 18 }}>
                A little campus. Everywhere.{`\n`}KLUST Campus Store · Demonstration collection
              </Label>
            </View>
          ) : undefined
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  top: {
    paddingHorizontal: 22,
    paddingBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bag: { borderWidth: 1, borderColor: c.line, borderRadius: radius.md, width: 46, height: 46 },
  count: {
    position: 'absolute',
    top: -4,
    right: -4,
    borderRadius: 10,
    minWidth: 19,
    height: 19,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.blue,
    borderWidth: 2,
    borderColor: c.white,
  },
  search: {
    height: 50,
    borderRadius: radius.md,
    backgroundColor: c.background,
    borderWidth: 1,
    borderColor: c.line,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    gap: 10,
    marginBottom: 18,
  },
  input: {
    flex: 1,
    height: '100%',
    minWidth: 0,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: c.ink,
  },
  perks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: c.line,
  },
  perk: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  perkLabel: { fontSize: 11, fontFamily: fonts.medium, color: '#46546D' },
  collectionHeading: {
    marginTop: 26,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 26, letterSpacing: -0.9, marginTop: 6 },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 6,
    flexWrap: 'wrap',
  },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, flex: 1, minWidth: '100%' },
  chip: {
    borderRadius: radius.pill,
    backgroundColor: c.white,
    borderWidth: 1,
    borderColor: c.line,
    paddingHorizontal: 13,
    minHeight: 48,
    paddingVertical: 7,
    justifyContent: 'center',
  },
  activeChip: { backgroundColor: c.navy, borderColor: c.navy },
  sortButton: {
    flexDirection: 'row',
    gap: 5,
    minHeight: 44,
    alignItems: 'center',
  },
  sortOptions: {
    borderWidth: 1,
    borderColor: c.line,
    padding: 5,
    borderRadius: radius.md,
    marginBottom: 18,
    backgroundColor: c.white,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: c.line,
    paddingTop: 24,
    marginTop: 6,
    alignItems: 'center',
    gap: 9,
  },
});
