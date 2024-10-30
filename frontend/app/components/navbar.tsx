"use client";

import Link from "next/link";
import * as React from "react";

export default function Navbar() {
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
        {/* Burger Menu Button for small screens */}
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          onClick={() => setShow(!show)}
          className={`order-3 mx-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-700 p-2 text-sm text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:order-none md:hidden`}
          aria-controls="navbar-default"
          aria-expanded={show}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Centered Navigation Links */}
        <div
          className={`${show ? "block order-last " : "hidden"} w-full md:block sm:order-last lg:order-none md:w-auto`}
          id="navbar-default"
        >
          <ul className="my-2 flex flex-col items-center space-y-4 font-medium md:flex-row md:space-x-8 md:space-y-0 md:border-0 rtl:space-x-reverse">
            {navigationLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="whitespace-nowrap rounded-md p-3 py-2 font-bold capitalize text-white hover:bg-yellow-800"
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
