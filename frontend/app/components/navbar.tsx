"use client";

import Link from "next/link";
import * as React from "react";
import { usePathname } from 'next/navigation'; // Import usePathname

export default function Navbar() {
  const pathname = usePathname(); // Get the current pathname
  const [show, setShow] = React.useState(false);

  const navigationLinks = [
    {
      label: "MANA Governance",
      href: "/mana_gov",
    },
    {
      label: "VicTory Exchange",
      href: "/victory",
    },
  ];

  return (
    <nav className="border-gray-200 bg-[#ce711e]">
      <div className="mx-auto flex w-full flex-wrap items-center justify-center space-y-4 p-4 px-3 md:px-12">


        {/* Centered Navigation Links */}
        <div
          className={`block w-full sm:order-last md:block md:w-auto lg:order-none`}
          id="navbar-default"
        >
          <ul className="my-2 flex flex-col items-center space-y-4 font-medium md:flex-row md:space-x-8 md:space-y-0 md:border-0 rtl:space-x-reverse">
            {navigationLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`whitespace-nowrap rounded-md p-3 py-2 font-bold capitalize text-white hover:bg-yellow-800 
                    ${pathname.startsWith(link.href) ? 'bg-yellow-800' : ''}`} // Conditional highlight
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
