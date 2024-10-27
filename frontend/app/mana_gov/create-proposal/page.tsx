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
    targetApprovalDate: string | null; // Ensure consistency with `Proposal` type
    submittedBy: string;
  }) => {
    // Build the full proposal object with default values for required fields
    const fullProposal = {
      ...proposal,
      id: Date.now(), // Replace with a generated ID as needed
      yesVotes: 0,
      noVotes: 0,
      manaTokenAllocated: 0,
      isEnded: false,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      subProjects: [],
      budgetItems: [],
    };
  
    console.log('Proposal submitted:', fullProposal);
    // Here you can handle the submitted proposal, such as sending it to an API
  };
  

  return (
    <div className="bg-[#270927] py-20 text-black">
      <header className="px-5 text-2xl font-bold text-white">
        <h1>Create New Proposal</h1>
      </header>

      {/* Pass `addProposal` and `loggedInUserId` to ProposalForm */}
      <ProposalForm addProposal={addProposal} loggedInUserId={loggedInUserId} />
    </div>
  );
};

export default CreateProposalPage;
