"use client"; // This is a client-side component

import ProposalForm from '../components/ProposalForm';

import '../styles.css'; 


export default function CreateProposalPage() {
  return (
    <div className="create-proposal-page">
      <header>
        <h1>Create New Proposal</h1>
      </header>

      <section className="proposal-form">
        <ProposalForm />
      </section>

      <footer>
        <p>&copy; 2024 Mana DApp. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
