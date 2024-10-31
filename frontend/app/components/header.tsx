import { useConnectModal } from '@rainbow-me/rainbowkit'; // Import the connect modal
import Wallet from '../wallet_components/nearwallet';
import Link from 'next/link';
import Navbar from "@/app/components/navbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Auth } from "@/components/blocks/auth";

export default function Header({ appName = "SagaHalla" }: { appName?: string }) {

  const { openConnectModal } = useConnectModal(); // Get the modal handler

  return (
    <div className="header flex items-center justify-between bg-[#ce711e] text-white"> {/* Removed padding to minimize overall header space */}
      {/* App Logo and Site Name */}
      <div className="logo flex items-center space-x-2 p-2"> {/* Added padding only to the logo section */}
        <Link href="/">
          <img src="/sagahalla.png" alt="SagaHalla Logo" className="h-10" />
        </Link>
        <span className="text-xl font-bold text-white">{appName}</span> {/* Site name with consistent white text */}
      </div>

      {/* Nav Bar */}
      <Navbar />

      {/* Wallets and Login Section */}
      <div className="flex items-center space-x-2 p-2"> {/* Added padding only to the wallet and login section */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer rounded-md bg-[#a85a18] px-2 py-1 font-bold capitalize text-white hover:bg-[#8f4914]">
              Wallets
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-fit space-y-1 rounded-md bg-popover shadow-lg focus:outline-none">
            <DropdownMenuLabel>Connect to a wallet</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />

            {/* NEAR Wallet */}
            <DropdownMenuItem asChild>
              <div className="cursor-pointer bg-[#a85a18] px-2 py-1 font-bold uppercase text-white hover:bg-[#8f4914]">
                <Wallet /> {/* NEAR wallet connect logic */}
              </div>
            </DropdownMenuItem>

            {/* EVM Wallet Connect */}
            <DropdownMenuItem asChild>
              <div
                onClick={openConnectModal}  // Opens EVM wallet modal
                className="cursor-pointer bg-[#a85a18] px-2 py-1 font-bold capitalize text-white hover:bg-[#8f4914]"
              >
                Connect EVM
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Auth (Login/Logout) */}
        <Auth /> {/* Handles authentication logic */}
      </div>
    </div>
  );
}
