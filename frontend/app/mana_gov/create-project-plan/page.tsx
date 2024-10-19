"use client"; // This is a client-side component

import { useEffect, useState } from 'react';
import ProjectPlanForm from '../components/ProjectPlanForm';
import '../styles.css'; 

export default function CreateProjectPlanPage() {
  const [proposals, setProposals] = useState<{ id: number; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch list of approved and active proposals
  useEffect(() => {
    async function fetchProposals() {
      try {
        const response = await fetch('/api/proposals/approved-active');  // Adjust the endpoint as necessary
        if (!response.ok) {
          throw new Error('Failed to fetch proposals');
        }
        const data = await response.json();
        setProposals(data);  // Assuming data is in the format [{ id, title }]
        setLoading(false);
      } catch (err) {
        setError('Error fetching proposals. Please try again later.');
        setLoading(false);
      }
    }

    fetchProposals();
  }, []);

  // Define the addProjectPlan function
  const addProjectPlan = (projectPlan: { proposalId: number; projectName: string; developerHoursAllocated: any }) => {
    console.log('Project plan submitted:', projectPlan);
    // You can handle the project plan here (e.g., save to a database or send to an API)
  };

  return (
    <div className="create-project-plan-page">
      <header className="text-white text-xl font-bold">
        <div className="title flex-grow text-center">
          <h1 className="text-white text-xl font-bold">Create New Project Plan</h1>
        </div>
      </header>

      <section className="project-plan-form">
        {loading ? (
          <p>Loading proposals...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          // Pass the list of proposals to the ProjectPlanForm
          <ProjectPlanForm addProjectPlan={addProjectPlan} proposals={proposals} />
        )}
      </section>
    </div>
  );
}
