"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { sepolia, mainnet } from "viem/chains";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      // include clientId only if you use App Clients in Privy
      clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID}
      config={{
        // real wallets only, no embedded wallet creation
        loginMethods: ["wallet"],
        embeddedWallets: {
          ethereum: { createOnLogin: "off" }, // new API
        },
        // chains
        defaultChain: sepolia,
        supportedChains: [sepolia, mainnet], // MUST include defaultChain
        externalWallets: {
          walletConnect: {
            enabled: true,
          },
          coinbaseWallet: { config: { appName: "Pantry Points" } },
        },
        appearance: {
          theme: "dark",
          accentColor: "#FFB800",
          showWalletLoginFirst: true,
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
