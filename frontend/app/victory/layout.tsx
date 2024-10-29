"use client";

import Navbar from "@/app/victory/components/navbar";
import Link from "next/link";

const hardcodedLinks = [
  { name: "Project Overview", path: "/victory/project-overview" },
  { name: "Norse Allegories", path: "/victory/norse-allegories" },
  { name: "Token Runes", path: "/victory/token-runes" },
  { name: "Proof of Utility", path: "/victory/proof-of-utility" },
  { name: "1551 Renaissance", path: "/victory/1551-renaissance" },
];

export default function VictoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content Layout with Sidebar */}
      <div className="flex flex-grow">
        {/* Sidebar */}
        <aside className="w-1/4 bg-[#1a1a1a] p-4 text-white">
          <nav>
            <ul>
              {hardcodedLinks.map((link, index) => (
                <li key={index} className="mb-2">
                  <Link href={link.path} className="text-white hover:underline">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow bg-[#270927] p-8 text-white">
          {children}
        </main>
      </div>
    </div>
  );
}
