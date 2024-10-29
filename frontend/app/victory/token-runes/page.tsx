"use client";

export default function TokenRuneSignificancePage() {
  return (
    <div className="flex min-h-screen flex-col bg-purple-custom text-white">

      {/* Main Content Area */}
      <main className="flex-grow p-8">
        <div>
          <h1 className="section-header">Token Rune Significance</h1>
          
          <h2 className="section-header">Overview of the SagaHalla Token Economy and the Significance of Ancient Norse Runes</h2>
          <p>
            SagaHalla’s token economy is designed with both function and culture in mind, using each token to serve a distinct 
            role while embedding each with the symbolism of Norse mythology. This fusion of purpose and meaning allows each token 
            to carry the cooperative’s values, balancing practical utility with cultural depth.
          </p>

          <h3>Token Types and Their Significance</h3>

          <h4>1. FYRE (Utility Token)</h4>
          <p><strong>Rune</strong>: <em>Kenaz</em> - Fire and Knowledge</p>
          <p><strong>Role</strong>: FYRE serves as the primary medium of exchange in SagaHalla, facilitating transactions and 
          project funding.</p>
          <p><strong>Symbolism</strong>: Kenaz embodies knowledge, growth, and transformation. FYRE is the "fuel" that powers 
          cooperative activities and provides the energy for projects, symbolizing the cooperative’s drive toward innovation and 
          development.</p>

          <h4>2. SHLD (Identity Token)</h4>
          <p><strong>Rune</strong>: <em>Uruz</em> - Identity and Community Strength</p>
          <p><strong>Role</strong>: SHLD is a non-fungible token (NFT) representing identity within the cooperative, granting 
          governance access and secure participation.</p>
          <p><strong>Symbolism</strong>: Uruz, standing for strength and unity, reflects the cooperative’s focus on community 
          identity. SHLD ties each user’s identity to their contributions, reinforcing a sense of belonging and purpose in 
          the cooperative.</p>

          <h4>3. MANA (Governance Token)</h4>
          <p><strong>Rune</strong>: <em>Mannaz</em> - Humanity and Fair Governance</p>
          <p><strong>Role</strong>: MANA is a governance token that provides voting rights, enabling members to influence the 
          cooperative’s future. MANA is collateralized by Bitcoin, providing a stable foundation linked to real-world assets.</p>
          <p><strong>Symbolism</strong>: Mannaz represents humanity, community, and balanced decision-making. It guides the 
          cooperative’s governance model, emphasizing fairness and collective wisdom in shaping SagaHalla’s growth.</p>

          <h3>How Runes Integrate with Token Functions</h3>
          <p>
            Each token aligns with its symbolic rune, fostering a connection between the cooperative’s values and its operations. 
            This alignment enhances members’ experiences, allowing them to engage with SagaHalla in ways that reflect both functional 
            and cultural significance.
          </p>
          <ul>
            <li><strong>FYRE as Growth and Energy</strong>: FYRE’s role in facilitating transactions and funding aligns with Kenaz, 
            embodying the cooperative’s drive for growth and progress.</li>
            <li><strong>SHLD as Identity and Strength</strong>: SHLD’s function in establishing secure identity links with Uruz, 
            highlighting the strength in community unity and resilience.</li>
            <li><strong>MANA as Fair Governance and Participation</strong>: MANA’s governance role is tied to Mannaz, embodying 
            fairness, democratic participation, and respect for each member’s contribution.</li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2023 SagaHalla Cooperative. All rights reserved.</p>
      </footer>
    </div>
  );
}