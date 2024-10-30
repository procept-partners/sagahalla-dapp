'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import { createSubProject } from "@/lib/actions";


interface CreateSubProjectProps {
    proposalId: number;
}

interface RoleManaHour {
    roleName: string;
    manaHours: number;
}

interface Task {
    taskName: string;
    manaTokenAllocated: number;
    rolesManaHours: RoleManaHour[];
}

interface Epic {
    epicName: string;
    tasks: Task[];
}

export default function CreateSubProjectForm({ proposalId }: any) {

    const [subProjectName, setSubProjectName] = useState('');
    const [error, setError] = useState(false);
    const [message, setMessage] = useState<string | undefined>('');



    useEffect(() => {
        setProjectId(proposalId);
    }, [proposalId]);
    const [ProjectId, setProjectId] = useState(proposalId);
    const [epics, setEpics] = useState<Epic[]>([{ epicName: '', tasks: [] }]);

    const addEpic = () => {
        setEpics([...epics, { epicName: '', tasks: [] }]);
    };

    const removeEpic = (epicIndex: number) => {
        const newEpics = [...epics];
        newEpics.splice(epicIndex, 1);
        setEpics(newEpics);
    };

    const addTask = (epicIndex: number) => {
        const newEpics = [...epics];
        newEpics[epicIndex].tasks.push({ taskName: '', manaTokenAllocated: 0, rolesManaHours: [] });
        setEpics(newEpics);
    };

    const removeTask = (epicIndex: number, taskIndex: number) => {
        const newEpics = [...epics];
        newEpics[epicIndex].tasks.splice(taskIndex, 1);
        setEpics(newEpics);
    };

    const addRoleManaHour = (epicIndex: number, taskIndex: number) => {
        const newEpics = [...epics];
        newEpics[epicIndex].tasks[taskIndex].rolesManaHours.push({ roleName: '', manaHours: 0 });
        setEpics(newEpics);
    };

    const removeRoleManaHour = (epicIndex: number, taskIndex: number, roleIndex: number) => {
        const newEpics = [...epics];
        newEpics[epicIndex].tasks[taskIndex].rolesManaHours.splice(roleIndex, 1);
        setEpics(newEpics);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = {
            proposalId: ProjectId,
            subProjectName: subProjectName,
            epics: epics.map((epic) => ({
                epicName: epic.epicName,
                tasks: epic.tasks.map((task) => ({
                    taskName: task.taskName,
                    manaTokenAllocated: task.manaTokenAllocated,
                    rolesManaHours: task.rolesManaHours,
                })),
            })),
        };

        const result = await createSubProject(formData);
        if (result.success) {
            // Handle success (e.g., show a success message, reset form, redirect)
            console.log(result.message);
            console.log(result.data);
            setError(false);
            setMessage(result.message);

            // Reset the form fields
            setProjectId(proposalId); // Assuming you want to keep the original proposalId
            setSubProjectName('');
            setEpics([{ epicName: '', tasks: [] }]);
        } else {
            // Handle error (e.g., show an error message)
            setError(true);
            console.error(result.message);
        }
    };


    return (
        <div className="mx-auto max-w-4xl rounded-lg bg-amber-50 p-6 shadow-md">
            <h3 className="mb-6 text-2xl font-bold text-amber-900">Create Sub-Project</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="subProjectId" className="mb-1 hidden text-sm font-medium text-amber-700">Project Id:</label>
                    <input
                        type="text"
                        id="subProjectId"
                        value={ProjectId}
                        onChange={(e) => setProjectId(e.target.value)}
                        required
                        className="hidden w-full rounded-md border border-amber-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </div>

                <div>
                    <label htmlFor="subProjectName" className="mb-1 block text-sm font-medium text-amber-700">Sub-Project Name:</label>
                    <input
                        type="text"
                        id="subProjectName"
                        value={subProjectName}
                        onChange={(e) => setSubProjectName(e.target.value)}
                        required
                        className="w-full rounded-md border border-amber-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </div>

                {epics.map((epic, epicIndex) => (
                    <div key={epicIndex} className="rounded-md bg-amber-100 p-4">
                        <input type="hidden" name={`epics[${epicIndex}].epicIndex`} value={epicIndex} />
                        <div className="flex justify-between">
                            <h4 className="mb-4 text-xl font-semibold text-amber-900">Epic {epicIndex + 1}</h4>
                            <button type="button" onClick={() => removeEpic(epicIndex)} className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">Remove Epic</button>
                        </div>
                        <div className="mb-4">
                            <label htmlFor={`epicName-${epicIndex}`} className="mb-1 block text-sm font-medium text-amber-700">Epic Name:</label>
                            <input
                                type="text"
                                id={`epicName-${epicIndex}`}
                                value={epic.epicName}
                                onChange={(e) => {
                                    const newEpics = [...epics];
                                    newEpics[epicIndex].epicName = e.target.value;
                                    setEpics(newEpics);
                                }}
                                required
                                className="w-full rounded-md border border-amber-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>

                        {epic.tasks.map((task, taskIndex) => (
                            <div key={taskIndex} className="mb-4 rounded-md bg-white p-4">
                                <input type="hidden" name={`epics[${epicIndex}].tasks[${taskIndex}].taskIndex`} value={taskIndex} />

                                <div className="flex justify-between">
                                    <h5 className="mb-3 text-lg font-medium text-amber-900">Task {taskIndex + 1}</h5>
                                    <button type="button" onClick={() => removeTask(epicIndex, taskIndex)} className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">Remove Task</button>
                                </div>
                                <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label htmlFor={`taskName-${epicIndex}-${taskIndex}`} className="mb-1 block text-sm font-medium text-amber-700">Task Name:</label>
                                        <input
                                            type="text"
                                            id={`taskName-${epicIndex}-${taskIndex}`}
                                            value={task.taskName}
                                            onChange={(e) => {
                                                const newEpics = [...epics];
                                                newEpics[epicIndex].tasks[taskIndex].taskName = e.target.value;
                                                setEpics(newEpics);
                                            }}
                                            required
                                            className="w-full rounded-md border border-amber-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`manaTokenAllocated-${epicIndex}-${taskIndex}`} className="mb-1 block text-sm font-medium text-amber-700">Mana Token Allocated:</label>
                                        <input
                                            type="number"
                                            id={`manaTokenAllocated-${epicIndex}-${taskIndex}`}
                                            value={task.manaTokenAllocated}
                                            onChange={(e) => {
                                                const newEpics = [...epics];
                                                newEpics[epicIndex].tasks[taskIndex].manaTokenAllocated = parseFloat(e.target.value);
                                                setEpics(newEpics);
                                            }}
                                            required
                                            className="w-full rounded-md border border-amber-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                </div>

                                {task.rolesManaHours.map((role, roleIndex) => (
                                    <div key={roleIndex} className="mb-4 rounded-md bg-gray-100 p-4">
                                        <input type="hidden" name={`epics[${epicIndex}].tasks[${taskIndex}].rolesManaHours[${roleIndex}].roleIndex`} value={roleIndex} />

                                        <div className="flex justify-between">
                                            <h6 className="mb-3 text-base font-medium text-amber-900">Role {roleIndex + 1}</h6>
                                            <button type="button" onClick={() => removeRoleManaHour(epicIndex, taskIndex, roleIndex)} className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">Remove Role</button>
                                        </div>
                                        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div>
                                                <label htmlFor={`roleName-${epicIndex}-${taskIndex}-${roleIndex}`} className="mb-1 block text-sm font-medium text-amber-700">Role Name:</label>
                                                <input
                                                    type="text"
                                                    id={`roleName-${epicIndex}-${taskIndex}-${roleIndex}`}
                                                    value={role.roleName}
                                                    onChange={(e) => {
                                                        const newEpics = [...epics];
                                                        newEpics[epicIndex].tasks[taskIndex].rolesManaHours[roleIndex].roleName = e.target.value;
                                                        setEpics(newEpics);
                                                    }}
                                                    required
                                                    className="w-full rounded-md border border-amber-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor={`manaHours-${epicIndex}-${taskIndex}-${roleIndex}`} className="mb-1 block text-sm font-medium text-amber-700">Mana Hours:</label>
                                                <input
                                                    type="number"
                                                    id={`manaHours-${epicIndex}-${taskIndex}-${roleIndex}`}
                                                    value={role.manaHours}
                                                    onChange={(e) => {
                                                        const newEpics = [...epics];
                                                        newEpics[epicIndex].tasks[taskIndex].rolesManaHours[roleIndex].manaHours = parseInt(e.target.value);
                                                        setEpics(newEpics);
                                                    }}
                                                    required
                                                    className="w-full rounded-md border border-amber-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={() => addRoleManaHour(epicIndex, taskIndex)} className="mt-2 rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">Add Role Mana Hour</button>
                            </div>
                        ))}
                        <button type="button" onClick={() => addTask(epicIndex)} className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Add Task</button>
                    </div>
                ))}
                <div className="flex justify-between">
                    <button type="button" onClick={addEpic} className="rounded-md bg-purple-500 px-4 py-2 text-white hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50">Add Epic</button>
                    <button type="submit" className="rounded-md bg-amber-600 px-6 py-3 font-semibold text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50">Create Sub-Project</button>
                </div>
                {error && <div className="font-semibold text-red-500">{message}</div>}
                {message && <div className="font-semibold text-green-500">{message}</div>}
            </form>
        </div>

    );
};


