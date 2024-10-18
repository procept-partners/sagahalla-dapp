import { useState } from 'react';

interface Props {
  addProposal: (proposal: { title: string; description: string; manaHoursBudgeted: number; manaTokenAllocated: number; targetApprovalDate: string; submittedBy: string }) => void;
  loggedInUserId: string; // Pass the logged-in user's ID as a prop
}

const ProposalForm = ({ addProposal, loggedInUserId }: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [manaHoursBudgeted, setManaHoursBudgeted] = useState(0);
  const [manaTokenAllocated, setManaTokenAllocated] = useState(0);
  const [targetApprovalDate, setTargetApprovalDate] = useState<string | undefined>(undefined);
  const [jsonFile, setJsonFile] = useState<File | null>(null); // File state
  const [validationError, setValidationError] = useState<string | null>(null); // To store detailed validation errors

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If JSON file is uploaded, parse it and submit it
    if (jsonFile) {
      try {
        const fileContent = await jsonFile.text();
        const parsedJson = JSON.parse(fileContent);

        // Validate the JSON and output detailed errors if invalid
        const validationMessage = validateProposalJson(parsedJson);
        if (validationMessage) {
          setValidationError(validationMessage); // Set the validation error message
          return;
        }

        addProposal(parsedJson);
      } catch (err) {
        console.error('Error parsing JSON file:', err);
        alert('Invalid JSON file. Please ensure the file structure is correct.');
      }
    } else {
      // Submit the form data with the logged-in user ID
      const proposal = {
        title,
        description,
        manaHoursBudgeted,
        manaTokenAllocated,
        targetApprovalDate: targetApprovalDate || '', // Optional
        submittedBy: loggedInUserId, // Automatically set the logged-in user
      };
      addProposal(proposal);

      // Reset form fields
      setTitle('');
      setDescription('');
      setManaHoursBudgeted(0);
      setManaTokenAllocated(0);
      setTargetApprovalDate(undefined);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setJsonFile(file);
  };

  // Helper function to validate the main Proposal object and nested structures
  const validateProposalJson = (json: any): string | null => {
    // Validate top-level fields
    if (typeof json.id !== 'number') return 'Invalid or missing "id" in proposal.';
    if (typeof json.title !== 'string') return 'Invalid or missing "title" in proposal.';
    if (typeof json.mana_tokens_allocated !== 'number') return 'Invalid or missing "mana_tokens_allocated" in proposal.';
    if (typeof json.submitted_by !== 'string') return 'Invalid or missing "submitted_by" in proposal.';
    if (typeof json.mana_hours_budgeted !== 'number') return 'Invalid or missing "mana_hours_budgeted" in proposal.';
    if (json.target_date && isNaN(Date.parse(json.target_date))) return 'Invalid "target_date" in proposal.';

    // Validate sub_projects if they exist
    if (json.sub_projects && !validateSubProjects(json.sub_projects)) {
      return 'SubProjects structure is invalid.';
    }

    // Validate budget_items if they exist
    if (json.budget_items && !validateProposalBudgets(json.budget_items)) {
      return 'Proposal budget structure is invalid.';
    }

    return null; // No validation errors
  };

  // Helper function to validate sub_projects
  const validateSubProjects = (subProjects: any[]): boolean => {
    for (const subProject of subProjects) {
      if (typeof subProject.id !== 'number') {
        setValidationError('Invalid or missing "id" in SubProject.');
        return false;
      }
      if (typeof subProject.proposal_id !== 'number') {
        setValidationError('Invalid or missing "proposal_id" in SubProject.');
        return false;
      }
      if (typeof subProject.sub_project_name !== 'string') {
        setValidationError('Invalid or missing "sub_project_name" in SubProject.');
        return false;
      }
      if (subProject.epics && !validateEpics(subProject.epics)) {
        return false; // Epics validation will set the error
      }
    }
    return true;
  };

  // Helper function to validate epics
  const validateEpics = (epics: any[]): boolean => {
    for (const epic of epics) {
      if (typeof epic.id !== 'number') {
        setValidationError('Invalid or missing "id" in Epic.');
        return false;
      }
      if (typeof epic.sub_project_id !== 'number') {
        setValidationError('Invalid or missing "sub_project_id" in Epic.');
        return false;
      }
      if (typeof epic.epic_name !== 'string') {
        setValidationError('Invalid or missing "epic_name" in Epic.');
        return false;
      }
      if (epic.tasks && !validateTasks(epic.tasks)) {
        return false; // Task validation will set the error
      }
    }
    return true;
  };

  // Helper function to validate tasks
  const validateTasks = (tasks: any[]): boolean => {
    for (const task of tasks) {
      if (typeof task.id !== 'number') {
        setValidationError('Invalid or missing "id" in Task.');
        return false;
      }
      if (typeof task.epic_id !== 'number') {
        setValidationError('Invalid or missing "epic_id" in Task.');
        return false;
      }
      if (typeof task.task_name !== 'string') {
        setValidationError('Invalid or missing "task_name" in Task.');
        return false;
      }
      if (task.roles_mana_hours && !validateRoleManaHours(task.roles_mana_hours)) {
        return false; // RoleManaHours validation will set the error
      }
    }
    return true;
  };

  // Helper function to validate roles_mana_hours
  const validateRoleManaHours = (rolesManaHours: any[]): boolean => {
    for (const role of rolesManaHours) {
      if (typeof role.id !== 'number') {
        setValidationError('Invalid or missing "id" in RoleManaHours.');
        return false;
      }
      if (typeof role.task_id !== 'number') {
        setValidationError('Invalid or missing "task_id" in RoleManaHours.');
        return false;
      }
      if (typeof role.role_name !== 'string') {
        setValidationError('Invalid or missing "role_name" in RoleManaHours.');
        return false;
      }
      if (typeof role.mana_hours !== 'number') {
        setValidationError('Invalid or missing "mana_hours" in RoleManaHours.');
        return false;
      }
    }
    return true;
  };

  // Helper function to validate proposal_budgets
  const validateProposalBudgets = (budgets: any[]): boolean => {
    for (const budget of budgets) {
      if (typeof budget.id !== 'number') {
        setValidationError('Invalid or missing "id" in ProposalBudget.');
        return false;
      }
      if (typeof budget.proposal_id !== 'number') {
        setValidationError('Invalid or missing "proposal_id" in ProposalBudget.');
        return false;
      }
      if (typeof budget.role_name !== 'string') {
        setValidationError('Invalid or missing "role_name" in ProposalBudget.');
        return false;
      }
      if (typeof budget.budget_usd !== 'number') {
        setValidationError('Invalid or missing "budget_usd" in ProposalBudget.');
        return false;
      }
      if (typeof budget.budget_mana !== 'number') {
        setValidationError('Invalid or missing "budget_mana" in ProposalBudget.');
        return false;
      }
    }
    return true;
  };

  return (
    <form onSubmit={handleSubmit} className="mt-20 p-8 rounded-lg shadow-lg">
      {/* Metadata Fields (only visible if no JSON file is uploaded) */}
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
            <label className="block text-orange-500 font-medium mb-2">Mana Token Allocated:</label>
            <input
              type="number"
              value={manaTokenAllocated}
              onChange={(e) => setManaTokenAllocated(Number(e.target.value))}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter amount of mana tokens allocated"
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

      {/* JSON File Upload (Placed at the end of the form) */}
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

      {/* Automatically populate "submittedBy" with logged-in user */}
      <input type="hidden" value={loggedInUserId} />

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
