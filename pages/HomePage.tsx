
import React, { useState } from 'react';
import { useDeals } from '../hooks/useDeals';
import DealCard from '../components/DealCard';
import FilterBar from '../components/FilterBar';
import Hero from '../components/Hero';

const DEALS_PER_PAGE = 12;

const HomePage: React.FC = () => {
  const { filteredDeals } = useDeals();
  const [visibleDeals, setVisibleDeals] = useState(DEALS_PER_PAGE);

  const loadMore = () => {
    setVisibleDeals(prev => prev + DEALS_PER_PAGE);
  };

  const dealsToShow = filteredDeals.slice(0, visibleDeals);
  const hasMore = visibleDeals < filteredDeals.length;

  return (
    <div>
      <Hero />
      
      <div id="deals-section">
        <FilterBar />
        
        {dealsToShow.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {dealsToShow.map(deal => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMore}
                  className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-full hover:bg-indigo-700 transition-transform transform hover:scale-105 shadow-lg"
                >
                  Load More Deals
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-slate-700">No Deals Found</h2>
              <p className="text-slate-500 mt-2">Try adjusting your filters to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
