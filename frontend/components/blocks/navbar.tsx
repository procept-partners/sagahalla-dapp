'use client'

import * as React from "react";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";



export default function Navbar() {
    const [show, setShow] = React.useState(false);
    return (
        <nav className="border-gray-200 bg-[#ce711e]">
            <div className="mx-auto flex w-full flex-wrap items-center justify-between p-4 px-12">
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
                <button
                    data-collapse-toggle="navbar-default"
                    type="button"
                    onClick={() => setShow(!show)}
                    className={`${show ? '' : 'order-2'} inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:order-none md:hidden`}
                    aria-controls="navbar-default"
                    aria-expanded="false"
                >
                    <span className="sr-only">Open main menu</span>
                    <Menu />
                </button>
                <div className={`${show ? 'block' : 'hidden'}  w-full md:block md:w-auto`} id="navbar-default">
                    <ul className="mt-4 flex flex-col space-y-4 rounded-lg border p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:space-y-0 md:border-0 md:p-0 rtl:space-x-reverse">
                        <li>
                            <Button className="bg-yellow-700 px-3 py-2 font-bold capitalize text-white hover:bg-yellow-800">
                                NEAR
                            </Button>
                        </li>
                        <li>
                            <Button className="bg-yellow-700 px-3 py-2 font-bold capitalize text-white hover:bg-yellow-800">
                                Connect EVM
                            </Button>
                        </li>

                        <li>
                            <Button className="bg-yellow-700 px-3 py-2 font-bold capitalize text-white hover:bg-yellow-800">
                                Login
                            </Button>
                        </li>

                    </ul>

                </div>
            </div>
        </nav>
    );
}
