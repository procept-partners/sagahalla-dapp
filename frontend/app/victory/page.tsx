"use client"; // Mark this as a client-side component

function ProjectOverview() {
  return (
    <section className="section">
      <h2 className="text-[#ce711e] text-2xl">Project Overview</h2>
      <div className="placeholder">
        <p>Overview of SagaHalla, VicTory Exchange, and the MANA DApp.</p>
      </div>
    </section>
  );
}

function NorseAllegories() {
  return (
    <section className="section">
      <h2 className="text-[#ce711e] text-2xl">Norse Allegories</h2>
      <div className="placeholder">
        <p>Explanation of the importance of Norse allegories for SagaHalla.</p>
      </div>
    </section>
  );
}

function TokenSystemAndRuneSignificance() {
  return (
    <section className="section">
      <h2 className="text-[#ce711e] text-2xl">Token System and Rune Significance</h2>
      <div className="placeholder">
        <p>Overview of the SagaHalla token economy and the significance of Ancient Norse runes.</p>
      </div>
    </section>
  );
}

function ContributionSystem() {
  return (
    <section className="section">
      <h2 className="text-[#ce711e] text-2xl">1551 Renaissance: The Revolutionary Cooperative Design</h2>
      <div className="placeholder">
        <p>Introduction to the 1551 Renaissance, design of the contribution system, ratios, and historic significance.</p>
      </div>
    </section>
  );
}

function TokenMintingProcess() {
  return (
    <section className="section">
      <h2 className="text-[#ce711e] text-2xl">Token Minting and Proof of Utility</h2>
      <div className="placeholder">
        <p>Details on how token minting in SagaHalla is intimately linked to real-world work on projects.</p>
      </div>
    </section>
  );
}

function GovernanceSystem() {
  return (
    <section className="section">
      <h2 className="text-[#ce711e] text-2xl">SagaHalla and MANA Project Governance</h2>
      <div className="placeholder">
        <p>SagaHalla Governance System: Role of MANA and mana.</p>
      </div>
    </section>
  );
}

function FoundingDevelopers() {
  return (
    <section className="section">
      <h2 className="text-[#ce711e] text-2xl">Genesis Founding Developers (Avatars and Profiles)</h2>
      <div className="placeholder">
        <p>Profiles and avatars of the Genesis Founding Developers.</p>
      </div>
    </section>
  );
}

function FoundingSponsors() {
  return (
    <section className="section">
      <h2 className="text-[#ce711e] text-2xl">Genesis Founding Sponsors (Avatars and Profiles)</h2>
      <div className="placeholder">
        <p>Profiles and avatars of the Genesis Founding Sponsors.</p>
      </div>
    </section>
  );
}

function BlogSection() {
  return (
    <section className="section">
      <h2 className="text-[#ce711e] text-2xl">Blogs from the SagaHalla Blog</h2>
      <div className="placeholder">
        <p>Latest blog posts from the SagaHalla blog.</p>
      </div>
    </section>
  );
}

function MeadOfPoetry() {
  return (
    <section className="section">
      <h2 className="text-[#ce711e] text-2xl">Mead of Poetry (Saga GPT – RAG)</h2>
      <div className="placeholder">
        <p>Overview of the Mead of Poetry feature powered by Saga GPT – Retrieval Augmented Generation (RAG).</p>
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <>
      <ProjectOverview />
      <NorseAllegories />
      <TokenSystemAndRuneSignificance />
      <ContributionSystem />
      <TokenMintingProcess />
      <GovernanceSystem />
      <FoundingDevelopers />
      <FoundingSponsors />
      <BlogSection />
      <MeadOfPoetry />
    </>
  );
}
