"use client";

import { useState } from "react"; // Import useState from React
// import './styles.css'; // Import global styles here
import "./globals.css";

export default function ManaGovLayout({
  children,
}: {
  children: React.ReactNode;
}) {

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
