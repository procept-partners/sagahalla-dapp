import { ethers } from "ethers";
import { connect, WalletConnection, Contract } from "near-api-js";
import { Account } from "near-api-js";
import { AuroraProvider } from "@aurora-is-near/aurora-provider";
import { AuroraEvm } from "@aurora-is-near/aurora-js";

const AURORA_RPC_URL = "https://mainnet.aurora.dev"; // Change if you're using a different network
const MANA_CONTRACT_ADDRESS = "0x..."; // Replace with your MANA contract address
const TREASURY_ADDRESS = "0x..."; // Replace with your Treasury address on Aurora
const MANA_DECIMALS = 18; // MANA token's decimal count
const NEAR_NETWORK_ID = "mainnet"; // Change for testnet or other environments

// Initialize provider for Aurora
const auroraProvider = new ethers.providers.JsonRpcProvider(AURORA_RPC_URL);

// Function to get balances of mana and collateralized MANA for a specific SHLD holder
async function getManaBalances(shldHolderAddress: string): Promise<{ mana: number; collateralMana: number }> {
    const manaContract = new ethers.Contract(MANA_CONTRACT_ADDRESS, [
        "function balanceOf(address) view returns (uint256)"
    ], auroraProvider);

    const manaBalance = await manaContract.balanceOf(shldHolderAddress);
    const collateralManaBalance = await manaContract.balanceOf(TREASURY_ADDRESS);

    return {
        mana: Number(ethers.utils.formatUnits(manaBalance, MANA_DECIMALS)),
        collateralMana: Number(ethers.utils.formatUnits(collateralManaBalance, MANA_DECIMALS))
    };
}

// Function to get the circulating supply of MANA and collateralized MANA tokens
async function getCirculatingSupply(): Promise<{ circulatingMana: number; circulatingCollateralMana: number }> {
    const manaContract = new ethers.Contract(MANA_CONTRACT_ADDRESS, [
        "function totalSupply() view returns (uint256)"
    ], auroraProvider);

    const totalManaSupply = await manaContract.totalSupply();
    const treasuryBalance = await manaContract.balanceOf(TREASURY_ADDRESS);

    const circulatingMana = Number(ethers.utils.formatUnits(totalManaSupply.sub(treasuryBalance), MANA_DECIMALS));
    const circulatingCollateralMana = Number(ethers.utils.formatUnits(treasuryBalance, MANA_DECIMALS));

    return { circulatingMana, circulatingCollateralMana };
}

// Function to calculate voting power based on circulating supply and balances
async function calculateVotingPower(shldHolderAddress: string): Promise<number> {
    const { mana, collateralMana } = await getManaBalances(shldHolderAddress);
    const { circulatingMana, circulatingCollateralMana } = await getCirculatingSupply();

    if (circulatingMana === 0 || circulatingCollateralMana === 0) {
        throw new Error("Circulating supply is zero, cannot calculate voting power.");
    }

    const manaVotingPower = (mana / circulatingMana) * 100;
    const collateralManaVotingPower = (collateralMana / circulatingCollateralMana) * 100;

    return manaVotingPower + collateralManaVotingPower;
}

// Connect to NEAR
async function connectNear() {
    const near = await connect({
        networkId: NEAR_NETWORK_ID,
        keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: `https://rpc.${NEAR_NETWORK_ID}.near.org`,
        walletUrl: `https://wallet.${NEAR_NETWORK_ID}.near.org`,
        helperUrl: `https://helper.${NEAR_NETWORK_ID}.near.org`,
        explorerUrl: `https://explorer.${NEAR_NETWORK_ID}.near.org`
    });

    const wallet = new WalletConnection(near, null);
    return wallet;
}

// Example usage:
(async () => {
    const shldHolderAddress = "0xYourSHLDHolderAddress"; // Replace with actual SHLD holder's address

    try {
        const votingPower = await calculateVotingPower(shldHolderAddress);
        console.log(`Voting Power for ${shldHolderAddress}: ${votingPower}%`);
    } catch (error) {
        console.error("Error calculating voting power:", error);
    }
})();

export { getManaBalances, getCirculatingSupply, calculateVotingPower, connectNear };
