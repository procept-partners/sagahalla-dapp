import { useState } from 'react';
import ProjectDetailsModal from './ProjectDetailsModal';
import { Project } from '../types/types'; // Assuming you have a Project type defined

interface Props {
  projects: Project[];
  userId: number; // Assuming you pass a logged-in user's ID
}

const ProjectPlanningList = ({ projects, userId }: Props) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  // Filtered projects based on search query
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2>Project Planning</h2>

      {/* Search Box */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by project title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="ml-4 px-3 py-2 border rounded-lg"
        />
        <button className="ml-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600">
          Search
        </button>
      </div>

      {/* Project List */}
      <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Title</th>
            <th className="px-6 py-3 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Total Mana Hours</th>
            <th className="px-6 py-3 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Your Mana Hours</th>
            <th className="px-6 py-3 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Voting Power</th>
            <th className="px-6 py-3 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((project) => {
            const userManaHours = project.manaHours.find((mana) => mana.userId === userId)?.hours || 0;

            return (
              <tr key={project.id} className="border-b border-gray-200">
                {/* Project Title */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <button onClick={() => openModal(project)} className="text-blue-500 hover:underline">
                    {project.title}
                  </button>
                </td>

                {/* Total Mana Hours */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {project.totalManaHours}
                </td>

                {/* User's Allocated Mana Hours */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {userManaHours}
                </td>

                {/* Project Voting Power */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {project.votingPower}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => openModal(project)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Project details' modal */}
      {isModalOpen && selectedProject && (
        <ProjectDetailsModal project={selectedProject} closeModal={closeModal} />
      )}
    </div>
  );
};

export default ProjectPlanningList;
