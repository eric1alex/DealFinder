
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import SearchPage from './pages/SearchPage';
import { DealsProvider } from './hooks/useDeals';

const App: React.FC = () => {
  return (
    <DealsProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col font-sans">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/deal/:id" element={<DetailPage />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </DealsProvider>
  );
};

export default App;
