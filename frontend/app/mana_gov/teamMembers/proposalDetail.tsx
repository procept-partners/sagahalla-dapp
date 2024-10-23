import React, { useState } from 'react';
import { Proposal } from './types';
import VoteSection from './vote';

interface Props {
  proposal: Proposal;
  closeModal: () => void;
  onSave: (updatedProposal: Proposal) => void;
}

const ProposalDetailsModal: React.FC<Props> = ({ proposal, closeModal, onSave }) => {
  const { projectId, title, description, hoursRequired, tokenPerHour, totalTokensAllocated, isEnded } = proposal;

  const [editableHours, setEditableHours] = useState(hoursRequired);
  const [editableTokens, setEditableTokens] = useState(tokenPerHour);

  const handleSave = () => {
    const updatedProposal: Proposal = {
      ...proposal,
      hoursRequired: editableHours,
      tokenPerHour: editableTokens,
    };

    onSave(updatedProposal);

    closeModal();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-opacity-30 z-50 h-screen w-screen">
      <div className="bg-white p-8 rounded-2xl min-w-[20%] max-w-[80%] relative shadow-xl">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full transition-all duration-200"
          aria-label="Close"
        >
          <span className="text-3xl">&times;</span>
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>

        <div className="grid gap-6 text-lg text-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <label className="block font-semibold mb-2">Hours Required</label>
              <input
                type="number"
                value={editableHours}
                onChange={(e) => setEditableHours(Number(e.target.value))}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <label className="block font-semibold mb-2">Token Per Hour</label>
              <input
                type="number"
                value={editableTokens}
                onChange={(e) => setEditableTokens(Number(e.target.value))}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <p>Total Tokens Allocated: {totalTokensAllocated}</p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Save Changes
          </button>
        </div>

        <div className="mt-8">
          <VoteSection proposal={proposal} />
        </div>
      </div>
    </div>
  );
};

export default ProposalDetailsModal;
