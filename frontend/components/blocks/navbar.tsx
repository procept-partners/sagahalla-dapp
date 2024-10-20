"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogIn, Menu } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { Button } from "../ui/button";

export default function Navbar() {
  const [show, setShow] = React.useState(false);
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
    <nav className="border-gray-200 bg-[#ce711e]">
      <div className="mx-auto flex w-full flex-wrap items-center justify-between space-y-4 p-4 px-3 md:px-12">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="https://www.sagahalla.io/content/images/2024/09/sagahalla_airbrushed.png"
            className="h-12"
            alt="SagaHalla Logo"
          />
          <span className="self-center whitespace-nowrap text-3xl font-semibold text-white">
            SagaHalla
          </span>
        </a>
        {/* Connect Wallet Buttons & Menu Button */}
        <div className="order-2 flex flex-row space-x-2 md:order-none">
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            onClick={() => setShow(!show)}
            className={`order-3 mx-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-700 p-2 text-sm text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:order-none md:hidden`}
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <Menu />
          </button>

          {/* TODO: Add API calls here */}
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-md bg-yellow-700 px-3 py-2 font-bold capitalize text-white hover:bg-yellow-800">
              Wallets
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit rounded-md bg-yellow-500 shadow-lg focus:outline-none">
              <DropdownMenuLabel>Connect to a wallet</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuItem>
                {" "}
                <Button className="bg-yellow-700 px-3 py-2 font-bold uppercase text-white hover:bg-yellow-800">
                  Near
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                {" "}
                <Button className="bg-yellow-700 px-3 py-2 font-bold capitalize text-white hover:bg-yellow-800">
                  Connect EVM
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* TODO: Add API call to login user */}

          <Button className="bg-yellow-700 px-3 py-2 font-bold capitalize text-white hover:bg-yellow-800">
            Login
            <LogIn className="ml-2 h-5 w-5" />
          </Button>
        </div>
        <div
          className={`${show ? "block order-last md:order-none" : "hidden"}  w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="mt-4 flex flex-col flex-wrap items-center space-y-4 border p-4 font-medium md:mt-0 md:flex-row md:space-x-6 md:space-y-0 md:border-0 md:p-0 rtl:space-x-reverse">
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
