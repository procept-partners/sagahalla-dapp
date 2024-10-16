"use client"; // This is a client-side component

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProposalList from './components/ProposalList';
import ProjectList from './components/ProjectList';
import AssignedTasks from './components/AssignedTasks';

export default function ManaDashboard() {
  const [proposals, setProposals] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = 123; // Example user ID, replace with actual logic

  // Fetch data from the backend
  useEffect(() => {
    // Example API calls to fetch data
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
        setError('Error loading data');
        setLoading(false);
      });
  }, []);

  // Handle loading and error states
  if (loading) return <p>Loading...</p>;
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
        <Link href="/proposal-management">Proposal Management</Link>
        <Link href="/project-planning">Project Planning</Link>
        <Link href="/task-tracking">Task Tracking</Link>
        <Link href="/voting">Voting</Link> {/* Added Voting route */}
        <Link href="/reports">Reports</Link> {/* Added Reports route */}
      </nav>

      {/* Main Dashboard Section */}
      <div className="dashboard">
        {/* Proposal List Section */}
        <section className="proposals">
          <h2>Proposals</h2>
          <ProposalList proposals={proposals} /> {/* Passing proposals as props */}
          <Link href="/mana_gov/create-proposal" className="button">
            Create New Proposal
          </Link>
        </section>

        {/* Project List Section */}
        <section classNa
