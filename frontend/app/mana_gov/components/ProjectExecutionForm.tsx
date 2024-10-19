import { useState } from 'react';
import { ProjectExecution, TaskExecution } from './types'; // Make sure to import the types

interface Props {
  addProjectExecution: (projectExecution: ProjectExecution) => void;
  projectPlans: { id: number; projectName: string }[];
}

const ProjectExecutionForm = ({ addProjectExecution, projectPlans }: Props) => {
  const [selectedProjectPlanId, setSelectedProjectPlanId] = useState<number | null>(null);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setJsonFile(file);
  };

  // Function to validate the structure and data types of the project execution JSON
  const validateProjectExecutionJson = (json: any): string | null => {
    if (typeof json !== 'object' || json === null) {
      return 'Invalid project execution format. Expected an object.';
    }

    if (typeof json.projectPlanId !== 'number') {
      return 'Invalid or missing "projectPlanId".';
    }

    if (!Array.isArray(json.tasks)) {
      return 'Invalid project execution format. Expected an array of tasks.';
    }

    for (const task of json.tasks) {
      if (typeof task.id !== 'number') {
        return 'Invalid or missing "id" for task.';
      }
      if (typeof task.taskPlanId !== 'number') {
        return 'Invalid or missing "taskPlanId" for task.';
      }
      if (typeof task.actualManaHours !== 'number') {
        return 'Invalid or missing "actualManaHours" for task.';
      }
    }

    if (!Array.isArray(json.peerVotes)) {
      return 'Invalid project execution format. Expected an array of peer votes.';
    }

    for (const vote of json.peerVotes) {
      if (typeof vote.id !== 'number') {
        return 'Invalid or missing "id" for peer vote.';
      }
      if (typeof vote.userId !== 'number') {
        return 'Invalid or missing "userId" for peer vote.';
      }
      if (typeof vote.vote !== 'boolean') {
        return 'Invalid or missing "vote" for peer vote.';
      }
    }

    return null; // No validation errors
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProjectPlanId) {
      setValidationError('Please select a project plan.');
      return;
    }

    if (!jsonFile) {
      setValidationError('Please upload a valid project execution JSON file.');
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
    const validationMessage = validateProjectExecutionJson(parsedJson);
    if (validationMessage) {
      setValidationError(validationMessage);
      return;
    }

    const projectExecution: ProjectExecution = {
      projectPlanId: selectedProjectPlanId,
      actualManaHours: parsedJson.actualManaHours,
      tasks: parsedJson.tasks as TaskExecution[], // Assuming tasks are structured like TaskExecution
      peerVotes: parsedJson.peerVotes, // Assuming peerVotes are already structured correctly
      id: parsedJson.id || 0, // Default ID if not provided
    };

    addProjectExecution(projectExecution);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 p-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <label className="block text-orange-500 font-medium mb-2">Select Project Plan:</label>
        <select
          value={selectedProjectPlanId || ''}
          onChange={(e) => setSelectedProjectPlanId(Number(e.target.value))}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="" disabled>Select a project plan</option>
          {projectPlans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.projectName}
            </option>
          ))}
        </select>
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
        Submit Project Execution
      </button>
    </form>
  );
};

export default ProjectExecutionForm;
