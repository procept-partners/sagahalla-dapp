import { useState } from 'react';
import ProposalDetailsModal from './proposalDetail';
import { Proposal } from './types';

interface Props {
  proposals: Proposal[];
}

const ProposalList = ({ proposals }: Props) => {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeProposals, setActiveProposals] = useState<Proposal[]>(proposals);

  const openModal = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProposal(null);
  };

  const handleSave = (updatedProposal: Proposal) => {
    const updatedProposals = activeProposals.map((proposal) =>
      proposal.projectId === updatedProposal.projectId ? updatedProposal : proposal
    );
    setActiveProposals(updatedProposals);
  };

  return (
    <div>
      <h2>Proposals</h2>

      <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b border-gray-300 text-left">Title</th>
            <th className="px-6 py-3 border-b border-gray-300 text-left">Project</th>
            <th className="px-6 py-3 border-b border-gray-300 text-left">Voting Result</th>
            <th className="px-6 py-3 border-b border-gray-300 text-left">Token Allocation (%)</th>
            <th className="px-6 py-3 border-b border-gray-300 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {activeProposals.map((proposal) => {
            const percentageAllocated = (proposal.totalTokensAllocated / 1000) * 100;

            return (
              <tr key={proposal.projectId} className="border-b border-gray-200">
                <td className="px-6 py-4">
                  <button onClick={() => openModal(proposal)} className="text-blue-500 hover:underline">
                    {proposal.title}
                  </button>
                </td>

                <td className="px-6 py-4">
                  Project #{proposal.projectId}
                </td>

                <td className="px-6 py-4">
                  Yes: {proposal.yesVotes}, No: {proposal.noVotes}
                </td>

                <td className="px-6 py-4">
                  {percentageAllocated.toFixed(2)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {isModalOpen && selectedProposal && (
        <ProposalDetailsModal
          proposal={selectedProposal}
          closeModal={closeModal}
          onSave={handleSave} 
        />
      )}
    </div>
  );
};

export default ProposalList;
