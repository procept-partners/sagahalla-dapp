"use client"; // This is a client-side component

import { useEffect, useState } from 'react';
import ProjectExecutionForm from '../components/ProjectExecutionForm';
import '../styles.css'; 

export default function CreateProjectExecutionPage() {
  const [projectPlans, setProjectPlans] = useState<{ id: number; projectName: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch list of project plans
  useEffect(() => {
    async function fetchProjectPlans() {
      try {
        const response = await fetch('/api/project-plans');  // Adjust the endpoint as necessary
        if (!response.ok) {
          throw new Error('Failed to fetch project plans');
        }
        const data = await response.json();
        setProjectPlans(data);  // Assuming data is in the format [{ id, projectName }]
        setLoading(false);
      } catch (err) {
        setError('Error fetching project plans. Please try again later.');
        setLoading(false);
      }
    }

    fetchProjectPlans();
  }, []);

  // Define the addProjectExecution function
  const addProjectExecution = (projectExecution: { projectPlanId: number; actualManaHours: any }) => {
    console.log('Project execution submitted:', projectExecution);
    // You can handle the project execution here (e.g., save to a database or send to an API)
  };

  return (
    <div className="create-project-execution-page">
      <header className="text-white text-xl font-bold">
        <div className="title flex-grow text-center">
          <h1 className="text-white text-xl font-bold">Create New Project Execution</h1>
        </div>
      </header>

      <section className="project-execution-form">
        {loading ? (
          <p>Loading project plans...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          // Pass the list of project plans to the ProjectExecutionForm
          <ProjectExecutionForm addProjectExecution={addProjectExecution} projectPlans={projectPlans} />
        )}
      </section>
    </div>
  );
}
