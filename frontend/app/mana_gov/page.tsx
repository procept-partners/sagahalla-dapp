"use client"; // Mark this as a client-side component

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use Next.js's navigation hook
import Link from 'next/link';
import ProposalList from './components/ProposalList';
import ProjectList from './components/ProjectList';
import AssignedTasks from './components/AssignedTasks';
import Modal from './components/Modal';
import './globals.css'
// import './styles.css';

export default function ManaDashboard() {
  const [proposals, setProposals] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProjectPlanModalOpen, setIsProjectPlanModalOpen] = useState(false);
  const [isProjectExecutionModalOpen, setIsProjectExecutionModalOpen] = useState(false);
  const router = useRouter(); // Use Next.js's `useRouter` for navigation

  const loggedInUserId = 123;

  useEffect(() => {
    async function fetchData() {
      let errors: string[] = [];
      try {
        await fetchProposals();
      } catch (err) {
        errors.push('Error fetching proposals');
        setProposals([]);
      }
      try {
        await fetchProjects();
      } catch (err) {
        errors.push('Error fetching projects');
        setProjects([]);
      }
      try {
        await fetchTasks();
      } catch (err) {
        errors.push('Error fetching tasks');
        setTasks([]);
      }

      if (errors.length > 0) {
        console.error(errors.join(', '));
        setError('Failed to load some data.');
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  async function fetchProposals() {
    const res = await fetch('/api/proposals');
    if (!res.ok) throw new Error('Failed to fetch proposals');
    const data = await res.json();
    setProposals(data);
  }

  async function fetchProjects() {
    const res = await fetch('/api/projects');
    if (!res.ok) throw new Error('Failed to fetch projects');
    const data = await res.json();
    setProjects(data);
  }

  async function fetchTasks() {
    const res = await fetch('/api/tasks');
    if (!res.ok) throw new Error('Failed to fetch tasks');
    const data = await res.json();
    setTasks(data);
  }

  // Handle Create Project Plan button click
  const handleCreateProjectPlanClick = () => {
    if (proposals.length === 0) {
      setIsProjectPlanModalOpen(true);

      // Close the modal after 2 seconds
      setTimeout(() => {
        setIsProjectPlanModalOpen(false);
      }, 2000);
    } else {
      router.push('/mana_gov/create-project-plan');
    }
  };

  // Handle Create Project Execution button click
  const handleCreateProjectExecutionClick = () => {
    if (projects.length === 0) {
      setIsProjectExecutionModalOpen(true);

      // Close the modal after 2 seconds
      setTimeout(() => {
        setIsProjectExecutionModalOpen(false);
      }, 2000);
    } else {
      router.push('/mana_gov/create-project-execution');
    }
  };

  // Close the modals
  const closeProjectPlanModal = () => {
    setIsProjectPlanModalOpen(false);
  };

  const closeProjectExecutionModal = () => {
    setIsProjectExecutionModalOpen(false);
  };

  if (loading) {
    return <div className="spinner">Loading...</div>;
  }

  if (error) {
    console.warn(error);
  }

  return (
    <>
      <section className="min-h-screen bg-[#270927] py-20 text-white">
        <section className="container mx-auto px-4" id='proposals'>
          <div className="mb-8 flex flex-row items-center justify-between">
            <h2 className="text-3xl font-bold text-yellow-500">Proposals</h2>
            <Link href="/mana_gov/create-proposal" className="rounded-md bg-yellow-600 px-4 py-2 font-bold text-white hover:bg-yellow-800">
              Create New Proposal
            </Link>
          </div>
          {proposals.length === 0 ? (
            <p>No proposals available. Create a new proposal to get started!</p>
          ) : (
            <ProposalList proposals={proposals} />
          )}
        </section>

        <section className="container mx-auto my-16 px-4" id='projects'>
          <div className="mb-8 flex flex-row items-center justify-between">
            <h2 className="text-3xl font-bold text-yellow-500">Projects</h2>
            <button className="rounded-md bg-yellow-600 px-4 py-2 font-bold text-white hover:bg-yellow-800" onClick={handleCreateProjectPlanClick}>
              Develop a Project Plan
            </button>
          </div>
          {projects.length === 0 ? (
            <p>No projects available at the moment. Develop a project plan from an approved proposal!</p>
          ) : (
            <ProjectList projects={projects} userId={loggedInUserId} />
          )}
        </section>

        <section className="tasks container mx-auto px-4" id='tasks'>
          <div className="mb-8 flex flex-row items-center justify-between">
            <h2 className="text-3xl font-bold text-yellow-500">Assigned Tasks</h2>
            <button className="rounded-md bg-yellow-600 px-4 py-2 font-bold text-white hover:bg-yellow-800" onClick={handleCreateProjectExecutionClick}>
              Execute Project Tasks
            </button>
          </div>
          {tasks.length === 0 ? (
            <p>No tasks assigned to you. Check back later for new tasks!</p>
          ) : (
            <AssignedTasks tasks={tasks} userId={loggedInUserId} />
          )}
        </section>

        {/* Modal for project plan creation */}
        {isProjectPlanModalOpen && (
          <Modal closeModal={closeProjectPlanModal} message="No approved and active proposals available. You cannot create a project plan without an approved proposal." />
        )}

        {/* Modal for project execution */}
        {isProjectExecutionModalOpen && (
          <Modal closeModal={closeProjectExecutionModal} message="No project plans available. You cannot create a project execution without an active project plan." />
        )}
      </section>
    </>

  );
}
