import { useState } from 'react';

// Define the type for developerHoursAllocated (this can be adjusted as per the actual structure)
interface DeveloperHoursAllocated {
  id: number;
  taskName: string;
  roleName: string;
  manaHours: number;
}

interface Props {
  addProjectPlan: (projectPlan: { proposalId: number; projectName: string; developerHoursAllocated: DeveloperHoursAllocated[] }) => void;
  proposals: { id: number; title: string }[];
}

const ProjectPlanForm = ({ addProjectPlan, proposals }: Props) => {
  const [selectedProposalId, setSelectedProposalId] = useState<number | null>(null);
  const [projectName, setProjectName] = useState('');
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setJsonFile(file);
  };

  // Function to validate the structure and data types of the project plan JSON
  const validateProjectPlanJson = (json: any): string | null => {
    if (!Array.isArray(json)) {
      return 'Invalid project plan format. Expected an array of developer hours.';
    }
    
    for (const task of json) {
      if (typeof task.id !== 'number') {
        return 'Invalid or missing "id" for task.';
      }
      if (typeof task.taskName !== 'string') {
        return 'Invalid or missing "taskName" for task.';
      }
      if (typeof task.roleName !== 'string') {
        return 'Invalid or missing "roleName" for task.';
      }
      if (typeof task.manaHours !== 'number') {
        return 'Invalid or missing "manaHours" for task.';
      }
    }
    return null; // No validation errors
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProposalId) {
      setValidationError('Please select a proposal.');
      return;
    }

    if (!jsonFile) {
      setValidationError('Please upload a valid project plan JSON file.');
      return;
    }

    // Handle reading and validating the JSON file
    const fileContent = await jsonFile.text();
    let parsedJson;
    try {
      parsedJson = JSON.parse(fileContent);
    } catch (err) {
      setValidationError('Invalid JSON file format.');
      return;
    }

    // Validate the JSON structure
    const validationMessage = validateProjectPlanJson(parsedJson);
    if (validationMessage) {
      setValidationError(validationMessage);
      return;
    }

    const projectPlan = {
      proposalId: selectedProposalId,
      projectName,
      developerHoursAllocated: parsedJson as DeveloperHoursAllocated[],  // Assuming developer hours are in the JSON file
    };

    addProjectPlan(projectPlan);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 p-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <label className="block text-orange-500 font-medium mb-2">Select Proposal:</label>
        <select
          value={selectedProposalId || ''}
          onChange={(e) => setSelectedProposalId(Number(e.target.value))}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="" disabled>Select a proposal</option>
          {proposals.map((proposal) => (
            <option key={proposal.id} value={proposal.id}>
              {proposal.title}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-orange-500 font-medium mb-2">Project Name:</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Enter project name"
        />
      </div>

      <div className="mb-4">
        <label className="block text-orange-500 font-medium mb-2">Upload JSON File:</label>
        <input
          type="file"
          accept=".json"
          onChange={handleFileChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
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
        Submit Project Plan
      </button>
    </form>
  );
};

export default ProjectPlanForm;
