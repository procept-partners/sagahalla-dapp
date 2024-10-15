"use client";  // This enables Client Component behavior

import { useState } from 'react';
import ProposalList from './proposalList';
import ProposalForm from './proposalForm';
import { Proposal } from './types';
// Need to add login and logout with near wallet in here

export default function Home() {
  const [proposals, setProposals] = useState<Proposal[]>([]);

  const addProposal = (proposal: Omit<Proposal, 'id' | 'yesVotes' | 'noVotes' | 'totalTokensAllocated' | 'isEnded'>) => {
    setProposals([
      ...proposals,
      {
        ...proposal,
        id: proposals.length + 1,
        yesVotes: 0,
        noVotes: 0,
        totalTokensAllocated: 0,
        isEnded: false,
      },
    ]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10">
      <div className="w-full max-w-4xl px-4">
        
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Governance Proposals</h1>
          <p className="text-lg text-gray-600">Participate in the governance by adding and voting on proposals.</p>
        </header>

        {/* Form */}
        <section className="mb-16">
          <ProposalForm addProposal={addProposal} />
        </section>

        {/* Proposals List */}
        <section>
          {proposals.length > 0 ? (
            <ProposalList proposals={proposals} />
          ) : (
            <p className="text-gray-600 text-center">No proposals yet. Add one to get started!</p>
          )}
        </section>
      </div>
    </div>
  );
}
