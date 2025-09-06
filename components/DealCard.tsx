
import React from 'react';
import { Link } from 'react-router-dom';
import { Deal, Source } from '../types';
import { AmazonLogo, FlipkartLogo } from './Icons';

interface DealCardProps {
  deal: Deal;
}

const DealCard: React.FC<DealCardProps> = ({ deal }) => {
  const SourceLogo = deal.source === Source.Amazon ? AmazonLogo : FlipkartLogo;
  const sourceColor = deal.source === Source.Amazon ? 'border-amazon' : 'border-flipkart';

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group transform hover:-translate-y-1">
      <Link to={`/deal/${deal.id}`} className="block">
        <div className="relative">
          <img src={deal.image} alt={deal.title} className="w-full h-48 object-cover" />
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {deal.discountPercentage}% OFF
          </div>
        </div>
      </Link>
      <div className={`p-4 flex flex-col flex-grow border-t-4 ${sourceColor}`}>
        <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded">{deal.category}</span>
            <SourceLogo className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 flex-grow my-2 group-hover:text-indigo-600 transition-colors">
            <Link to={`/deal/${deal.id}`} className="line-clamp-2">
                {deal.title}
            </Link>
        </h3>
        <div className="mt-auto">
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-bold text-slate-900">₹{deal.discountedPrice.toLocaleString()}</p>
            <p className="text-sm text-slate-500 line-through">₹{deal.originalPrice.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealCard;
