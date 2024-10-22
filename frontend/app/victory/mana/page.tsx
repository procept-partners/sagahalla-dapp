"use client";

import React, { useState, useEffect, useCallback } from "react";
import { connect, keyStores, WalletConnection } from "near-api-js";

interface StakingHistory {
  staker: string;
  stakedAmount: string;
  stakingDuration: string;
  status: string; 
  manaToReceive: string;
}

const TokenBody: React.FC = () => {
  const [purchaseAmount, setPurchaseAmount] = useState<string>("");
  const [stakingHistory, setStakingHistory] = useState<StakingHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [circulatingSupply, setCirculatingSupply] = useState<string>("");
  const [maximumSupply, setMaximumSupply] = useState<string>("");

  const initNearConnection = async () => {
    const nearConfig = {
      networkId: "default",
      keyStore: new keyStores.BrowserLocalStorageKeyStore(),
      nodeUrl: "https://rpc.mainnet.near.org",
      walletUrl: "https://wallet.near.org",
      helperUrl: "https://helper.mainnet.near.org",
      explorerUrl: "https://explorer.near.org",
    };
  
    const near = await connect(nearConfig);
    const wallet = new WalletConnection(near, "");
    return wallet;
  };

  const fetchStakingHistory = async () => {
    try {
      setLoading(true);
      // Fetch staking history logic
    } catch (error) {
      console.error("Error fetching staking history:", error);
      setError("Unable to fetch staking history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReturnToken = async () => {
    try {
      setLoading(true);
      const wallet = await initNearConnection();
      if (!wallet.isSignedIn()) {
        setError("Please connect your NEAR wallet.");
        return;
      }
      const accountId = wallet.getAccountId();
      console.log(`Connected NEAR account: ${accountId}`);
      // Logic for retrieving FYRE tokens
    } catch (error) {
      console.error("Error retrieving tokens and staking information:", error);
      setError("There was an issue retrieving the staking information. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSwapTokens = async () => {
    try {
      setLoading(true);
      const wallet = await initNearConnection();
      if (!wallet.isSignedIn()) {
        setError("Please connect your NEAR wallet.");
        return;
      }
      const accountId = wallet.getAccountId();
      console.log(`Connected NEAR account: ${accountId}`);
      // Logic for swapping FYRE to MANA
    } catch (error) {
      console.error("Error staking tokens:", error);
      setError("There was an issue with the staking transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };  

  useEffect(() => {
    fetchStakingHistory();
  }, []);

  return (
    <div className="bg-[#270927] min-h-screen text-white p-8">
      {/* MANA Token Section */}
      <main className="flex justify-center mt-10">
        <div className="bg-[#3a0f3a] p-5 rounded-lg shadow-md w-full max-w-md">
          <h3 className="text-[#ce711e] text-3xl font-bold mb-4 text-center">Contribute MANA Tokens</h3>
          <label className="mb-2 block text-center">Offering Price: FYRE per MANA</label>
          <input
            type="number"
            id="price"
            className="w-full p-2 rounded text-black"
            placeholder="Input MANA Amount"
            value={purchaseAmount}
            onChange={(e) => setPurchaseAmount(e.target.value)}
          />
          <button
            onClick={handleSwapTokens}
            disabled={loading}
            className={`bg-[#ce711e] hover:bg-[#a85a18] text-white font-bold py-2 px-4 rounded w-full mt-4 ${loading ? 'cursor-not-allowed' : ''}`}
          >
            {loading ? "Contributing..." : "FYRE TO MANA CONTRIBUTION"}
          </button>
          <button
            onClick={handleReturnToken}
            disabled={loading}
            className={`bg-[#ce711e] hover:bg-[#a85a18] text-white font-bold py-2 px-4 rounded w-full mt-4 ${loading ? 'cursor-not-allowed' : ''}`}
          >
            {loading ? "Retrieving..." : "GET FYRE"}
          </button>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </main>
      
      {/* Staking History Section */}
      <main>
        <div className="mt-10">
          <h3 className="text-[#ce711e] text-3xl font-bold mb-4">Staking History</h3>
          {loading ? (
            <p>Loading staking history...</p>
          ) : stakingHistory.length > 0 ? (
            <div className="bg-[#270927] p-4 rounded-lg shadow-md">
              <table className="w-full text-left text-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Staker</th>
                    <th className="px-4 py-2">Staked FYRE</th>
                    <th className="px-4 py-2">Duration (hours)</th>
                    <th className="px-4 py-2">MANA to Receive</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stakingHistory.map((staking, index) => (
                    <tr key={index} className="bg-[#3a0f3a]">
                      <td className="border px-4 py-2">{staking.staker}</td>
                      <td className="border px-4 py-2">{staking.stakedAmount}</td>
                      <td className="border px-4 py-2">{staking.stakingDuration}</td>
                      <td className="border px-4 py-2">{staking.manaToReceive}</td>
                      <td className="border px-4 py-2">{staking.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No staking history available.</p>
          )}
        </div>
      </main>

      {/* Minting Stats Section */}
      <main>
        <h3 className="text-[#ce711e] text-3xl font-bold mb-4">MANA Token Minting Stats</h3>
        <div className="bg-[#ce711e] rounded overflow-hidden">
          <div className="grid grid-cols-2">
            <div className="p-3 text-white font-semibold">CIRCULATING SUPPLY</div>
            <div className="p-3 bg-[#270927] text-white">{circulatingSupply} MANA</div>
            <div className="p-3 text-white font-semibold">MAXIMUM SUPPLY</div>
            <div className="p-3 bg-[#270927] text-white">{maximumSupply} MANA</div>
          </div>
        </div>
      </main>

      {/* Real-Time Prices Section */}
      <main className="bg-[#3a0f3a] p-6 rounded-lg shadow-md">
        <h3 className="text-[#ce711e] text-3xl font-bold mb-4">MANA Price</h3>
        <div className="bg-[#ce711e] rounded overflow-hidden">
          <div className="grid grid-cols-2">
            <div className="p-3 text-white font-semibold">manaPrice USD/MANA</div>
          </div>
        </div>
      </main>

      {/* Utility & Use Case Section */}
      <main>
        <h3 className="text-[#ce711e] text-3xl font-bold mb-4">Utility & Use Case</h3>
        <p>MANA tokens can be used to contribute to projects within the SagaHalla ecosystem. These contributions represent real-world involvement in cooperative initiatives.</p>
        <p>Convert your FYRE tokens to MANA tokens. This action represents long-term staking in the SagaHalla community.</p>
        <p>Governance Rights: MANA tokens represent contributions and do not provide governance rights within SagaHalla.</p>

        <div className="flex justify-center space-x-4">
          <button className="bg-[#ce711e] hover:bg-[#a85a18] text-white font-bold py-2 px-4 rounded">
            CONTRIBUTE MANA
          </button>
        </div>
      </main>
    </div>
  );
};

export default TokenBody;
