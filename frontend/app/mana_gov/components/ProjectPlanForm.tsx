import { useState } from 'react';

interface DeveloperHoursAllocated {
  developerName: string;
  totalEstimatedManaHours: number;
  totalAllocatedMana: number;
  subProjects: SubProjectPlan[];
}

interface SubProjectPlan {
  id: number;
  subProjectName: string;
  epics: EpicPlan[];
}

interface EpicPlan {
  id: number;
  subProjectId: number;
  epicName: string;
  tasks: TaskPlan[];
}

interface TaskPlan {
  id: number;
  epicId: number;
  taskName: string;
  rolesManaHours: TaskRoleManaHours[];
}

interface TaskRoleManaHours {
  roleName: string;
  manaHours: number;
}

interface Props {
  addProjectPlan: (projectPlan: {
    proposalId: number;
    projectName: string;
    developers: DeveloperHoursAllocated[];
  }) => void;
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
    if (!json || typeof json !== 'object' || !json.developers) {
      return 'Invalid project plan format. Expected a JSON object with developer data.';
    }

    if (!Array.isArray(json.developers)) {
      return 'Invalid format for developers. Expected an array of developers.';
    }

    for (const developer of json.developers) {
      if (typeof developer.developerName !== 'string') {
        return 'Invalid or missing "developerName" for developer.';
      }
      if (typeof developer.totalEstimatedManaHours !== 'number') {
        return `Invalid or missing "totalEstimatedManaHours" for ${developer.developerName}.`;
      }
      if (typeof developer.totalAllocatedMana !== 'number') {
        return `Invalid or missing "totalAllocatedMana" for ${developer.developerName}.`;
      }
      if (!Array.isArray(developer.subProjects)) {
        return `Invalid or missing "subProjects" for ${developer.developerName}.`;
      }
      for (const subProject of developer.subProjects) {
        if (typeof subProject.id !== 'number') {
          return `Invalid or missing "id" for subproject of ${developer.developerName}.`;
        }
        if (typeof subProject.subProjectName !== 'string') {
          return `Invalid or missing "subProjectName" for subproject of ${developer.developerName}.`;
        }
        if (!Array.isArray(subProject.epics)) {
          return `Invalid or missing "epics" for subproject of ${developer.developerName}.`;
        }
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
      developers: parsedJson.developers as DeveloperHoursAllocated[], // Assuming developers data in the JSON file
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
