"use client"; // This enables the component to be a Client Component

import { useState, useEffect } from 'react';
import Link from 'next/link'; // Ensure this import is correct
import ProposalList from './components/ProposalList';
import ProjectList from './components/ProjectList';
import AssignedTasks from './components/AssignedTasks';
import './styles.css'; // Import styles at the main level

export default function ManaDashboard() {
  const [proposals, setProposals] = useState([]); 
  const [projects, setProjects] = useState([]); 
  const [tasks, setTasks] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  const [loggedIn, setLoggedIn] = useState(false); 

  // Example user ID for testing, replace this with actual logged-in user data
  const loggedInUserId = 123;

  useEffect(() => {
    async function fetchData() {
      let errors: string[] = [];
      try {
        await fetchProposals();
      } catch {
        errors.push('Error fetching proposals');
      }
      try {
        await fetchProjects();
      } catch {
        errors.push('Error fetching projects');
      }
      try {
        await fetchTasks();
      } catch {
        errors.push('Error fetching tasks');
      }

      if (errors.length > 0) {
        setError(errors.join(', '));
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  // Fetch Proposals
  async function fetchProposals() {
    try {
      const res = await fetch('/api/proposals');
      if (!res.ok) throw new Error('Failed to fetch proposals');
      const data = await res.json();
      setProposals(data);
    } catch {
      throw new Error('Error fetching proposals');
    }
  }

  // Fetch Projects
  async function fetchProjects() {
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      setProjects(data);
    } catch {
      throw new Error('Error fetching projects');
    }
  }

  // Fetch Assigned Tasks
  async function fetchTasks() {
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
    } catch {
      throw new Error('Error fetching tasks');
    }
  }

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="dashboard">
      <section className="proposals">
        <div className="section-header">
          <h2>Proposals</h2>
          <Link href="/mana_gov/create-proposal" className="button">
            Create New Proposal
          </Link>
        </div>
        {proposals.length === 0 ? (
          <p>No proposals available. Create a new proposal to get started!</p>
        ) : (
          <ProposalList proposals={proposals} />
        )}
      </section>

      <section className="projects">
        <div className="section-header">
          <h2>Projects</h2>
          <Link href="/mana_gov/create-project-plan" className="button">
            Develop a Project Plan
          </Link>
        </div>
        {projects.length === 0 ? (
          <p>No projects available at the moment. Develop a project plan from an approved proposal!</p>
        ) : (
          // Pass the userId here
          <ProjectList projects={projects} userId={loggedInUserId} />
        )}
      </section>

      <section className="tasks">
        <div className="section-header">
          <h2>Assigned Tasks</h2>
          <Link href="/mana_gov/create-project-execution" className="button">
            Execute Project Tasks
          </Link>
        </div>
        {tasks.length === 0 ? (
          <p>No tasks assigned to you. Check back later for new tasks!</p>
        ) : (
          <AssignedTasks projects={projects} userId={123} />
        )}
      </section>
    </div>
  );
}

