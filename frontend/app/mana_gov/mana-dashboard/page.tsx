"use client"; // This is a client-side component

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProposalList from '../components/ProposalList';
import ProjectList from '../components/ProjectList';
import AssignedTasks from '../components/AssignedTasks';

export default function ManaDashboard() {
  const [proposals, setProposals] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // Use boolean for error state
  const userId = 123; // Example user ID, replace with actual logic

  // Fetch data from the backend
  useEffect(() => {
    Promise.all([
      fetch('/api/proposals').then((res) => res.json()),
      fetch('/api/projects').then((res) => res.json()),
      fetch('/api/tasks').then((res) => res.json()),
    ])
      .then(([proposalsData, projectsData, tasksData]) => {
        setProposals(proposalsData); // Set proposals data
        setProjects(projectsData); // Set projects data
        setTasks(tasksData); // Set tasks data
        setLoading(false); // Stop loading
      })
      .catch((err) => {
        setError(true); // Set error flag to true if fetching fails
        setLoading(false); // Stop loading
      });
  }, []);

  // Handle loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  // If there's an error, we still render the template but with empty data
  const emptyProposals = [];
  const emptyProjects = [];
  const emptyTasks = [];

  return (
    <div>
      {/* Header Section */}
      <header>
        <h1>Mana Effort Tracking App</h1>
        <p>Welcome, [User Name]</p>
      </header>

      {/* Navigation Links */}
      <nav>
        <Link href="/proposal-management">Proposal Management</Link>
        <Link href="/project-planning">Project Planning</Link>
        <Link href="/task-tracking">Task Tracking</Link>
        <Link href="/voting">Voting</Link>
        <Link href="/reports">Reports</Link>
      </nav>

      {/* Main Dashboard Section */}
      <div className="dashboard">
        {/* Proposal List Section */}
        <section className="proposals">
          <h2>Proposals</h2>
          <ProposalList proposals={error ? emptyProposals : proposals} /> {/* Render empty proposals if error */}
          <Link href="/mana_gov/create-proposal" className="button">
            Create New Proposal
          </Link>
        </section>

        {/* Project List Section */}
        <section className="projects">
          <h2>Project Planning</h2>
          <ProjectList projects={error ? emptyProjects : projects} /> {/* Render empty projects if error */}
          <Link href="#" className="button">
            View All Projects
          </Link>
        </section>

        {/* Assigned Tasks Section */}
        <section className="tasks">
          <h2>Your Tasks</h2>
          <AssignedTasks tasks={error ? emptyTasks : tasks} userId={userId} /> {/* Render empty tasks if error */}
          <Link href="#" className="button">
            View All Tasks
          </Link>
        </section>
      </div>

      {/* Footer Section */}
      <footer>
        <p>&copy; 2024 Mana DApp. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
