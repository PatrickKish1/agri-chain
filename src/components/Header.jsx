import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import Notification from "./Notification";

const Header = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeLink, setActiveLink] = useState("/app"); // Ensure the default matches your home path
  const dropdownRef = useRef(null);
  const location = useLocation(); // Get the current route

  // Function to handle wallet connection
  const handleWalletConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
      } catch (error) {
        setNotification("Error connecting wallet. Please try again.");
        console.error("Error connecting wallet:", error);
      }
    } else {
      setNotification(
        "MetaMask is not installed. Please install it to use this feature."
      );
    }
  };

  // Function to handle wallet disconnection
  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setWalletAddress("");
    setIsDropdownOpen(false);
  };

  // Close the notification
  const handleCloseNotification = () => {
    setNotification(null);
  };

  // Ensure wallet state persistence and handle account changes
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsWalletConnected(true);
        } else {
          setIsWalletConnected(false);
          setWalletAddress("");
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      };
    }
  }, []);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Sync active link with the current route
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  return (
    <header className="flex items-center justify-between p-5 bg-white border-b border-gray-200">
      <div className="flex items-center">
        <Link to="/app">
          <img
            src="/assets/equibloc-logo.png"
            alt="EquiBloc Logo"
            style={{ height: 40, width: 160 }}
          />
        </Link>
      </div>
      <nav>
        <ul className="flex list-none">
          <li className="mx-5">
            <Link
              to="/app"
              className={`text-gray-800 font-medium ${
                activeLink === "/app" ? "text-[#ff0909]" : ""
              }`}
              onClick={() => setActiveLink("/app")}
            >
              Home
            </Link>
          </li>
          <li className="mx-5">
            <Link
              to="/jobs"
              className={`text-gray-800 font-medium ${
                activeLink === "/jobs" ? "text-[#ff0909]" : ""
              }`}
              onClick={(e) => {
                if (!isWalletConnected) {
                  e.preventDefault();
                } else {
                  setActiveLink("/jobs");
                }
              }}
            >
              Jobs
            </Link>
          </li>
          <li className="mx-5">
            <Link
              to="/about"
              className={`text-gray-800 font-medium ${
                activeLink === "/about" ? "text-[#ff0909]" : ""
              }`}
              onClick={(e) => {
                if (!isWalletConnected) {
                  e.preventDefault();
                } else {
                  setActiveLink("/about");
                }
              }}
            >
              About
            </Link>
          </li>
        </ul>
      </nav>
      <div className="flex items-center">
        {isWalletConnected ? (
          <>
            <button className="bg-white text-[#ff0909] px-5 py-2 rounded font-bold">
              <img
                src="/assets/notification.svg"
                alt="Notification Icon"
                height={20}
                width={20}
              />
            </button>
            <Link to="/hire">
              <button className="bg-white text-[#ff0909] border-2 border-[#ff0909] ml-2 px-5 py-2 rounded font-bold">
                Hire
              </button>
            </Link>
            <button className="bg-white text-[#ff0909] border-2 border-[#ff0909] ml-2 px-5 py-2 rounded font-bold">
              Apply
            </button>
          </>
        ) : null}
        <div className="relative">
          <button
            onClick={
              isWalletConnected
                ? () => setIsDropdownOpen(!isDropdownOpen)
                : handleWalletConnection
            }
            className="bg-[#ff0909] text-white px-5 py-2.5 rounded font-bold flex items-center ml-3"
          >
            <img
              src="/assets/wallet.svg"
              alt="Wallet Icon"
              height={16}
              width={16}
            />
            <span className="ml-2">
              {isWalletConnected
                ? walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4)
                : "Login With ENS"}
            </span>
           
          </button>
          <button
            onClick={
              isWalletConnected
                ? () => setIsDropdownOpen(!isDropdownOpen)
                : handleWalletConnection
            }
            className="bg-[#ff0909] text-white px-5 py-2.5 rounded font-bold flex items-center ml-3"
          >
            <img
              src="/assets/wallet.svg"
              alt="Wallet Icon"
              height={16}
              width={16}
            />
            <span className="ml-2">
              {isWalletConnected
                ? walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4)
                : "Login With ENS"}
            </span>
           
          </button>
          {isDropdownOpen && isWalletConnected && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-50"
            >
              <button
                onClick={disconnectWallet}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      </div>
      {notification && (
        <Notification
          message={notification}
          show={!!notification}
          onClose={handleCloseNotification}
        />
      )}
    </header>
  );
};

export default Header;
