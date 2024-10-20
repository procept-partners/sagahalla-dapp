"use client";

import { useState } from 'react'; 
import Link from 'next/link';
import './styles.css'; // Import global styles here

export default function VictoryLayout({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false); // Manage login state

  const handleLogin = () => {
    setLoggedIn(!loggedIn); // Toggle login state
  };

  return (
    <div className="flex flex-col min-h-screen"> {/* Flex container with full height */}

      {/* Navigation Links */}
      <nav className="navigation flex justify-center bg-[#ce711e] p-4">
        <Link href="/victory/fyre" className="text-white px-4">FYRE</Link>
        <Link href="/victory/shld" className="text-white px-4">SHLD</Link>
        <Link href="/victory/mana" className="text-white px-4">MANA</Link>
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-8 bg-[#270927] text-white">
        {children}
      </main>
    </div>
  );
}

