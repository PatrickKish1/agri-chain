// src/pages/GigsPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function GigsPage({ walletAddress }) {
  const [gigs] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All Gigs');
  const navigate = useNavigate(); // For navigation to CreateGig page

  const handleCreateGigClick = () => {
    navigate('/creategig');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <header className="flex justify-between items-center p-6">
          <h1 className="text-2xl font-bold">Produts</h1>
          <button
            onClick={handleCreateGigClick}
            className="bg-[#ff0909] bg-600 text-white mr-[-200px] px-4 py-2 rounded-md"
          >
            Add Product
          </button>
        </header>

        {/* Navigation Filters */}
        <nav className="flex space-x-4 mb-4 border-b-2 border-gray-300">
          {['All Products', 'Favourite', 'Pending'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`py-1 px-3 border-b-2 ${activeFilter === filter ? 'border-[#ff0909] bg-[#b7efe4] bg-600 rounded-md' : 'border-transparent'}`}
            >
              {filter}
            </button>
          ))}
        </nav>

        {/* Display Gigs */}
        <div>
          {gigs.map((gig, index) => (
            <div key={index} className="p-4 border rounded-md mb-4">
              <h2 className="text-xl font-bold">{gig.jobTitle}</h2>
              <p className="text-sm">{gig.companyName}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GigsPage;
