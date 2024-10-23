"use client";

import { useState } from 'react';
import Link from 'next/link';
// import './styles.css'; // Import global styles here

export default function VictoryLayout({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false); // Manage login state

  const handleLogin = () => {
    setLoggedIn(!loggedIn); // Toggle login state
  };

  return (
    <div className="flex min-h-screen flex-col"> {/* Flex container with full height */}

      {/* Navigation Links */}
      <nav className="flex justify-center bg-[#ce711e] p-4">
        <Link href="/victory/fyre" className="px-4 text-white">FYRE</Link>
        <Link href="/victory/shld" className="px-4 text-white">SHLD</Link>
        <Link href="/victory/mana" className="px-4 text-white">MANA</Link>
      </nav>

      {/* Main Content */}
      <main className="flex-grow bg-[#270927] p-8 text-white">
        {children}
      </main>
    </div>
  );
}

