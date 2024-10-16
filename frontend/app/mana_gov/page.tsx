"use client"; // This is a client-side component

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProposalList from './components/ProposalList';
import ProjectList from './components/ProjectList';
import AssignedTasks from './components/AssignedTasks';

export default function ManaDashboard() {
  const [proposals, setProposals] = useState([]); // Initialize with empty array
  const [projects, setProjects] = useState([]); // Initialize with empty array
  const [tasks, setTasks] = useState([]); // Initialize with empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Ensure error type is handled correctly
  const userId = 123; // Example user ID, replace with actual logic

  useEffect(() => {
    // Simulate an empty data response by setting loading to false and no data
    setLoading(false); // Just stop loading and use empty arrays
  }, []);

  // Handle loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  // If there's an error, display the template with empty data
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
          <ProposalList proposals={proposals} /> {/* Passing empty array for proposals */}
          <Link href="/mana_gov/create-proposal" className="button">
            Create New Proposal
          </Link>
        </section>

        {/* Project List Section */}
        <section className="projects">
          <h2>Project Planning</h2>
          <ProjectList projects={projects} /> {/* Passing empty array for projects */}
          <Link href="#" className="button">
            View All Projects
          </Link>
        </section>

        {/* Assigned Tasks Section */}
        <section className="tasks">
          <h2>Your Tasks</h2>
          <AssignedTasks tasks={tasks} userId={userId} /> {/* Passing empty array for tasks */}
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
