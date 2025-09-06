
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDeals } from '../hooks/useDeals';
import DealCard from '../components/DealCard';
import FilterBar from '../components/FilterBar';

const SearchPage: React.FC = () => {
  const { filteredDeals, searchTerm, setSearchTerm } = useDeals();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const query = searchParams.get('q');
    if (query && query !== searchTerm) {
      setSearchTerm(query);
    }
  }, [searchParams, searchTerm, setSearchTerm]);

  return (
    <div>
      <FilterBar />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Search Results for: <span className="text-indigo-600">"{searchTerm}"</span>
        </h1>
        <p className="text-slate-500 mt-1">{filteredDeals.length} deals found.</p>
      </div>
      
      {filteredDeals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDeals.map(deal => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-slate-700">No Deals Found</h2>
            <p className="text-slate-500 mt-2">We couldn't find any deals matching your search. Try a different keyword or check your filters.</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
