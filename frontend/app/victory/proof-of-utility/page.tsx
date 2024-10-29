"use client";

export default function TokenMintingAndProofOfUtilityPage() {
  return (
    <div className="flex min-h-screen flex-col bg-purple-custom text-white">
      {/* Header */}
      <header className="header">
        <div className="title">
          <h1>Token Minting and Proof of Utility</h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow p-8">
        <div>
          <h2 className="section-header">How Token Minting in SagaHalla Aligns with Real-World Project Contributions</h2>
          <p>
            SagaHalla’s token minting process is distinctively designed around the Proof of Utility (PoU) mechanism, which ties 
            token issuance directly to real-world contributions and project achievements...
          </p>

          <h3>Proof of Utility (PoU): Core Mechanism</h3>
          
          <h4>1. Utility-Backed Token Issuance</h4>
          <ul>
            <li>Tokens within SagaHalla are pre-minted on a fixed 21-round schedule, supporting a scarcity model similar to Bitcoin.</li>
            <li>The primary community token, <strong>FYRE (ERC20)</strong>, and the labor input token, <strong>mana (ERC20)</strong>, are minted in sync with one another.</li>
            <li>These tokens are pre-minted according to a specified start date and time established by governance and held by the treasury until required for circulation.</li>
            <li>Fundraising targets align with the minting schedule to fully collateralize FYRE and <strong>MANA (ERC1400)</strong> tokens for each round according to a collateralization ratio set by governance.</li>
            <li><strong>Only fully collateralized FYRE tokens</strong> are used to purchase fully collateralized MANA tokens, stabilizing financial contributions and maintaining the specified contribution ratio between the community and cooperative members.</li>
          </ul>

          <h4>2. mana Token Flow</h4>
          <ul>
            <li><strong>mana (ERC20)</strong>: Used operationally by the cooperative for managing labor contributions to projects...</li>
            <li><strong>mana (ERC1400)</strong>: Created when a member contributes their mana (ERC20) to the cooperative...</li>
            <li><strong>MANA (ERC1400)</strong>: Represents Bitcoin-backed financial contributions, offering full governance rights...</li>
          </ul>

          <h4>3. Transparent Blockchain-Driven Utility Valuation</h4>
          <p>
            Real-time logging of contributions ensures that both labor and financial inputs are transparently recorded...
          </p>

          <h4>4. Agile Project Management and Token Reconciliation</h4>
          <p>
            Tokens are distributed to team members upon meeting project milestones. Unutilized tokens return to the treasury...
          </p>

          <h3>Minting and Burning Rules</h3>
          <ul>
            <li><strong>Minting of FYRE and mana (ERC20)</strong>: Minted on a fixed schedule to ensure labor inputs are appropriately allocated...</li>
            <li><strong>Minting of mana (ERC1400)</strong>: Minted in proportion to demand for labor contributions, granting governance rights...</li>
            <li><strong>Minting of MANA (ERC1400)</strong>: Minted based on demand for Bitcoin-backed financial contributions...</li>
          </ul>

          <h3>Balancing Financial and Labor Contributions</h3>
          <p>
            SagaHalla’s dual-token governance model ensures that both capital and labor contributions are appropriately valued...
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2023 SagaHalla Cooperative. All rights reserved.</p>
      </footer>
    </div>
  );
}
