import React, { useState } from 'react';

const EnsLoginButton = ({ isWalletConnected, connectENS, walletIcon }) => {
  const [isInputVisible, setIsInputVisible] = useState(false); 
  const [ensInput, setEnsInput] = useState(''); 

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && ensInput.trim()) {
      connectENS(ensInput); 
    }
  };

  return (
    <div>
      {!isInputVisible ? (
        
        <button
          onClick={() => setIsInputVisible(true)} 
          className="bg-[#15d3e1]  text-white px-5 py-2.5 rounded-[30px] font-bold flex items-center"
        >
          <img src={walletIcon} alt="Wallet Icon" className="w-4 h-4 mr-2" />
          {'Login With ENS'}
        </button>
      ) : (
       
        <input
          type="text"
          value={ensInput}
          onChange={(e) => setEnsInput(e.target.value)}
          onKeyDown={handleKeyPress} 
          placeholder="Enter your ENS name"
          className="px-5 py-2.5 rounded font-bold bg-white text-black border border-gray-400"
          autoFocus
        />
      )}
    </div>
  );
};

export default EnsLoginButton;
