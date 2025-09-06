
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { Deal, Source, Category, SortOption } from '../types';
import { MOCK_DEALS } from '../constants';

interface DealsContextType {
  deals: Deal[];
  filteredDeals: Deal[];
  findDealById: (id: string) => Deal | undefined;
  filters: {
    source: Source | null;
    category: Category | null;
  };
  setSourceFilter: (source: Source | null) => void;
  setCategoryFilter: (category: Category | null) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const DealsContext = createContext<DealsContextType | undefined>(undefined);

export const DealsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deals] = useState<Deal[]>(MOCK_DEALS);
  const [filters, setFilters] = useState<{ source: Source | null; category: Category | null }>({
    source: null,
    category: null,
  });
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.Latest);
  const [searchTerm, setSearchTerm] = useState('');

  const setSourceFilter = useCallback((source: Source | null) => {
    setFilters(prev => ({ ...prev, source }));
  }, []);

  const setCategoryFilter = useCallback((category: Category | null) => {
    setFilters(prev => ({ ...prev, category }));
  }, []);

  const findDealById = useCallback((id: string) => {
    return deals.find(deal => deal.id === id);
  }, [deals]);

  const filteredDeals = useMemo(() => {
    let result = [...deals];

    if (filters.source) {
      result = result.filter(deal => deal.source === filters.source);
    }
    if (filters.category) {
        result = result.filter(deal => deal.category === filters.category);
    }
    if (searchTerm) {
      result = result.filter(deal => deal.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    switch (sortOption) {
      case SortOption.Latest:
        result.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
        break;
      case SortOption.Discount:
        result.sort((a, b) => b.discountPercentage - a.discountPercentage);
        break;
      case SortOption.PriceLowToHigh:
        result.sort((a, b) => a.discountedPrice - b.discountedPrice);
        break;
      case SortOption.PriceHighToLow:
        result.sort((a, b) => b.discountedPrice - a.discountedPrice);
        break;
      case SortOption.Trending:
        result.sort((a, b) => b.popularity - a.popularity);
        break;
    }

    return result;
  }, [deals, filters, sortOption, searchTerm]);

  return (
    <DealsContext.Provider value={{
      deals,
      filteredDeals,
      findDealById,
      filters,
      setSourceFilter,
      setCategoryFilter,
      sortOption,
      setSortOption,
      searchTerm,
      setSearchTerm,
    }}>
      {children}
    </DealsContext.Provider>
  );
};

export const useDeals = () => {
  const context = useContext(DealsContext);
  if (context === undefined) {
    throw new Error('useDeals must be used within a DealsProvider');
  }
  return context;
};
