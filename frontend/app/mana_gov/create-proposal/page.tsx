"use client"; // This enables the component to be a Client Component

import { useState } from 'react';

interface Props {
  addProposal: (proposal: {
    title: string;
    description: string;
    manaHoursBudgeted: number;
    targetApprovalDate: string;
    submittedBy: string;
  }) => void;
  loggedInUserId: string; // Pass the logged-in user's ID as a prop
}

const ProposalForm = ({ addProposal, loggedInUserId }: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [manaHoursBudgeted, setManaHoursBudgeted] = useState(0);
  const [targetApprovalDate, setTargetApprovalDate] = useState<string | undefined>(undefined);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setJsonFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title && !jsonFile) {
      setValidationError('Please either fill out the form or upload a JSON file.');
      return;
    }

    if (!manaHoursBudgeted && !jsonFile) {
      setValidationError('Please provide the required mana hours or upload a JSON file.');
      return;
    }

    // Reset error and success messages
    setValidationError(null);
    setSuccessMessage(null);

    if (jsonFile) {
      // Handle reading and submitting the JSON file
      const fileContent = await jsonFile.text();
      let parsedJson;
      try {
        parsedJson = JSON.parse(fileContent);
      } catch (err) {
        setValidationError('Invalid JSON file.');
        return;
      }

      // Submit the parsed JSON data
      addProposal(parsedJson);
      setSuccessMessage('Proposal submitted successfully from JSON!');
      resetForm();
    } else {
      const proposal = {
        title,
        description,
        manaHoursBudgeted,
        targetApprovalDate: targetApprovalDate || '', // Optional field
        submittedBy: loggedInUserId, // Automatically set the logged-in user
      };

      // Submit the proposal
      addProposal(proposal);
      setSuccessMessage('Proposal submitted successfully!');
      resetForm();
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setManaHoursBudgeted(0);
    setTargetApprovalDate(undefined);
    setJsonFile(null);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 p-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <label className="block text-orange-500 font-medium mb-2">Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Enter proposal title"
        />
      </div>

      <div className="mb-4">
        <label className="block text-orange-500 font-medium mb-2">Description (Optional):</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Describe the proposal"
        />
      </div>

      <div className="mb-4">
        <label className="block text-orange-500 font-medium mb-2">Mana Hours Budgeted:</label>
        <input
          type="number"
          value={manaHoursBudgeted}
          onChange={(e) => setManaHoursBudgeted(Number(e.target.value))}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Enter mana hours budgeted"
        />
      </div>

      <div className="mb-4">
        <label className="block text-orange-500 font-medium mb-2">Target Date for Approval (Optional):</label>
        <input
          type="date"
          value={targetApprovalDate || ''}
          onChange={(e) => setTargetApprovalDate(e.target.value || undefined)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-orange-500 font-medium mb-2">Upload JSON File (Optional):</label>
        <input
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {validationError && (
        <div className="text-red-500 font-medium mb-4">
          {validationError}
        </div>
      )}

      {successMessage && (
        <div className="text-green-500 font-medium mb-4">
          {successMessage}
        </div>
      )}

      <button
        type="submit"
        className="bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition duration-300 ease-in-out"
      >
        Submit Proposal
      </button>
    </form>
  );
};

export default ProposalForm;
