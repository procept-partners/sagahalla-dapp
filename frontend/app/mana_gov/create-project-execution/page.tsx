"use client"; // This is a client-side component

import { useEffect, useState } from 'react';
import ProjectExecutionForm from '../components/ProjectExecutionForm';
import '../styles.css'; 

export default function CreateProjectExecutionPage() {
  const [projectPlans, setProjectPlans] = useState<{ id: number; projectName: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch list of project plans
  useEffect(() => {
    async function fetchProjectPlans() {
      try {
        const response = await fetch('/api/project-plans');  // Adjust the endpoint as necessary
        if (!response.ok) {
          throw new Error('Failed to fetch project plans');
        }
        const data = await response.json();
        setProjectPlans(data);  // Populate project plans
      } catch (err) {
        console.error('Error fetching project plans:', err);
        setProjectPlans([]);  // Set an empty array if an error occurs
      } finally {
        setLoading(false);
      }
    }

    fetchProjectPlans();
  }, []);

  // Define the addProjectExecution function
  const addProjectExecution = (projectExecution: { projectPlanId: number; actualManaHours: any }) => {
    console.log('Project execution submitted:', projectExecution);
    // Handle project execution submission (e.g., save to a database or send to an API)
  };

  // Show a loading indicator while fetching data
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render the page with the Project Execution Form
  return (
    <div className="create-project-execution-page">
      <header className="text-white text-xl font-bold">
        <div className="title flex-grow text-center">
          <h1 className="text-white text-xl font-bold">Create New Project Execution</h1>
        </div>
      </header>

      <section className="project-execution-form">
        <ProjectExecutionForm addProjectExecution={addProjectExecution} projectPlans={projectPlans} />
      </section>
    </div>
  );
}
