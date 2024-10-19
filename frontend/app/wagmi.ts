import { configureChains, createClient } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

// Configure chains and providers
const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, polygon],
  [publicProvider()]
);

// Create the wagmi client
export const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

export { chains };  // Export chains to be used in RainbowKitProvider
