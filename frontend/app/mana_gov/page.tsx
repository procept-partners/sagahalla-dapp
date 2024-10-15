"use client"; // This is a client-side component

import Link from 'next/link';
import './styles.css';

export default function ManaDashboard() {
  return (
    <div>
      {/* Header Section */}
      <header>
        <h1>Mana Effort Tracking App</h1>
        <p>Welcome, [User Name]</p>
      </header>

      {/* Navigation Links */}
      <nav>
        <Link href="#">Proposal Management</Link>
        <Link href="#">Project Planning</Link>
        <Link href="#">Task Tracking</Link>
        <Link href="#">Voting</Link>
        <Link href="#">Reports</Link>
      </nav>

      {/* Main Dashboard Section */}
      <div className="dashboard">
        
        {/* Active Proposals */}
        <section className="proposals">
          <h2>Active Proposals</h2>
          <ul>
            <li>Proposal #1 - SagaHalla Token Minting (Voting in Progress)</li>
            <li>Proposal #2 - SagaHalla Mana DApp (Under Review)</li>
          </ul>
          <Link href="#" className="button">Create New Proposal</Link>
        </section>

        {/* Project Planning */}
        <section className="projects">
          <h2>Project Planning</h2>
          <ul>
            <li>SagaHalla Mana DApp - 1200 Total Mana Hours, 250 User Mana Hours, 20% Voting Power</li>
          </ul>
          <Link href="#" className="button">View All Projects</Link>
        </section>

        {/* Tasks Assigned */}
        <section className="tasks">
          <h2>Your Tasks</h2>
          <ul>
            <li>SagaHalla Mana DApp: Subproject1: Epic1: Task1</li>
            <li>SagaHalla Mana DApp: Subproject1: Epic1: Task2</li>
            <li>SagaHalla Mana DApp: Subproject2: Epic2: Task3</li>
          </ul>
          <Link href="#" className="button">View All Tasks</Link>
        </section>
      </div>

      {/* Footer Section */}
      <footer>
        <p>&copy; 2024 Mana DApp. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
