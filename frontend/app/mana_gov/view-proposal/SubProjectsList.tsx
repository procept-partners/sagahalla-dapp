'use client';

import React from 'react';
import { SubProject, Epic, Task, RolesManaHour } from '@prisma/client';

interface SubProjectsListProps {
    subProjects: (SubProject & {
        epics: (Epic & {
            tasks: (Task & {
                rolesManaHours: RolesManaHour[];
            })[];
        })[];
    })[];
}

const SubProjectsList: React.FC<SubProjectsListProps> = ({ subProjects }) => {
    return (
        <div>
            <h3 className="mt-4 text-lg font-semibold">Sub-Projects:</h3>
            {subProjects.length === 0 ? (
                <p>No sub-projects found for this proposal.</p>
            ) : (
                <ul className="ml-6 list-inside list-disc">
                    {subProjects.map((subProject) => (
                        <li key={subProject.id}>
                            <h4 className="text-md font-medium">{subProject.subProjectName}</h4>
                            <EpicsList epics={subProject.epics} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const EpicsList: React.FC<{ epics: (Epic & { tasks: Task[] })[] }> = ({ epics }) => (
    <div>
        <h5 className="mt-2 text-sm font-semibold">Epics:</h5>
        {epics.length === 0 ? (
            <p className="ml-4">No epics found for this sub-project.</p>
        ) : (
            <ul className="ml-6 list-inside list-disc">
                {epics.map((epic) => (
                    <li key={epic.id}>
                        <span className="font-medium">{epic.epicName}</span>
                        <TasksList tasks={epic.tasks as any} />
                    </li>
                ))}
            </ul>
        )}
    </div>
);

const TasksList: React.FC<{ tasks: (Task & { rolesManaHours: RolesManaHour[] })[] }> = ({ tasks }) => (
    <div>
        <h6 className="mt-2 text-xs font-semibold">Tasks:</h6>
        {tasks.length === 0 ? (
            <p className="ml-4">No tasks found for this epic.</p>
        ) : (
            <ul className="ml-6 list-inside list-disc">
                {tasks.map((task) => (
                    <li key={task.id}>
                        <span className="font-medium">{task.taskName}</span> - MANA Allocated: {task.manaTokenAllocated}
                        <RolesManaHoursList rolesManaHours={task.rolesManaHours} />
                    </li>
                ))}
            </ul>
        )}
    </div>
);

const RolesManaHoursList: React.FC<{ rolesManaHours: RolesManaHour[] }> = ({ rolesManaHours }) => (
    <div>
        <h6 className="mt-2 text-xs font-semibold">Roles and Mana Hours:</h6>
        {rolesManaHours.length === 0 ? (
            <p className="ml-4">No roles and mana hours found for this task.</p>
        ) : (
            <ul className="ml-6 list-inside list-disc">
                {rolesManaHours.map((roleManaHour) => (
                    <li key={roleManaHour.id}>
                        <span className="font-medium">{roleManaHour.roleName}</span> - Mana Hours: {roleManaHour.manaHours}
                    </li>
                ))}
            </ul>
        )}
    </div>
);

export default SubProjectsList;
