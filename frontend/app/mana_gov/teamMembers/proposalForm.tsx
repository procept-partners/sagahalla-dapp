import { useState } from 'react';
import useProjects from './useProjects'; 

interface Proposal {
  projectId: number; 
  title: string;
  description: string;
  hoursRequired: number;
  tokenPerHour: number;
}

interface Props {
  addProposal: (proposal: Omit<Proposal, 'yesVotes' | 'noVotes' | 'totalTokensAllocated' | 'isEnded'>) => void;
}

const ProposalForm = ({ addProposal }: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hoursRequired, setHoursRequired] = useState(0);
  const [tokenPerHour, setTokenPerHour] = useState(0);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null); 
  const projects = useProjects(); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProjectId === null) {
      alert("Please select a project");
      return;
    }
    
    addProposal({ 
      projectId: selectedProjectId,
      title, 
      description, 
      hoursRequired, 
      tokenPerHour, 
    });
    
    setTitle('');
    setDescription('');
    setHoursRequired(0);
    setTokenPerHour(0);
    setSelectedProjectId(null);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-20 p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mt-10 mb-6 text-center text-gray-800">Add Proposal</h1>

      {/* Project Selection */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Select Project:</label>
        <select 
          value={selectedProjectId || ''} 
          onChange={(e) => setSelectedProjectId(Number(e.target.value))}
          className="w-full px-4 py-2 border rounded-lg"
          required
        >
          <option value="" disabled>Select a project</option>
          {projects.map((project) => (
            <option key={project.project_id} value={project.project_id}>
              {project.project_name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter proposal title"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe the proposal"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Hours Required:</label>
        <input
          type="number"
          value={hoursRequired}
          onChange={(e) => setHoursRequired(Number(e.target.value))}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter hours required"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Token Per Hour:</label>
        <input
          type="number"
          value={tokenPerHour}
          onChange={(e) => setTokenPerHour(Number(e.target.value))}
          required
          className="mb-10 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter tokens per hour"
        />
      </div>

      <button
        type="submit"
        className="mt-10 w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
      >
        Submit Proposal
      </button>
    </form>
  );
};

export default ProposalForm;
