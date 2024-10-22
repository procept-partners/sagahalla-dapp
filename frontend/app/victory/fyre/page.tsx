"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ethers } from 'ethers';
import fyreData from "../abi/FyreToken.json";

interface PurchaseHistory {
  date: string;
  amount: string;
  buyer: string;
}

const TokenBody: React.FC = () => {
  const [purchaseAmount, setPurchaseAmount] = useState<string>("");
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [circulatingSupply, setCirculatingSupply] = useState<string>("");
  const [maximumSupply, setMaximumSupply] = useState<string>("");

  const fyreAddress = fyreData.fyreAddress;
  const fyreAbi = fyreData.abi;

  const fetchPurchaseHistory = useCallback(async () => {
    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(fyreAddress, fyreAbi, provider);

      const filter = contract.filters.Purchase();
      const events = await contract.queryFilter(filter);

      const history = events.map(event => ({
        date: event.args?.timestamp ? new Date(event.args.timestamp * 1000).toLocaleDateString() : 'N/A',
        amount: event.args?.amount ? `${ethers.utils.formatUnits(event.args.amount, "ether")} FYRE` : 'N/A',
        buyer: event.args?.buyer ?? 'Unknown',
      }));

      setPurchaseHistory(history);
    } catch (error) {
      console.error("Error fetching purchase history:", error);
    } finally {
      setLoading(false);
    }
  }, [fyreAddress, fyreAbi]);

  useEffect(() => {
    fetchPurchaseHistory();
  }, [fetchPurchaseHistory]);

  const handlePurchaseTokens = async () => {
    try {
      setLoading(true);
  
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const account = await signer.getAddress(); 

      const fyreContract = new ethers.Contract(fyreAddress, fyreAbi, signer);
  
      const tx = await fyreContract.mintUncollateralized(account, ethers.utils.parseUnits(purchaseAmount, "ether"));
      
      await tx.wait(); 

      console.log("Tokens purchased successfully!");
      fetchPurchaseHistory();
    } catch (error) {
      console.error("Error purchasing tokens:", error);
      setError("There was an issue with the transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#270927] min-h-screen text-white p-8">
      {/* Token Purchase Section */}
      <main className="flex justify-center mt-10">
        <div className="bg-[#3a0f3a] p-5 rounded-lg shadow-md w-full max-w-md">
          <h3 className="text-[#ce711e] text-3xl font-bold mb-4 text-center">Purchase FYRE Tokens</h3>
          <label className="mb-2 block text-center">Offering Price: $ per FYRE</label>
          <input
            type="number"
            id="price"
            className="w-full p-2 rounded text-black"
            placeholder="Input Fyre Amount"
            value={purchaseAmount}
            onChange={(e) => setPurchaseAmount(e.target.value)}
          />
          <button
            onClick={handlePurchaseTokens}
            disabled={loading}
            className={`bg-[#ce711e] hover:bg-[#a85a18] text-white font-bold py-2 px-4 rounded w-full mt-4 ${loading ? 'cursor-not-allowed' : ''}`}
          >
            {loading ? "Purchasing..." : "PURCHASE FYRE"}
          </button>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </main>

      {/* Purchase History Section */}
      <main>
        <div className="mt-10">
          <h3 className="text-[#ce711e] text-3xl font-bold mb-4">Purchase History</h3>
          {loading ? (
            <p>Loading purchase history...</p>
          ) : purchaseHistory.length > 0 ? (
            <div className="bg-[#270927] p-4 rounded-lg shadow-md">
              <table className="w-full text-left text-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Amount</th>
                    <th className="px-4 py-2">Buyer</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseHistory.map((purchase, index) => (
                    <tr key={index} className="bg-[#3a0f3a]">
                      <td className="border px-4 py-2">{purchase.date}</td>
                      <td className="border px-4 py-2">{purchase.amount}</td>
                      <td className="border px-4 py-2">{purchase.buyer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No purchases made yet.</p>
          )}
        </div>
      </main>

      {/* Minting Stats Section */}
      <main>
        <h3 className="text-[#ce711e] text-3xl font-bold mb-4">FYRE Token Supply</h3>
        <div className="bg-[#ce711e] rounded overflow-hidden">
          <div className="grid grid-cols-2">
            <div className="p-3 text-white font-semibold">CIRCULATING SUPPLY</div>
            <div className="p-3 bg-[#270927] text-white">{circulatingSupply} FYRE</div>
            <div className="p-3 text-white font-semibold">MAXIMUM SUPPLY</div>
            <div className="p-3 bg-[#270927] text-white">{maximumSupply} FYRE</div>
          </div>
        </div>
      </main>

      {/* Real-Time Prices Section */}
      <main className="bg-[#3a0f3a] p-6 rounded-lg shadow-md">
        <h3 className="text-[#ce711e] text-3xl font-bold mb-4">FYRE Price</h3>
        <div className="bg-[#ce711e] rounded overflow-hidden">
          <div className="grid grid-cols-2">
            <div className="p-3 text-white font-semibold">fyrePrice USD/FYRE</div>
          </div>
        </div>
      </main>

      {/* Utility & Use Case Section */}
      <main>
        <h3 className="text-[#ce711e] text-3xl font-bold mb-4">Utility & Use Case</h3>
        <p>FYRE tokens can be used to purchase SHLD tokens and contribute MANA to projects within SagaHalla.</p>
        <p>Convert your FYRE tokens to MANA tokens. This action represents long-term staking in the SagaHalla community, contributing to the cooperative.</p>
        <p>Governance Rights: FYRE tokens are community tokens and do not provide governance rights.</p>

        <div className="flex justify-center space-x-4">
          <button className="bg-[#ce711e] hover:bg-[#a85a18] text-white font-bold py-2 px-4 rounded">
            PURCHASE SHLD
          </button>
          <button className="bg-[#ce711e] hover:bg-[#a85a18] text-white font-bold py-2 px-4 rounded">
            CONTRIBUTE MANA
          </button>
        </div>
      </main>
    </div>
  );
};

export default TokenBody;
