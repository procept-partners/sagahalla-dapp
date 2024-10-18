"use client";

import { useState } from 'react'; // Import useState from React
import Link from 'next/link';
import './styles.css'; // Import global styles here

export default function ManaGovLayout({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false); // Now useState is defined

  const handleLogin = () => {
    setLoggedIn(!loggedIn); // Toggle login state
  };

  return (
    <div className="flex flex-col min-h-screen"> {/* Flex container with full height */}
      {/* Header Section */}
      <div className="header flex justify-between items-center p-4 bg-orange-500">
        {/* App Logo */}
        <div className="logo">
          <Link href="/mana_gov">
            <img src="/sagahalla.png" alt="SagaHalla Logo" className="app-logo" />
          </Link>
        </div>

        {/* MANA Governance Title */}
        <div className="title flex-grow text-center">
          <h1 className="text-white text-xl font-bold">MANA</h1>
          <h2 className="text-white text-lg font-semibold">Governance</h2>
        </div>

        {/* User Profile */}
        <div className="user-profile">
          <button className="profile-btn flex items-center space-x-2" onClick={handleLogin}>
            <img src="/tiwaz.png" alt="Profile Icon" className="profile-icon w-8 h-8 rounded-full" />
            <span className="text-white">{loggedIn ? "Logout" : "Login"}</span>
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="navigation">
        <Link href="/proposal-management" className="text-white px-4">Proposal Management</Link>
        <Link href="/project-planning" className="text-white px-4">Project Planning</Link>
        <Link href="/task-tracking" className="text-white px-4">Task Tracking</Link>
        <Link href="/voting" className="text-white px-4">Voting</Link>
        <Link href="/reports" className="text-white px-4">Reports</Link>
      </nav>

      {/* Main Content */}
      <main className="flex-grow"> {/* Flex-grow to push footer down */}
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-orange-500 text-white text-center py-4 mt-8">
        <p>&copy; 2024 SagaHalla. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
