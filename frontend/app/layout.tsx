"use client";  // Mark this as a Client Component

import { Inter } from "next/font/google";
import Providers from "./wallet_components/evmProviders";
import Header from "./components/header";
import React from "react";
import { WagmiConfig } from "wagmi";
import { config } from './wagmi';  // Keep your wagmi config
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import RainbowKit essentials
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

// Initialize Inter font
const inter = Inter({ subsets: ["latin"] });

// Initialize Query Client for React Query
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        {/* QueryClientProvider for React Query */}
        <QueryClientProvider client={queryClient}>
          {/* WagmiConfig wraps the wagmi components */}
          <WagmiConfig config={config}>
            {/* RainbowKitProvider */}
            <RainbowKitProvider>
              {/* Generalized Header with Wallet Components */}
              <Header appName="SagaHalla" />

              {/* Main Content */}
              <Providers>
                <main className="flex-1 p-4">
                  {children} {/* Render the children (main content) here */}
                </main>
              </Providers>
            </RainbowKitProvider>
          </WagmiConfig>
        </QueryClientProvider>

        {/* Footer */}
        <footer className="bg-orange-500 text-white text-center py-4">
          <p>&copy; 2024 SagaHalla. All Rights Reserved.</p>
        </footer>
      </body>
    </html>
  );
}
