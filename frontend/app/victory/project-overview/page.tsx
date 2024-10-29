// app/victory/project-overview/page.tsx

"use client";

export default function ProjectOverviewPage() {
  return (
    <div className="flex min-h-screen flex-col">

      {/* Main Content Area */}
      <main className="flex-grow bg-[#270927] p-8 text-white">
        <div>
          <h1>Project Overview</h1>
          
          <h2>Introduction to SagaHalla, Victory Exchange, and the MANA DApp</h2>
          <p>
            The Victory DApp is a unique decentralized platform that empowers users to directly invest in and 
            participate in cooperative projects through the innovative SagaHalla ecosystem. Here’s an overview 
            of the core components that make up this new decentralized economy:
          </p>

          <h3>SagaHalla</h3>
          <p>
            SagaHalla is a myth-inspired, decentralized cooperative platform rooted in the values of resilience, 
            strength, and community. SagaHalla’s cooperative model is designed to support real-world projects by 
            providing a balanced governance structure that respects both financial contributions and labor-based 
            contributions.
          </p>

          <h3>Victory Exchange</h3>
          <p>
            Victory Exchange serves as the primary platform for token transactions within the SagaHalla ecosystem, 
            allowing members to purchase and exchange governance and utility tokens that facilitate project funding 
            and cooperative engagement.
          </p>

          <h3>MANA DApp</h3>
          <p>
            The MANA DApp is the core governance hub of the SagaHalla cooperative. Members can participate in 
            decision-making processes, contribute to community projects, and leverage their token holdings to 
            influence cooperative directions. The MANA token is an ERC20 token that tracks labor input value. 
            It may be liquidated as payment for labor inputs or contributed to the cooperative to gain governance 
            rights. The MANA token, backed by Bitcoin collateral, empowers users with full governance rights and 
            represents fully backed financial contributions to the cooperative. Contributions in the cooperative 
            follow a path from valued labor inputs (MANA ERC20), contributed labor capital (MANA ERC1400), to 
            ultimately fully backed financial contributions (MANA ERC1400).
          </p>

          <hr />

          <p>
            With a focus on sustainable growth, SagaHalla aims to balance community, member, and investor interests 
            with cooperative values, creating a secure foundation for sustainable innovation. This cooperative 
            structure not only provides transparency in decision-making but also in utility generation in a compliant 
            and decentralized manner within a framework that can be adopted by real-world entities such as other 
            cooperatives, non-profits, corporations, or other legal entities that wish to track real-world utility 
            and value generation.
          </p>
        </div>
      </main>
    </div>
  );
}
