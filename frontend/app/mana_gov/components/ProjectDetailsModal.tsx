"use client"; // Assuming this is a client-side component

import React from 'react';
import { Project } from '../types/types'; // Assuming you have a Project type defined

interface Props {
  project: Project;
  closeModal: () => void;
}

const ProjectDetailsModal = ({ project, closeModal }: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{project.title}</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            &times; {/* Close button */}
          </button>
        </div>

        {/* Project Details */}
        <div className="mb-4">
          <p><strong>Total Mana Hours:</strong> {project.totalManaHours}</p>
          <p><strong>Your Mana Hours:</strong> {project.manaHours.find(mana => mana.userId)?.hours || 0}</p>
          <p><strong>Voting Power:</strong> {project.votingPower}</p>
        </div>

        {/* Additional Project Info */}
        <div className="mb-4">
          <h3 className="font-semibold">Description</h3>
          <p>{project.description || 'No description available.'}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold">Team Members</h3>
          <ul className="list-disc list-inside">
            {project.teamMembers && project.teamMembers.length > 0 ? (
              project.teamMembers.map((member, index) => (
                <li key={index}>{member.name}</li>
              ))
            ) : (
              <li>No team members assigned yet.</li>
            )}
          </ul>
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

export default ProjectDetailsModal;
