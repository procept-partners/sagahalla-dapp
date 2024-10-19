"use client"; // This is a client-side component

import { useEffect, useState } from 'react';
import ProjectPlanForm from '../components/ProjectPlanForm';
import '../styles.css'; 

export default function CreateProjectPlanPage() {
  const [proposals, setProposals] = useState<{ id: number; title: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch list of approved and active proposals
  useEffect(() => {
    async function fetchProposals() {
      try {
        const response = await fetch('/api/proposals/approved-active');  // Adjust the endpoint as necessary
        if (!response.ok) {
          throw new Error('Failed to fetch proposals');
        }
        const data = await response.json();
        setProposals(data);  // Populate proposals
      } catch (err) {
        console.error('Error fetching proposals:', err);
        setProposals([]);  // Set empty array if an error occurs
      } finally {
        setLoading(false);
      }
    }

    fetchProposals();
  }, []);

  // Define the addProjectPlan function
  const addProjectPlan = (projectPlan: { proposalId: number; projectName: string; developerHoursAllocated: any }) => {
    console.log('Project plan submitted:', projectPlan);
    // Handle project plan submission (e.g., save to a database or send to an API)
  };

  // Show a loading indicator while fetching data
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render the page with the Project Plan Form
  return (
    <div className="create-project-plan-page">
      <header className="text-white text-xl font-bold">
        <div className="title flex-grow text-center">
          <h1 className="text-white text-xl font-bold">Create New Project Plan</h1>
        </div>
      </header>

      <section className="project-plan-form">
        <ProjectPlanForm addProjectPlan={addProjectPlan} proposals={proposals} />
      </section>
    </div>
  );
}
