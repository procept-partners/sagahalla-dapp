'use client'

import * as React from "react";
import { Menu } from "lucide-react";



export default function Navbar() {
    const [show, setShow] = React.useState(false);
    return (
        <nav className="border-gray-200 bg-white dark:bg-gray-900">
            <div className="mx-auto flex w-full flex-wrap items-center justify-between p-4 px-12">
                <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img
                        src="https://www.sagahalla.io/content/images/2024/09/sagahalla_airbrushed.png"
                        className="h-8"
                        alt="SagaHalla Logo"
                    />
                    <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                        SagaHalla
                    </span>
                </a>
                <button
                    data-collapse-toggle="navbar-default"
                    type="button"
                    onClick={() => setShow(!show)}
                    className={`${show ? '' : 'order-2'} inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:order-none md:hidden`}
                    aria-controls="navbar-default"
                    aria-expanded="false"
                >
                    <span className="sr-only">Open main menu</span>
                    <Menu />
                </button>
                <div className={`${show ? 'block' : 'hidden'} w-full md:block md:w-auto`} id="navbar-default">
                    <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium dark:border-gray-700 dark:bg-gray-800 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 md:dark:bg-gray-900 rtl:space-x-reverse">
                        {['Home', 'About', 'Services', 'Pricing', 'Contact'].map(
                            (item, index) => (
                                <li key={index}>
                                    <a
                                        href={`/${item.toLowerCase()}`} // Assuming you want lowercase URLs
                                        className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-yellow-700 md:dark:hover:bg-transparent md:dark:hover:text-yellow-500"
                                    >
                                        {item}
                                    </a>
                                </li>
                            )
                        )}
                    </ul>
                </div>
                <div></div>
            </div>
        </nav>
    );
}
