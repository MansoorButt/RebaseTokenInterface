"use client";

import type React from "react";

import { WagmiProvider, createConfig } from "wagmi";
import { sepolia, arbitrumSepolia } from "wagmi/chains";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

const config = createConfig(
  getDefaultConfig({
    appName: "Rebase Token App",
    walletConnectProjectId: "9db2098022f162c4f0e6cad18c5981c9",
    chains: [sepolia, arbitrumSepolia],
  })
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <ConnectKitProvider theme="auto" mode="dark">
          {children}
        </ConnectKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
