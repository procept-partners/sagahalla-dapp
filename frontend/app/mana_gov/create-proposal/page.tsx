"use client"; // This enables the component to be a Client Component

import { useState } from 'react';
import ProposalForm from '../components/ProposalForm'; // Make sure this path is correct

const CreateProposalPage = () => {
  const loggedInUserId = '123'; // Replace with actual user ID from authentication if needed

  // Define the `addProposal` function here
  const addProposal = (proposal: {
    title: string;
    description: string;
    manaHoursBudgeted: number;
    targetApprovalDate: string;
    submittedBy: string;
  }) => {
    console.log('Proposal submitted:', proposal);
    // Here you can handle the submitted proposal, such as sending it to an API
  };

  return (
    <div className="create-proposal-page">
      <header className="text-white text-xl font-bold">
        <h1>Create New Proposal</h1>
      </header>

      {/* Pass `addProposal` and `loggedInUserId` to ProposalForm */}
      <ProposalForm addProposal={addProposal} loggedInUserId={loggedInUserId} />
    </div>
  );
};

export default CreateProposalPage;
