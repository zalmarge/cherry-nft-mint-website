"use client";

import { Umi } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import React, { createContext, useContext, useMemo } from "react";
// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";

interface UmiContextState {
  umi: Umi | undefined;
}

export const UmiContext = createContext<UmiContextState>({
  umi: undefined,
});

interface UmiContextProviderProps {
  children: React.ReactNode;
}

export const UmiContextProvider: React.FC<UmiContextProviderProps> = ({
  children,
}) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;
  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);


  const umi = useMemo(() => {
    return createUmi(endpoint);
  }, [endpoint]);

  const values = useMemo(
    () => ({
      umi,
    }),
    [umi]
  );
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <UmiContext.Provider value={values}>{children}</UmiContext.Provider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const useUmi = () => {
  return useContext(UmiContext);
};
