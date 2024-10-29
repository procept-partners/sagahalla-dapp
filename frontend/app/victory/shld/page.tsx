"use client";

import React, { useState, useEffect, useCallback } from "react";
import { mintNFT, initNear, nearConfig } from "./shldContractInteractions";

const TokenBody = () => {
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [nftDescription, setNftDescription] = useState("");
  const [title, setTitle] = useState<string>("");
  const [governanceRole, setGovernanceRole] = useState("");

  const fetchPurchaseHistory = useCallback(async () => {
    try {
      setLoading(true);
      const { walletConnection } = await initNear();

      if (!walletConnection.isSignedIn()) {
        throw new Error("You need to be logged in to view purchase history.");
      }

      const accountId = walletConnection.getAccountId();
      // Fetch purchase history logic

      console.log("Purchase history for account:", accountId);
    } catch (error) {
      console.error("Error fetching purchase history:", error);
      setError("Failed to fetch purchase history. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePurchaseTokens = async () => {
    try {
      setLoading(true);

      const metadata = {
        title,
        description: nftDescription,
        governance_role: governanceRole,
      };

      const { walletConnection } = await initNear();
      const accountId = walletConnection.getAccountId();
      if (!walletConnection.isSignedIn()) {
        walletConnection.requestSignIn({
          contractId: nearConfig.contractName,
          methodNames: ['mint'],
          successUrl: window.location.href,
          failureUrl: window.location.href,
        });
        return;
      }

      await mintNFT(accountId, purchaseAmount, metadata);

      console.log("NFT minted successfully!");
      fetchPurchaseHistory();
    } catch (error) {
      console.error("Error minting SHLD NFT:", error);
      setError("There was an issue with the transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#270927] min-h-screen text-white p-8">
      {/* SHLD Token Main Content */}
      <main className="flex justify-center mt-10">
        <div className="bg-[#3a0f3a] p-5 rounded-lg shadow-md w-full max-w-md">
          <h3 className="text-[#ce711e] text-3xl font-bold mb-4 text-center">Purchase SHLD NFTs</h3>
          <label className="mb-4 block text-center">Starting Price: {'{SHLD_STARTING_PRICE}'} BTC per NFT</label>

          <div className="mb-4">
            <input
              type="number"
              id="price"
              className="w-full p-2 rounded text-black"
              placeholder="Input SHLD Amount"
              value={purchaseAmount}
              onChange={(e) => setPurchaseAmount(e.target.value)}
            />
          </div>
          <button
            onClick={handlePurchaseTokens}
            disabled={loading}
            className={`bg-[#ce711e] hover:bg-[#a85a18] text-white font-bold py-2 px-4 rounded w-full mt-4 ${loading ? 'cursor-not-allowed' : ''}`}
          >
            {loading ? "Purchasing..." : "PURCHASE SHLD"}
          </button>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </main>

      {/* SHLD NFT Creation Section */}
      <main>
        <h3 className="text-[#ce711e] text-3xl font-bold mb-4">SHLD NFT Collections</h3>
        <label className="mb-4">Create your custom SHLD NFT:</label>

        <div className="mb-4">
          <label>Title:</label>
          <input
            type="text"
            id="nfttitle"
            className="w-full p-2 rounded text-black"
            placeholder="Enter NFT Title (Optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label>Description:</label>
          <input
            type="text"
            id="nftdescription"
            className="w-full p-2 rounded text-black"
            placeholder="Describe your NFT"
            value={nftDescription}
            onChange={(e) => setNftDescription(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label>Governance Role:</label>
          <select
            className="w-full p-2 rounded text-black"
            value={governanceRole}
            onChange={(e) => setGovernanceRole(e.target.value)}
          >
            <option value="">Choose Governance Role</option>
            <option value="creator">Creator</option>
            <option value="patron">Patron</option>
            <option value="content">Content</option>
            <option value="community-supporter">Community Supporter</option>
          </select>
        </div>

        <button
          onClick={handlePurchaseTokens}
          className="bg-[#ce711e] hover:bg-[#a85a18] text-white font-bold py-2 px-4 rounded"
        >
          CREATE SHLD NFT
        </button>
      </main>

      {/* Utility & Use Case Section */}
      <main>
        <h3 className="text-[#ce711e] text-3xl font-bold mb-4 mt-5">Utility & Use Case</h3>
        <p>SHLD NFTs serve as **Sovereign IDs** and **authentication tokens** in the SagaHalla ecosystem. They also provide links to **MANA rights** with **Sovereign ID** for governance within the cooperative.</p>
        <p>SHLD NFTs come with an **immutable badge**. The image can only be transferred upon burning the token, while maintaining **MANA and authentication rights**.</p>
      </main>
    </div>
  );
};

export default TokenBody;
