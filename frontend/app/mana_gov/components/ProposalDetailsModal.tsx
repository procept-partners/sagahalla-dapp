"use client"; // Assuming this is a client-side component

import React from 'react';
import { Proposal } from '../types/types'; // Assuming you have a Proposal type defined

interface Props {
  proposal: Proposal;
  closeModal: () => void;
}

const ProposalDetailsModal = ({ proposal, closeModal }: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{proposal.title}</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            &times; {/* Close button */}
          </button>
        </div>

        {/* Proposal Details */}
        <div className="mb-4">
          <p><strong>Description:</strong> {proposal.description || 'No description available.'}</p>
          <p><strong>Total Tokens Allocated:</strong> {proposal.totalTokensAllocated}</p>
          <p><strong>Yes Votes:</strong> {proposal.yesVotes}</p>
          <p><strong>No Votes:</strong> {proposal.noVotes}</p>
          <p><strong>Status:</strong> {proposal.isEnded ? 'Ended' : 'Active'}</p>
        </div>

        {/* Additional Proposal Information */}
        <div className="mb-4">
          <h3 className="font-semibold">More Info</h3>
          <p>{proposal.moreInfo || 'No additional information.'}</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetailsModal;
