import { useState, useEffect } from 'react';
import ProposalDetails from './proposalDetail';
import { Proposal } from './types';

const proposals: Proposal[] = [];

export default function DetailSearch() {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProposal(null);
  };

  if (!selectedProposal) return <p>No proposal selected</p>;

  return (
    <>
      <button onClick={() => openModal(selectedProposal)}>Show Proposal Details</button>

      {isModalOpen && selectedProposal && (
        <ProposalDetails proposal={selectedProposal} closeModal={closeModal} />
      )}
    </>
  );
}
