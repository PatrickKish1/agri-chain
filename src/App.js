// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import JobsPage from './pages/ProductsPage';
import GigsPage from './pages/GigsPage';
import CreateGig from './pages/CreateGig';
import BuyNow from './pages/BuyNow';
import Orders from './pages/Orders';
import { WalletProvider } from './context/Context';

function App() {
  return (
    <WalletProvider>
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<JobsPage />} />
            <Route path="/gigs" element={<GigsPage />} />
            <Route path="/creategig" element={<CreateGig />} />
            <Route path="/details/:productId" element={<BuyNow />} />
            <Route path="/orders" element={<Orders />}/>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    </WalletProvider>
  );
}

export default App;
