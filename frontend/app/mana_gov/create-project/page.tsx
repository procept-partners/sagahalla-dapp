'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createProject } from '@/lib/actions';
import { authenticate, logOut } from "@/lib/actions";
import React, { useState } from 'react';

export default function CreateProject() {

    const [message, setMessage] = useState<string | undefined>('');

    // ADD: Use middleware later on
    const [session, setSession] = React.useState(false);
    const [username, setUsername] = React.useState('');
    const [error, setError] = React.useState(false);

    const fetchAuth = async () => {
        setSession((await authenticate()).success);
        setUsername((await authenticate()).user?.username || '');
    };

    React.useEffect(() => { fetchAuth() }, []);


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        console.log(formData.get("submittedBy"));
        console.log(formData.get("title"));

        const result = await createProject(formData);

        if (result.success) {
            console.log("Project created successfully");
            setError(false);
            setMessage(result.message);
        } else {
            setError(true);
            setMessage(result.message);
            console.error(result.message);
        }
    };

    return (
        <>
            {session ? (
                <>
                    <div className="min-h-screen bg-[#270927] px-4 py-8 text-black">
                        <h2 className="mb-6 text-2xl font-bold text-white">Create New Project</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="title" className="block text-sm font-medium text-gray-300">
                                    Title:
                                </Label>
                                <Input
                                    type="text"
                                    id="title"
                                    name="title"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <Label htmlFor="description" className="block text-sm font-medium text-gray-300">
                                    Description:
                                </Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <Label htmlFor="manaTokenAllocated" className="block text-sm font-medium text-gray-300">
                                    MANA Tokens Allocated:
                                </Label>
                                <Input
                                    type="number"
                                    id="manaTokenAllocated"
                                    name="manaTokenAllocated"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <Label htmlFor="manaHoursBudgeted" className="block text-sm font-medium text-gray-300">
                                    MANA Hours Budgeted:
                                </Label>
                                <Input
                                    type="number"
                                    id="manaHoursBudgeted"
                                    name="manaHoursBudgeted"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <Label htmlFor="submittedBy" className="block text-sm font-medium text-gray-300">
                                    Submitted By:
                                </Label>
                                <Input
                                    type="text"
                                    id="submittedBy"
                                    name="submittedBy"
                                    value={username}
                                    disabled
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />

                                <Input
                                    type="hidden"
                                    id="submittedBy"
                                    name="submittedBy"
                                    value={username}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <Label htmlFor="targetApprovalDate" className="block text-sm font-medium text-gray-300">
                                    Target Approval Date (optional):
                                </Label>
                                <Input
                                    type="date"
                                    id="targetApprovalDate"
                                    name="targetApprovalDate"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <Label htmlFor="budgetWindowLow" className="block text-sm font-medium text-gray-300">
                                    Budget Window Low (optional):
                                </Label>
                                <Input
                                    type="number"
                                    id="budgetWindowLow"
                                    name="budgetWindowLow"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <Label htmlFor="budgetWindowHigh" className="block text-sm font-medium text-gray-300">
                                    Budget Window High (optional):
                                </Label>
                                <Input
                                    type="number"
                                    id="budgetWindowHigh"
                                    name="budgetWindowHigh"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            {/* ... other project input fields ... */}
                            <button
                                type="submit"
                                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Create Project
                            </button>
                            <h4 className='mt-4 text-sm text-white' >{!error ? message + ' Please head over to the proposal page to create a new proposal' : message + ''}</h4>
                        </form>
                    </div>
                </>
            ) : (
                <div className="min-h-screen bg-[#270927] px-4 py-8 text-black">
                    <h2 className="mb-6 text-2xl font-bold text-white">Create New Project</h2>
                    <p className="text-white">Please sign in to create a new project</p>
                </div>
            )
            }
        </>
    );
}
