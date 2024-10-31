"use client";

import { useState } from 'react';
import Link from 'next/link';
import Wallet from '@/app/wallet_components/nearwallet';  // NEAR wallet import
import { useConnectModal } from '@rainbow-me/rainbowkit';  // EVM wallet modal handler
import { Menu } from "lucide-react";  // Icon if you need a menu button
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header({ appName }: { appName: string }) {
  const [loggedIn, setLoggedIn] = useState(false);  // Manage login state for Near wallet

  const handleLogin = () => {
    setLoggedIn(!loggedIn);  // Toggle Near login state
  };

  const { openConnectModal } = useConnectModal();  // Handler for opening the EVM wallet modal

  return (
    <div className="header flex items-center justify-between bg-orange-500 p-4">
      {/* App Logo */}
      <div className="logo">
        <Link href="/">
          <img src="/sagahalla.png" alt="SagaHalla Logo" className="h-10" />
        </Link>
      </div>


      {/* Wallets Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-md bg-yellow-700 px-3 py-2 font-bold capitalize text-white hover:bg-yellow-800">
          Wallets
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit rounded-md bg-yellow-500 shadow-lg focus:outline-none">
          <DropdownMenuLabel>Connect to a wallet</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-200" />

          {/* NEAR Wallet Button (Remove extra text and display just Wallet component) */}
          <DropdownMenuItem>
            <div className="bg-yellow-700 px-3 py-2 font-bold uppercase text-white hover:bg-yellow-800">
              <Wallet /> {/* NEAR wallet connect logic */}
            </div>
          </DropdownMenuItem>

          {/* EVM Wallet Connect Button */}
          <DropdownMenuItem>
            <button
              onClick={openConnectModal}  // Opens EVM wallet modal
              className="bg-yellow-700 px-3 py-2 font-bold capitalize text-white hover:bg-yellow-800"
            >
              Connect EVM
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Login/Logout Profile Button - div to prevent nested buttons */}
      <div
        className="profile-btn flex cursor-pointer items-center space-x-2 rounded bg-[#ce711e] px-4 py-2 font-bold text-white hover:bg-[#a85a18]"
        onClick={handleLogin}
      >
        <img src="/tiwaz.png" alt="Profile Icon" className="h-8 w-8 rounded-full" />
        <span>{loggedIn ? "Logout" : "Login"}</span>
      </div>
    </div>
  );
}
