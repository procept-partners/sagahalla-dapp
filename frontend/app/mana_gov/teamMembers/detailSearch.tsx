import { useState } from 'react';
import ProposalDetailsModal from './proposalDetail';
import { Proposal } from './types';

const proposals: Proposal[] = [];

const DetailSearch = () => {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposalList, setProposalList] = useState<Proposal[]>(proposals);

  const openModal = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProposal(null);
  };

  const handleSave = (updatedProposal: Proposal) => {
    const updatedProposals = proposalList.map((proposal) =>
      proposal.projectId === updatedProposal.projectId ? updatedProposal : proposal
    );
    setProposalList(updatedProposals);
  };

  if (!selectedProposal) return <p>No proposal selected</p>;

  return (
    <>
      <button onClick={() => openModal(selectedProposal)}>Show Proposal Details</button>

      {isModalOpen && selectedProposal && (
        <ProposalDetailsModal
          proposal={selectedProposal}
          closeModal={closeModal}
          onSave={handleSave} 
        />
      )}
    </>
  );
};

export default DetailSearch;
