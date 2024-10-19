import { useState } from 'react';
import { Project, Task } from '../types/types'; // Import Project and Task types

interface Props {
  projects: Project[];
  userId: number; // The logged-in user's ID
}

const AssignedTasks = ({ projects = [], userId }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter projects where the user has assigned mana hours
  const filteredProjects = projects.filter((project) =>
    project.manaHours?.some((mana) => mana.userId === userId)
  );

  // Filter projects based on the search query for project titles
  const filteredTasks = filteredProjects.filter((project) =>
    project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
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
      </div>

      {/* Project List with Tasks */}
      {filteredTasks.length > 0 ? (
        <div>
          {filteredTasks.map((project) => (
            <div key={project.id} className="mb-6">
              {/* Project Details */}
              <h3 className="font-semibold text-orange-500">
                {project.projectName}
              </h3>

              {/* SubProject, Epic (add these fields to Project if needed) */}
              {project.subProjects && project.subProjects.map((subProject) => (
                <div key={subProject.id}>
                  <h4 className="text-orange-300">
                    {subProject.subProjectName}
                  </h4>
                  {subProject.epics && subProject.epics.map((epic) => (
                    <div key={epic.id}>
                      <h5 className="text-orange-200">{epic.epicName}</h5>

                      {/* Task List */}
                      <ul className="list-disc list-inside">
                        {epic.tasks
                          .filter((task: Task) => task.assignedTo === userId) // Only show tasks assigned to the user
                          .map((task: Task) => (
                            <li key={task.id} className="ml-4 text-white">
                              {task.taskName}
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
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
