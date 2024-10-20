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

    </div>
  );
}

