import { useState, useEffect } from 'react';
import ProposalDetailsModal from './ProposalDetailsModal';
import { Proposal } from '../types/types';

interface Props {
  proposals: Proposal[];
}

const ProposalList = ({ proposals }: Props) => {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeProposals, setActiveProposals] = useState<Proposal[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'ended'>('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter proposals by active, ended, and search query
  const filteredProposals = activeProposals
    .filter((proposal) => {
      if (filter === 'active') return !proposal.isEnded;
      if (filter === 'ended') return proposal.isEnded;
      return true;
    })
    .filter((proposal) =>
      proposal.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div>
      <h2 className="text-orange-500">Proposals</h2>

      {/* Filter Section */}
      <div className="mb-4">
        <label htmlFor="proposal-filter" className="text-orange-500 mr-4">
          Filter by:
        </label>
        <select
          id="proposal-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'ended')}
          className="px-3 py-2 border border-orange-500 rounded-lg bg-purple-900 text-white"
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
          className="ml-4 px-3 py-2 border border-orange-500 rounded-lg bg-purple-900 text-white"
        />
        <button className="ml-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
          Search
        </button>
      </div>

      {/* Proposal List */}
      <table className="min-w-full bg-purple-900 rounded-lg">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-orange-500 text-left text-sm font-medium text-orange-500">
              Title
            </th>
            <th className="px-6 py-3 border-b-2 border-orange-500 text-left text-sm font-medium text-orange-500">
              Voting Result
            </th>
            <th className="px-6 py-3 border-b-2 border-orange-500 text-left text-sm font-medium text-orange-500">
              MANA Tokens Allocated
            </th>
            <th className="px-6 py-3 border-b-2 border-orange-500 text-left text-sm font-medium text-orange-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredProposals.map((proposal) => (
            <tr key={proposal.id} className="border-b border-gray-200 hover:bg-orange-500 hover:text-white">
              <td className="px-6 py-4 whitespace-nowrap">
                <button onClick={() => openModal(proposal)} className="text-orange-500 hover:underline">
                  {proposal.title}
                </button>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                Yes: {proposal.yesVotes}, No: {proposal.noVotes}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                {proposal.manaTokensAllocated}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                {!proposal.isEnded ? (
                  <button
                    onClick={() => endProposal(proposal.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    End Proposal
                  </button>
                ) : (
                  <p className="text-red-500 font-bold">Proposal Ended</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Proposal details modal */}
      {isModalOpen && selectedProposal && (
        <ProposalDetailsModal proposal={selectedProposal} closeModal={closeModal} />
      )}
    </div>
  );
};

export default ProposalList;
