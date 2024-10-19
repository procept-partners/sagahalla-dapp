import { useState } from 'react';
import Modal from './Modal'; // Import the modal component

interface Props {
  addProposal: (proposal: {
    title: string;
    description: string;
    manaHoursBudgeted: number;
    targetApprovalDate: string;
    submittedBy: string;
    developers?: any; // Allow for nested developer data
  }) => void;
  loggedInUserId: string; // Pass the logged-in user's ID as a prop
}

const ProposalForm = ({ addProposal, loggedInUserId }: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [manaHoursBudgeted, setManaHoursBudgeted] = useState(0);
  const [targetApprovalDate, setTargetApprovalDate] = useState<string | undefined>(undefined);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [modalMessage, setModalMessage] = useState(''); // Message to show in modal

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setJsonFile(file);
  };

  // Modified validation to handle nested developer and project structures
  const validateProposalJson = (json: any): string | null => {
    if (typeof json.title !== 'string') {
      return 'Invalid or missing "title" in proposal.';
    }
    if (typeof json.submittedBy !== 'string') {
      return 'Invalid or missing "submittedBy" in proposal.';
    }
    if (typeof json.manaHoursBudgeted !== 'number') {
      return 'Invalid or missing "manaHoursBudgeted" in proposal.';
    }
    if (json.targetApprovalDate && isNaN(Date.parse(json.targetApprovalDate))) {
      return 'Invalid "targetApprovalDate" in proposal.';
    }

    // Validate developers structure
    if (json.developers && typeof json.developers !== 'object') {
      return 'Invalid "developers" structure in proposal.';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (jsonFile) {
      try {
        const fileContent = await jsonFile.text();
        const parsedJson = JSON.parse(fileContent);
        const validationMessage = validateProposalJson(parsedJson);
        if (validationMessage) {
          setValidationError(validationMessage);
          return;
        }
        // Show modal when validation passes
        setModalMessage('Validation passed! Submitting your proposal...');
        setShowModal(true);
        addProposal(parsedJson);
      } catch (err) {
        setValidationError('Invalid JSON file.');
      }
    } else {
      const proposal = {
        title,
        description,
        manaHoursBudgeted,
        targetApprovalDate: targetApprovalDate || '',
        submittedBy: loggedInUserId,
      };
      // Show modal when validation passes
      setModalMessage('Validation passed! Submitting your proposal...');
      setShowModal(true);
      addProposal(proposal);
    }

    // Hide modal after 2 seconds
    setTimeout(() => {
      setShowModal(false);
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 p-6 rounded-lg shadow-lg">
      {showModal && <Modal message={modalMessage} closeModal={() => setShowModal(false)} />} {/* Render modal if visible */}

      {!jsonFile && (
        <>
          <div className="mb-4">
            <label className="block text-orange-500 font-medium mb-2">Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter proposal title"
            />
          </div>

          <div className="mb-4">
            <label className="block text-orange-500 font-medium mb-2">Description:</label>
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
              required
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
        </>
      )}

      <div className="mb-4">
        <label className="block text-orange-500 font-medium mb-2">Upload JSON File (Optional):</label>
        <input
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        {jsonFile && <p className="text-orange-500 mt-2">File selected: {jsonFile.name}</p>}
      </div>

      {validationError && (
        <div className="text-red-500 font-medium mb-4">
          {validationError}
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
