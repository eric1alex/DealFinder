
export enum Source {
  Amazon = 'Amazon',
  Flipkart = 'Flipkart',
}

export enum Category {
  Electronics = 'Electronics',
  Fashion = 'Fashion',
  Home = 'Home & Kitchen',
  Grocery = 'Grocery',
  Mobiles = 'Mobiles',
  Appliances = 'Appliances'
}

export enum SortOption {
  Latest = 'latest',
  Discount = 'discount',
  PriceLowToHigh = 'price_asc',
  PriceHighToLow = 'price_desc',
  Trending = 'trending',
}

export interface Deal {
  id: string;
  title: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  source: Source;
  category: Category;
  postedAt: Date;
  popularity: number; // Clicks or views
  affiliateLink: string;
}
