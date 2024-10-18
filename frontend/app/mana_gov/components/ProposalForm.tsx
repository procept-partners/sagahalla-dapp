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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Move the submitProposal function inside the ProposalForm component
  const submitProposal = async (proposal: any) => {
    try {
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proposal),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit the proposal');
      }

      // If successful, show a success message and reset the form
      setSuccessMessage('Proposal submitted successfully!');
      resetForm();
    } catch (error) {
      setValidationError((error as Error).message || 'Error submitting the proposal');
    }
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setManaHoursBudgeted(0);
    setManaTokenAllocated(0);
    setTargetApprovalDate(undefined);
    setJsonFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Clear previous success/error messages
    setValidationError(null);
    setSuccessMessage(null);
  
    // If JSON file is uploaded, parse it and submit it
    if (jsonFile) {
      try {
        const fileContent = await jsonFile.text();
        let parsedJson;
  
        // Attempt to parse the JSON file with verbose error handling
        try {
          parsedJson = JSON.parse(fileContent);
        } catch (err) {
          setValidationError('Error parsing the JSON file: ' + (err as Error).message);
          console.log('JSON Parse Error:', err); // Log error to console for debugging
          return;
        }
  
        // Validate the JSON and output detailed errors if invalid
        const validationMessage = validateProposalJson(parsedJson);
        if (validationMessage) {
          setValidationError(validationMessage); // Set the validation error message
          console.log('Validation Error:', validationMessage); // Log validation error
          return;
        }
  
        // Submit the valid JSON data to the backend
        await submitProposal(parsedJson);
      } catch (err) {
        console.error('Error handling JSON file:', err);
        setValidationError('Invalid JSON file. Please ensure the file structure is correct and properly formatted.');
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
      await submitProposal(proposal);
    }
  };
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setJsonFile(file);
  };

  // Helper function to validate the main Proposal object and nested structures
  const validateProposalJson = (json: any): string | null => {
    console.log('Validating JSON:', json); // Log the JSON object to inspect its structure
  
    // Validate top-level fields
    if (typeof json.id !== 'number') {
      console.log('Validation failed: Invalid or missing "id"');
      return 'Invalid or missing "id" in proposal.';
    }
    if (typeof json.title !== 'string') {
      console.log('Validation failed: Invalid or missing "title"');
      return 'Invalid or missing "title" in proposal.';
    }
    if (typeof json.manaTokenAllocated !== 'number') {
      console.log('Validation failed: Invalid or missing "manaTokenAllocated"');
      return 'Invalid or missing "manaTokenAllocated" in proposal.';
    }
    if (typeof json.submittedBy !== 'string') {
      console.log('Validation failed: Invalid or missing "submittedBy"');
      return 'Invalid or missing "submittedBy" in proposal.';
    }
    if (typeof json.manaHoursBudgeted !== 'number') {
      console.log('Validation failed: Invalid or missing "manaHoursBudgeted"');
      return 'Invalid or missing "manaHoursBudgeted" in proposal.';
    }
    
    // Handling targetApprovalDate: Check if it's either null or a valid date
    if (json.targetApprovalDate !== null && json.targetApprovalDate !== undefined && isNaN(Date.parse(json.targetApprovalDate))) {
      console.log('Validation failed: Invalid "targetApprovalDate"');
      return 'Invalid "targetApprovalDate" in proposal.';
    }
  
    // Validate subProjects if they exist
    if (json.subProjects && !validateSubProjects(json.subProjects)) {
      return 'Invalid subProjects structure in proposal.';
    }
  
    // Validate budgetItems if they exist
    if (json.budgetItems && !validateProposalBudgets(json.budgetItems)) {
      return 'Invalid budget structure in proposal.';
    }
  
    return null; // No validation errors
  };
  

  // Helper function to validate subProjects
  const validateSubProjects = (subProjects: any[]): boolean => {
    console.log('Validating SubProjects:', subProjects); // Log subProjects for debugging

    for (const subProject of subProjects) {
      if (typeof subProject.id !== 'number') {
        setValidationError('Invalid or missing "id" in SubProject.');
        console.log('Invalid or missing "id" in SubProject:', subProject);
        return false;
      }
      if (typeof subProject.proposalId !== 'number') {
        setValidationError('Invalid or missing "proposalId" in SubProject.');
        console.log('Invalid or missing "proposalId" in SubProject:', subProject);
        return false;
      }
      if (typeof subProject.subProjectName !== 'string') {
        setValidationError('Invalid or missing "subProjectName" in SubProject.');
        console.log('Invalid or missing "subProjectName" in SubProject:', subProject);
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
    console.log('Validating Epics:', epics); // Log epics for debugging

    for (const epic of epics) {
      if (typeof epic.id !== 'number') {
        setValidationError('Invalid or missing "id" in Epic.');
        console.log('Invalid or missing "id" in Epic:', epic);
        return false;
      }
      if (typeof epic.subProjectId !== 'number') {
        setValidationError('Invalid or missing "subProjectId" in Epic.');
        console.log('Invalid or missing "subProjectId" in Epic:', epic);
        return false;
      }
      if (typeof epic.epicName !== 'string') {
        setValidationError('Invalid or missing "epicName" in Epic.');
        console.log('Invalid or missing "epicName" in Epic:', epic);
        return false;
      }
      if (epic.tasks && !validateTasks(epic.tasks)) {
        return false;
      }
    }
    return true;
  };

  // Helper function to validate tasks
  const validateTasks = (tasks: any[]): boolean => {
    console.log('Validating Tasks:', tasks); // Log tasks for debugging

    for (const task of tasks) {
      if (typeof task.id !== 'number') {
        setValidationError('Invalid or missing "id" in Task.');
        console.log('Invalid or missing "id" in Task:', task);
        return false;
      }
      if (typeof task.epicId !== 'number') {
        setValidationError('Invalid or missing "epicId" in Task.');
        console.log('Invalid or missing "epicId" in Task:', task);
        return false;
      }
      if (typeof task.taskName !== 'string') {
        setValidationError('Invalid or missing "taskName" in Task.');
        console.log('Invalid or missing "taskName" in Task:', task);
        return false;
      }
      if (task.rolesManaHours && !validateRoleManaHours(task.rolesManaHours)) {
        return false;
      }
    }
    return true;
  };

  // Helper function to validate rolesManaHours
  const validateRoleManaHours = (rolesManaHours: any[]): boolean => {
    console.log('Validating RoleManaHours:', rolesManaHours); // Log rolesManaHours for debugging

    for (const role of rolesManaHours) {
      if (typeof role.id !== 'number') {
        setValidationError('Invalid or missing "id" in RoleManaHours.');
        console.log('Invalid or missing "id" in RoleManaHours:', role);
        return false;
      }
      if (typeof role.taskId !== 'number') {
        setValidationError('Invalid or missing "taskId" in RoleManaHours.');
        console.log('Invalid or missing "taskId" in RoleManaHours:', role);
        return false;
      }
      if (typeof role.roleName !== 'string') {
        setValidationError('Invalid or missing "roleName" in RoleManaHours.');
        console.log('Invalid or missing "roleName" in RoleManaHours:', role);
        return false;
      }
      if (typeof role.manaHours !== 'number') {
        setValidationError('Invalid or missing "manaHours" in RoleManaHours.');
        console.log('Invalid or missing "manaHours" in RoleManaHours:', role);
        return false;
      }
    }
    return true;
  };

  // Helper function to validate proposalBudgets
  const validateProposalBudgets = (budgets: any[]): boolean => {
    console.log('Validating ProposalBudgets:', budgets); // Log budgets for debugging

    for (const budget of budgets) {
      if (typeof budget.id !== 'number') {
        setValidationError('Invalid or missing "id" in ProposalBudget.');
        console.log('Invalid or missing "id" in ProposalBudget:', budget);
        return false;
      }
      if (typeof budget.proposalId !== 'number') {
        setValidationError('Invalid or missing "proposalId" in ProposalBudget.');
        console.log('Invalid or missing "proposalId" in ProposalBudget:', budget);
        return false;
      }
      if (typeof budget.roleName !== 'string') {
        setValidationError('Invalid or missing "roleName" in ProposalBudget.');
        console.log('Invalid or missing "roleName" in ProposalBudget:', budget);
        return false;
      }
      if (typeof budget.budgetUsd !== 'number') {
        setValidationError('Invalid or missing "budgetUsd" in ProposalBudget.');
        console.log('Invalid or missing "budgetUsd" in ProposalBudget:', budget);
        return false;
      }
      if (typeof budget.budgetMana !== 'number') {
        setValidationError('Invalid or missing "budgetMana" in ProposalBudget.');
        console.log('Invalid or missing "budgetMana" in ProposalBudget:', budget);
        return false;
      }
    }
    return true;
  };

  return (
    <form onSubmit={handleSubmit} className="mt-20 p-8 rounded-lg shadow-lg">
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
