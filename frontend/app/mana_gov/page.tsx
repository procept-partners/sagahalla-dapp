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

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (error) {
    return <p>Error loading data</p>;
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
          <Link href="/project-list" className="button">
            Develop a Project Plan
          </Link>
        </div>
        {projects.length === 0 ? (
          <p>No projects available at the moment. Develop a project plan from an approved proposal!</p>
        ) : (
          <ProjectList projects={projects} />
        )}
      </section>

      <section className="tasks">
        <div className="section-header">
          <h2>Assigned Tasks</h2>
          <Link href="/task-list" className="button">
            Create a New Task
          </Link>
        </div>
        {tasks.length === 0 ? (
          <p>No tasks assigned to you. Check back later for new tasks!</p>
        ) : (
          <AssignedTasks tasks={tasks} userId={123} />
        )}
      </section>
    </div>
  );
}
