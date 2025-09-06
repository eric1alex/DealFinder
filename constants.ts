
import { Deal, Source, Category, SortOption } from './types';

export const SORT_OPTIONS = [
  { value: SortOption.Latest, label: 'Latest' },
  { value: SortOption.Discount, label: 'Highest Discount' },
  { value: SortOption.PriceLowToHigh, label: 'Price: Low to High' },
  { value: SortOption.PriceHighToLow, label: 'Price: High to Low' },
  { value: SortOption.Trending, label: 'Trending' },
];

export const CATEGORY_FILTERS = [
    Category.Electronics,
    Category.Fashion,
    Category.Home,
    Category.Grocery,
    Category.Mobiles,
    Category.Appliances
];

export const MOCK_DEALS: Deal[] = Array.from({ length: 50 }, (_, i) => {
  const source = i % 2 === 0 ? Source.Amazon : Source.Flipkart;
  const category = CATEGORY_FILTERS[i % CATEGORY_FILTERS.length];
  const originalPrice = parseFloat((Math.random() * (10000 - 500) + 500).toFixed(2));
  const discountPercentage = Math.floor(Math.random() * (80 - 10) + 10);
  const discountedPrice = parseFloat((originalPrice * (1 - discountPercentage / 100)).toFixed(2));
  
  return {
    id: `deal-${i + 1}`,
    title: `Product Title ${i + 1} - A great deal on ${category}`,
    image: `https://picsum.photos/seed/${i+1}/400/300`,
    originalPrice,
    discountedPrice,
    discountPercentage,
    source,
    category,
    postedAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 7)), // within last 7 days
    popularity: Math.floor(Math.random() * 5000),
    affiliateLink: `https://example.com/deal/${i + 1}`,
  };
});
