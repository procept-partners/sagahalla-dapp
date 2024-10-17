"use client"; // This enables the component to be a Client Component

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProposalList from './components/ProposalList';
import ProjectList from './components/ProjectList';
import AssignedTasks from './components/AssignedTasks';
import './styles.css'; // Import styles at the main level

export default function ManaDashboard() {
  const [proposals, setProposals] = useState([]); // Initialize with empty array
  const [projects, setProjects] = useState([]); // Initialize with empty array
  const [tasks, setTasks] = useState([]); // Initialize with empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Ensure error type is handled correctly
  const [loggedIn, setLoggedIn] = useState(false); // Login state

  useEffect(() => {
    // Simulate an empty data response by setting loading to false and no data
    setTimeout(() => setLoading(false), 1500); // Simulate a delay to show the spinner
  }, []);

  const handleLogin = () => {
    setLoggedIn(!loggedIn); // Toggle login status (for demo)
    // Here you can add actual login logic with authentication
  };

  // Handle loading state
  if (loading) {
    return <div className="spinner"></div>; // Display spinner while loading
  }

  // If there's an error, display the error message
  if (error) {
    return <p>Error loading data</p>;
  }

  return (
    <div>
      {/* Header Section */}
      <div className="header flex justify-between items-center p-4 bg-orange-500">
        {/* App Logo on the Left */}
        <div className="logo">
            <img src="/sagahalla.png" alt="SagaHalla Logo" className="app-logo" />
        </div>

        {/* MANA Governance Title in the Center */}
        <div className="title flex-grow text-center">
            <h1 className="text-white text-xl font-bold">MANA</h1>
            <h2 className="text-white text-lg font-semibold">Governance</h2>
        </div>

        {/* User Profile Menu on the Right */}
        <div className="user-profile">
            <button className="profile-btn flex items-center space-x-2" onClick={handleLogin}>
                <img src="/tiwaz.png" alt="Profile Icon" className="profile-icon w-8 h-8 rounded-full" />
                <span className="text-white">{loggedIn ? "Logout" : "Login"}</span>
            </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="navigation">
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

        {/* Project List Section */}
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

        {/* Assigned Tasks Section */}
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
            <AssignedTasks tasks={tasks} userId={userId} />
          )}
        </section>
      </div>

      {/* Footer Section */}
      <footer>
        <p>&copy; 2024 SagaHalla. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
