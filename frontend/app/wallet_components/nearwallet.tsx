"use client";

import { useEffect, useState } from "react";
import { setupWalletSelector, WalletSelector } from "@near-wallet-selector/core";
import { setupModal, WalletSelectorModal } from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
//import { setupNearSnap } from "@near-wallet-selector/near-snap";
//import { setupWalletConnect } from "@near-wallet-selector/wallet-connect";
//import { setupEthereumWallets } from "@near-wallet-selector/ethereum-wallets";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import "@near-wallet-selector/modal-ui/styles.css";

const WalletSelectorComponent = () => {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<WalletSelectorModal | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    const initializeSelector = async () => {
      const selector = await setupWalletSelector({
        network: "testnet",
        modules: [
          setupMyNearWallet(),
          setupHereWallet(),
          setupMeteorWallet(),
          //setupNearSnap(),
          //setupWalletConnect({
            //projectId: "c4f79cc...",
            //metadata: {
              //name: "NEAR Wallet Selector",
              //description: "Example dApp used by NEAR Wallet Selector",
              //url: "https://github.com/near/wallet-selector",
              //icons: ["https://avatars.githubusercontent.com/u/37784886"],
            //},
          //}),
          //setupEthereumWallets({ wagmiConfig, web3Modal }),
        ],
      });

      const modal = setupModal(selector, {
        contractId: "guest-book.testnet",
      });

      setSelector(selector);
      setModal(modal);

      const state = await selector.store.getState();
      if (state.accounts.length > 0) {
        setWalletAddress(state.accounts[0].accountId);
      }
    };

    initializeSelector();
  }, []);

  const handleConnectWallet = () => {
    if (modal) {
      modal.show(); 
    }
  };

  const handleSignOut = async () => {
    if (selector) {
      const wallet = await selector.wallet();
      await wallet.signOut();
      setWalletAddress(null);
    }
  };

  return (
    <div>
      <div className="wallet" onClick={walletAddress ? handleSignOut : handleConnectWallet}>
        {walletAddress ? `Connected to: ${walletAddress}` : "NEAR"}
      </div>
    </div>
  );
};

export default WalletSelectorComponent;