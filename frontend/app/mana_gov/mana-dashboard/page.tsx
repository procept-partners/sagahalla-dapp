"use client"; // This is a client-side component

import { useEffect, useState } from 'react';
import ProposalList from '../components/proposalList'; // Adjust path based on your folder structure
import ProjectList from '../components/projectList'; // Adjust path
import AssignedTasks from '../components/assignedTasks'; // Adjust path
import { Proposal, Project, Task } from '../types/types'; // Adjust import path for types

export default function ManaDashboard() {
  const [proposals, setProposals] = useState<Proposal[]>([]); // State for proposals
  const [projects, setProjects] = useState<Project[]>([]); // State for projects
  const [tasks, setTasks] = useState<Task[]>([]); // State for tasks
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch data from the backend
  useEffect(() => {
    // Fetch all data in parallel using Promise.all for efficiency
    Promise.all([
      fetch('/api/proposals').then((res) => res.json()), // Fetch proposals
      fetch('/api/projects').then((res) => res.json()), // Fetch projects
      fetch('/api/tasks').then((res) => res.json()), // Fetch tasks
    ])
      .then(([proposalsData, projectsData, tasksData]) => {
        setProposals(proposalsData); // Set proposals data
        setProjects(projectsData); // Set projects data
        setTasks(tasksData); // Set tasks data
        setLoading(false); // Stop loading
      })
      .catch((error) => {
        setError('Error fetching data'); // Handle errors
        setLoading(false);
      });
  }, []);

  // Handle loading and error states
  if (loading) return <p>Loading data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {/* Header Section */}
      <header>
        <h1>Mana Effort Tracking App</h1>
        <p>Welcome, [User Name]</p>
      </header>

      {/* Navigation Links */}
      <nav>
        <a href="#">Proposal Management</a>
        <a href="#">Project Planning</a>
        <a href="#">Task Tracking</a>
        <a href="#">Voting</a>
        <a href="#">Reports</a>
      </nav>

      {/* Main Dashboard Section */}
      <div className="dashboard">
        
        {/* Proposal List Section */}
        <section className="proposals">
          <h2>Proposals</h2>
          <ProposalList proposals={proposals} /> {/* Pass proposals as prop */}
        </section>

        {/* Project List Section */}
        <section className="projects">
          <h2>Project Planning</h2>
          <ProjectList projects={projects} /> {/* Pass projects as prop */}
        </section>

        {/* Assigned Tasks Section */}
        <section className="tasks">
          <h2>Your Tasks</h2>
          <AssignedTasks tasks={tasks} userId={123} /> {/* Pass tasks and userId as props */}
        </section>
      </div>

      {/* Footer Section */}
      <footer>
        <p>&copy; 2024 Mana DApp. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
