"use client";

import { useState } from "react"; // Import useState from React
// import './styles.css'; // Import global styles here
import Navbar from "@/app/mana_gov/components/navbar"; // Import the Navbar component
import "./globals.css";

export default function ManaGovLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main>
        {children}
      </main>
    </>
  );
}
