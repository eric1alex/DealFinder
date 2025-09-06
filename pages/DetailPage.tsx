
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDeals } from '../hooks/useDeals';
import { Source } from '../types';
import { AmazonLogo, FlipkartLogo, ChevronLeftIcon } from '../components/Icons';

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { findDealById, filteredDeals } = useDeals();

  if (!id) {
    return <div className="text-center text-red-500">Deal ID is missing.</div>;
  }
  
  const deal = findDealById(id);

  if (!deal) {
    return <div className="text-center text-red-500">Deal not found.</div>;
  }

  const relatedDeals = filteredDeals.filter(d => d.category === deal.category && d.id !== deal.id).slice(0, 5);

  const SourceLogo = deal.source === Source.Amazon ? AmazonLogo : FlipkartLogo;
  const ctaButtonClasses = deal.source === Source.Amazon 
    ? 'bg-amazon hover:bg-orange-500' 
    : 'bg-flipkart hover:bg-blue-700';

  return (
    <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:underline mb-6">
            <ChevronLeftIcon className="w-5 h-5" />
            Back to Deals
        </Link>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-64 w-full object-cover md:w-64" src={deal.image} alt={deal.title} />
          </div>
          <div className="p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center">
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{deal.category}</div>
                <SourceLogo className="w-8 h-8" />
              </div>
              <h1 className="block mt-1 text-2xl leading-tight font-bold text-black">{deal.title}</h1>
              <div className="mt-4 flex items-baseline space-x-3">
                <p className="text-3xl font-bold text-slate-900">₹{deal.discountedPrice.toLocaleString()}</p>
                <p className="text-lg text-slate-500 line-through">₹{deal.originalPrice.toLocaleString()}</p>
                <p className="text-lg font-semibold text-green-600">{deal.discountPercentage}% off</p>
              </div>
            </div>
            <div className="mt-6">
              <a 
                href={deal.affiliateLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`w-full text-center block text-white font-bold py-3 px-6 rounded-lg transition-colors ${ctaButtonClasses}`}
              >
                Buy on {deal.source}
              </a>
              <p className="text-xs text-slate-400 mt-2 text-center">Posted {deal.postedAt.toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {relatedDeals.length > 0 && (
        <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Related Deals</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {relatedDeals.map(relatedDeal => (
                <Link to={`/deal/${relatedDeal.id}`} key={relatedDeal.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow p-2 text-center">
                    <img src={relatedDeal.image} alt={relatedDeal.title} className="w-full h-24 object-cover rounded-md mb-2" />
                    <p className="text-sm font-semibold text-slate-700 line-clamp-2">{relatedDeal.title}</p>
                    <p className="text-md font-bold text-slate-900">₹{relatedDeal.discountedPrice.toLocaleString()}</p>
                </Link>
            ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default DetailPage;
