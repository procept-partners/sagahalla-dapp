"use client";

import { useState } from "react"; // Import useState from React
// import './styles.css'; // Import global styles here
import "./globals.css";

export default function ManaGovLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loggedIn, setLoggedIn] = useState(false); // Now useState is defined

  const handleLogin = () => {
    setLoggedIn(!loggedIn); // Toggle login state
  };

  const navigationLinks = [
    {
      label: "Proposal Management",
      href: "/proposal-management",
    },
    {
      label: "Project Planning",
      href: "/project-planning",
    },
    {
      label: "Task Tracking",
      href: "/task-tracking",
    },
    {
      label: "Voting",
      href: "/voting",
    },
    {
      label: "Reports",
      href: "/reports",
    },
  ];

  return (
    <>
      {/* Flex container with full height */}
      {/* No need for Navbar here, since we have a Navbar in the layout */}
      {/* Main Content */}
      <main>
        {children}
      </main>
    </>
  );
}
