"use client"; // This is a client-side component

import ProposalForm from '../components/ProposalForm';

import '../styles.css'; 

export default function CreateProposalPage() {
  return (
    <div className="create-proposal-page">
      <header className="text-white text-xl font-bold">
      <div className="title flex-grow text-center">
          <h1 className="text-white text-xl font-bold">Create New Proposal</h1>
      </div>
      </header>

      <section className="proposal-form">
        <ProposalForm />
      </section>
    </div>
  );
}
