"use client";

import { WagmiConfig } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { client, chains } from "../../wagmi";  // Import chains along with client

const queryClient = new QueryClient();

type Props = {
  children: React.ReactNode;
  cookie?: string | null;
};

const customTheme = darkTheme({
  accentColor: "#0E76FD",
  accentColorForeground: "white",
  borderRadius: "small",
  fontStack: "system",
  overlayBlur: "small",
});

export default function Providers({ children }: Props) {
  return (
    <WagmiConfig client={client}>  {/* Use client */}
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={chains} theme={customTheme}>  {/* Pass chains to RainbowKitProvider */}
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}
