import { useState } from 'react';
import { Project } from '../types/types'; // Assuming you have a Project type defined

interface Props {
  projects: Project[];
  userId: number; // Assuming the logged-in user's ID is passed
}

const AssignedTasks = ({ projects = [], userId }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter projects where the user has assigned mana hours
  const filteredProjects = projects.filter((project) =>
    project?.manaHours?.some((mana) => mana.userId === userId)
  );

  // Filter based on the search query
  const filteredTasks = filteredProjects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="assigned-tasks">
      <h2 className="text-orange-500">Assigned Tasks</h2>

      {/* Search Box */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by project title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 border border-orange-500 rounded-lg bg-purple-900 text-white"
        />
        <button className="ml-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
          Search
        </button>
      </div>

      {/* Project List with Tasks */}
      {filteredTasks.length > 0 ? (
        <div>
          {filteredTasks.map((project) => (
            <div key={project.id} className="mb-6">
              {/* Project, Subproject, Epic */}
              <h3 className="font-semibold text-orange-500">
                {project.title} > {project.subproject} > {project.epic}
              </h3>

              {/* Task List */}
              <ul className="list-disc list-inside">
                {project.tasks
                  .filter((task) => task.assignedTo === userId) // Only show tasks assigned to the user
                  .map((task) => (
                    <li key={task.id} className="ml-4 text-white">
                      {task.title}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white">No tasks assigned to you.</p>
      )}
    </div>
  );
};

export default AssignedTasks;

