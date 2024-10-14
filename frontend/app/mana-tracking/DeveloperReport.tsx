'use client'

// DeveloperReport.tsx
import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from 'react';

// Define types for the data structure
interface SubProject {
    sub_project_name: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined;
    epics: Epic[];
}

interface Epic {
    epic_name: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined;
    tasks: Task[];
}

interface Task {
    task_name: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined;
    role: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined;
    roles_mana_hours: {
        budgeted: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined;
        actual: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined;
    };
}

interface DeveloperReportProps {
    data: any;
    devNames: string[];
}

const DeveloperReport = ({ data, devNames }: DeveloperReportProps) => {
    const [selectedDev, setSelectedDev] = useState<string | null>(null);

    return (
        <div className="rounded-lg bg-amber-300 p-4 shadow-md dark:bg-gray-800">
            {/* Dropdown to select developer */}
            <div className="mb-4">
                <label htmlFor="developer-select" className="mb-2 block font-bold text-gray-700 dark:text-gray-300">
                    Select Developer:
                </label>
                <select
                    id="developer-select"
                    className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    value={selectedDev || ''}
                    onChange={(e) => setSelectedDev(e.target.value)}
                >
                    <option value="">Select a Developer</option>
                    {devNames.map((name) => (
                        <option key={name} value={name}>
                            {name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Render selected developer's data */}
            {selectedDev && (
                <div className="mb-6">
                    <h2 className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-200">
                        {data[selectedDev].developer_name} - {data[selectedDev].project_name}
                    </h2>
                    <p className="text-lg text-gray-700 dark:text-gray-400">
                        Total Budgeted Hours: {data[selectedDev].totals.total_budgeted_hours}
                    </p>
                    <p className="text-lg text-gray-700 dark:text-gray-400">
                        Total Actual Hours: {data[selectedDev].totals.total_actual_hours}
                    </p>

                    {/* Render sub-projects */}
                    {data[selectedDev].sub_projects.map((subProject: SubProject, index: Key | null | undefined) => (
                        <div key={index} className="mb-4">
                            <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-gray-200">
                                {subProject.sub_project_name}
                            </h3>
                            {/* Render epics */}
                            {subProject.epics.map((epic: Epic, epicIndex: Key | null | undefined) => (
                                <div key={epicIndex} className="mb-3">
                                    <h4 className="mb-1 text-lg font-bold text-gray-800 dark:text-gray-200">
                                        {epic.epic_name}
                                    </h4>
                                    {/* Render tasks */}
                                    <ul className="list-inside list-disc text-lg text-gray-700 dark:text-gray-400">
                                        {epic.tasks.map((task: Task, taskIndex: Key | null | undefined) => (
                                            <li key={taskIndex}>
                                                {task.task_name} - {task.role}
                                                <br />
                                                Budgeted Hours: {task.roles_mana_hours.budgeted}
                                                <br />
                                                Actual Hours: {task.roles_mana_hours.actual}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DeveloperReport;
