
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDeals } from '../hooks/useDeals';
import { TagIcon, SearchIcon } from './Icons';

const Header: React.FC = () => {
  const [localSearch, setLocalSearch] = useState('');
  const { setSearchTerm } = useDeals();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchTerm(localSearch);
    navigate(localSearch ? `/search?q=${encodeURIComponent(localSearch)}` : '/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
    if (e.target.value === '') {
        setSearchTerm('');
        if (location.hash.startsWith('#/search')) {
             navigate('/');
        }
    }
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-slate-800">
          <TagIcon className="w-8 h-8 text-indigo-600" />
          <span>DealFinder</span>
        </Link>
        <div className="w-full max-w-md">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={localSearch}
              onChange={handleInputChange}
              placeholder="Search for deals..."
              className="w-full bg-slate-100 border-2 border-slate-200 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-indigo-600">
              <SearchIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
