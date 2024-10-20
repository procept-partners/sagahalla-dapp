"use client";

import { useState } from 'react'; 
import Link from 'next/link';
import Wallet from '../wallet_components/nearwallet';
import { useConnectModal } from '@rainbow-me/rainbowkit'; // Import the connect modal
import Profile from '../wallet_components/evmWalletProfile';

export default function Header({ appName }: { appName: string }) {
  const [loggedIn, setLoggedIn] = useState(false); // Manage login state for Near login

  const handleLogin = () => {
    setLoggedIn(!loggedIn); // Toggle Near login state
  };

  const { openConnectModal } = useConnectModal(); // Get the modal handler

  return (
    <div className="header flex justify-between items-center p-4 bg-orange-500">
      {/* App Logo */}
      <div className="logo">
        <Link href="/">
          <img src="/sagahalla.png" alt="SagaHalla Logo" className="app-logo" />
        </Link>
      </div>

      {/* Dynamic App Title */}
      <div className="title flex-grow text-center">
        <h1 className="text-white text-xl font-bold">{appName}</h1>
      </div>

      {/* User Profile / Wallet Connect Area */}
      <div className="user-profile flex items-center space-x-4">
        <div className="bg-[#ce711e] hover:bg-[#a85a18] text-white font-bold py-2 px-4 rounded">
          <Wallet />
        </div>
        <div className="bg-[#ce711e] hover:bg-[#a85a18] text-white font-bold py-2 px-4 rounded">
          <button onClick={openConnectModal}>
            Connect EVM
          </button>
        </div>
        <div className="user-profile">
          <button className="profile-btn flex items-center space-x-2" onClick={handleLogin}>
            <img src="/tiwaz.png" alt="Profile Icon" className="profile-icon w-8 h-8 rounded-full" />
            <span className="text-white">{loggedIn ? "Logout" : "Login"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
