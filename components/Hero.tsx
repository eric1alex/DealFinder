
import React from 'react';

const Hero: React.FC = () => {
  const handleScroll = () => {
    const dealsSection = document.getElementById('deals-section');
    if (dealsSection) {
      dealsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="text-center py-16 sm:py-20 px-4 mb-8">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 tracking-tight">
        Find Your Next <span className="text-indigo-600">Great Deal</span>.
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-500">
        Discover the best discounts from top stores, all in one place. Your ultimate savings companion starts here.
      </p>
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleScroll}
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition-transform transform hover:scale-105 shadow-lg"
        >
          Explore Deals
        </button>
      </div>
    </div>
  );
};

export default Hero;
