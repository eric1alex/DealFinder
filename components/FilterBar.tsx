
import React from 'react';
import { useDeals } from '../hooks/useDeals';
import { Source, Category, SortOption } from '../types';
import { SORT_OPTIONS, CATEGORY_FILTERS } from '../constants';
import { AmazonLogo, FlipkartLogo } from './Icons';

const FilterBar: React.FC = () => {
  const { filters, setSourceFilter, setCategoryFilter, sortOption, setSortOption } = useDeals();

  const sourceButtonClasses = (source: Source | null) =>
    `px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all flex items-center gap-2 ${
      filters.source === source
        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg'
        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50'
    }`;
  
  const categoryButtonClasses = (category: Category | null) =>
  `px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
    filters.category === category
      ? 'bg-slate-800 text-white border-slate-800'
      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
  }`;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm mb-8 space-y-4 sticky top-[70px] z-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Source Filters */}
        <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-600 mr-2">Store:</span>
            <button onClick={() => setSourceFilter(null)} className={sourceButtonClasses(null)}>All</button>
            <button onClick={() => setSourceFilter(Source.Amazon)} className={sourceButtonClasses(Source.Amazon)}>
              <AmazonLogo className="w-5 h-5" /> Amazon
            </button>
            <button onClick={() => setSourceFilter(Source.Flipkart)} className={sourceButtonClasses(Source.Flipkart)}>
              <FlipkartLogo className="w-5 h-5" /> Flipkart
            </button>
        </div>

        {/* Sort Dropdown */}
        <div>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-full py-2 px-4 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Category Filters */}
      <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
        <span className="font-bold text-slate-600 mr-2">Category:</span>
        <button onClick={() => setCategoryFilter(null)} className={categoryButtonClasses(null)}>All</button>
        {CATEGORY_FILTERS.map(cat => (
             <button key={cat} onClick={() => setCategoryFilter(cat)} className={categoryButtonClasses(cat)}>
                {cat}
            </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
