import { useState, useEffect } from 'react';
import ProposalDetailsModal from './ProposalDetailsModal';
import { Proposal } from '../types/types';

// Need to add a time limit and the 'end button' can only be used by PM after he/she approved the hours and tokens earned

interface Props {
  proposals: Proposal[];
}

const ProposalList = ({ proposals }: Props) => {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeProposals, setActiveProposals] = useState<Proposal[]>([]); 
  const [filter, setFilter] = useState<'all' | 'active' | 'ended'>('all'); 
  const [searchQuery, setSearchQuery] = useState('');

  // Update activeProposals state when proposals prop changes
  useEffect(() => {
    setActiveProposals(proposals);
  }, [proposals]);

  const openModal = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProposal(null);
  };

  const endProposal = (id: number) => {
    const updatedProposals = activeProposals.map((proposal) =>
      proposal.id === id ? { ...proposal, isEnded: true } : proposal
    );
    setActiveProposals(updatedProposals);
  };

  // Filter
  const filteredProposals = activeProposals
    .filter((proposal) => {
      if (filter === 'active') return !proposal.isEnded;
      if (filter === 'ended') return proposal.isEnded;
      return true;
    })
    .filter((proposal) => proposal.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div>
      <h2>Proposals</h2>

      {/* Filter */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="proposal-filter" className="mr-4">Filter by:</label>
        <select
          id="proposal-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'ended')}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="all">All Proposals</option>
          <option value="active">Active Proposals</option>
          <option value="ended">Ended Proposals</option>
        </select>

        {/* Search Box */}
        <input
          type="text"
          placeholder="Search by title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="ml-4 px-3 py-2 border rounded-lg"
        />
        <button className="ml-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600">
          Search
        </button>
      </div>

      {/* Proposal */}
      <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Title</th>
            <th className="px-6 py-3 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Voting Result</th>
            <th className="px-6 py-3 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Token Allocation (%)</th>
            <th className="px-6 py-3 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProposals.map((proposal) => {
            const totalTokens = proposal.totalTokens || 1000; // Use a dynamic totalTokens value if available
            const percentageAllocated = (proposal.totalTokensAllocated / totalTokens) * 100;

            return (
              <tr key={proposal.id} className="border-b border-gray-200">
                {/* Proposal Title */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <button onClick={() => openModal(proposal)} className="text-blue-500 hover:underline">
                    {proposal.title}
                  </button>
                </td>

                {/* Voting Result */}
                <td className="px-6 py-4 whitespace-nowrap">
                  Yes: {proposal.yesVotes}, No: {proposal.noVotes}
                </td>

                {/* Token Allocation (Percentage) */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {percentageAllocated.toFixed(2)}%
                </td>

                {/* Actions (End Proposal Button or Proposal Ended) */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {!proposal.isEnded ? (
                    <button
                      onClick={() => endProposal(proposal.id)}
                      className="px-4 py-2 bg-destructive text-white rounded-lg hover:bg-red-600"
                    >
                      End Proposal
                    </button>
                  ) : (
                    <p className="text-red-500 font-bold">Proposal Ended</p>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Proposal details' modal */}
      {isModalOpen && selectedProposal && (
        <ProposalDetailsModal proposal={selectedProposal} closeModal={closeModal} />
      )}
    </div>
  );
};

export default ProposalList;
