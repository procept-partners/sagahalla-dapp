import { useState } from 'react';
import ProjectDetailsModal from './ProjectDetailsModal';
import { Project } from '../types/types'; // Assuming you have a Project type defined

interface Props {
  projects: Project[];
  userId: number; // Assuming the logged-in user's ID is passed
}

const ProjectList = ({ projects, userId }: Props) => {
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
      <h2 className="text-orange-500">Projects</h2>

      {/* Filter Section */}
      <div className="mb-4">
        <label htmlFor="search" className="text-orange-500 mr-4">Search by project title:</label>
        <input
          type="text"
          id="search"
          placeholder="Search by project title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 border border-orange-500 rounded-lg bg-purple-900 text-white"
        />
      </div>

      {/* Project List */}
      <table className="min-w-full bg-purple-900 rounded-lg">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-orange-500 text-left text-sm font-medium text-orange-500">
              Title
            </th>
            <th className="px-6 py-3 border-b-2 border-orange-500 text-left text-sm font-medium text-orange-500">
              Total Mana Hours
            </th>
            <th className="px-6 py-3 border-b-2 border-orange-500 text-left text-sm font-medium text-orange-500">
              Your Mana Hours
            </th>
            <th className="px-6 py-3 border-b-2 border-orange-500 text-left text-sm font-medium text-orange-500">
              Voting Power
            </th>
            <th className="px-6 py-3 border-b-2 border-orange-500 text-left text-sm font-medium text-orange-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((project) => {
            const userManaHours = project.manaHours?.find((mana) => mana.userId === userId)?.hours || 0;

            return (
              <tr key={project.id} className="border-b border-gray-200 hover:bg-orange-500 hover:text-white">
                {/* Project Title */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <button onClick={() => openModal(project)} className="text-orange-500 hover:underline">
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
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
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

export default ProjectList;

