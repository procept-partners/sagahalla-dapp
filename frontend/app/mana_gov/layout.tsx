"use client";

import { useState } from 'react'; // Import useState from React
import Link from 'next/link';
// import './styles.css'; // Import global styles here
import './globals.css';

export default function ManaGovLayout({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false); // Now useState is defined

  const handleLogin = () => {
    setLoggedIn(!loggedIn); // Toggle login state
  };

  return (
    <div className="flex min-h-screen flex-col"> {/* Flex container with full height */}

      {/* Navigation Links */}
      <nav className="navigation">
        <Link href="/proposal-management" className="px-4 text-white">Proposal Management</Link>
        <Link href="/project-planning" className="px-4 text-white">Project Planning</Link>
        <Link href="/task-tracking" className="px-4 text-white">Task Tracking</Link>
        <Link href="/voting" className="px-4 text-white">Voting</Link>
        <Link href="/reports" className="px-4 text-white">Reports</Link>
      </nav>




      {/* Main Content */}
      <main className="flex-grow"> {/* Flex-grow to push footer down */}
        {children}
      </main>

      <h3 className='text-center underline'>Some text</h3>

    </div>
  );
}

