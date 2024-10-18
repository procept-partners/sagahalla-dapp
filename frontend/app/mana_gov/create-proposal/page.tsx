"use client"; // This is a client-side component

import ProposalForm from '../components/ProposalForm';
import '../styles.css'; 

export default function CreateProposalPage() {
  // Define the addProposal function
  const addProposal = (proposal: { title: string; description: string; manaHoursBudgeted: number; manaTokenAllocated: number; targetApprovalDate: string; submittedBy: string }) => {
    console.log('Proposal submitted:', proposal);
    // You can handle the proposal here (e.g., save to a database or send to an API)
  };

  const loggedInUserId = '1234'; // Replace with the actual logged-in user ID

  return (
    <div className="create-proposal-page">
      <header className="text-white text-xl font-bold">
        <div className="title flex-grow text-center">
          <h1 className="text-white text-xl font-bold">Create New Proposal</h1>
        </div>
      </header>

      <section className="proposal-form">
        {/* Pass the required props to ProposalForm */}
        <ProposalForm addProposal={addProposal} loggedInUserId={loggedInUserId} />
      </section>
    </div>
  );
}
