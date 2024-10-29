"use client";

import Navbar from "@/app/victory/components/navbar";
import Link from "next/link";
import { FaProjectDiagram, FaBook, FaHistory } from "react-icons/fa";
import { FiBook, FiBookOpen } from "react-icons/fi";

const hardcodedLinks = [
  { name: "Project Overview", path: "/victory/project-overview", icon: <FaProjectDiagram /> },
  { name: "Norse Allegories", path: "/victory/norse-allegories", icon: <FaBook /> },
  { name: "Token Runes", path: "/victory/token-runes", icon: <FiBook /> },
  { name: "Proof of Utility", path: "/victory/proof-of-utility", icon: <FiBookOpen /> },
  { name: "1551 Renaissance", path: "/victory/1551-renaissance", icon: <FaHistory /> },
];

export default function VictoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content Layout with Sidebar */}
      <div className="flex flex-grow">
        {/* Sidebar */}
        <aside className="w-1/4 bg-gradient-to-b from-[#2A092A] to-[#8A4F8A] p-6 text-white shadow-lg border-r border-[#441D3A]">
          <nav>
            <h3 className="text-3xl font-bold mb-7 tracking-wide border-b border-[#441D3A] pb-4">Victory Navigation</h3>
            <ul className="space-y-4">
              {hardcodedLinks.map((link, index) => (
                <li
                  key={index}
                  className="p-3 rounded-lg hover:bg-[#C9A6C9] hover:text-[#441D3A] transition-colors duration-300 flex items-center space-x-4"
                >
                  <div className="text-xl">{link.icon}</div>
                  <Link href={link.path} passHref>
                    <span className="text-lg font-medium hover:underline">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow bg-gradient-to-b from-[#2A092A] to-[#3F003F] p-12 text-white overflow-auto">
          <div className="max-w-4xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
