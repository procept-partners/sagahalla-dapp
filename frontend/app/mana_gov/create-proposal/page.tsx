'use client';
import React, { useState, useEffect } from 'react';
import CreateSubProjectForm from './proposal-form';
import { authenticate, fetchUserProposals } from '@/lib/actions';

interface Proposal {
  id: number;
  title: string;
}

export default function CreateSubProject() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedProposalId, setSelectedProposalId] = useState<number | null>(null);
  const [session, setSession] = useState(false);
  const [username, setUsername] = useState('');
  const [error, setError] = useState(false);
  const [message, setMessage] = useState<string | undefined>('');

  useEffect(() => {
    const fetchData = async () => {
      const authResult = await authenticate();
      setSession(authResult.success);
      setUsername(authResult.user?.username || '');

      if (authResult.success && authResult.user?.username) {
        const projectResult = await fetchUserProposals(authResult.user.username);
        if (projectResult.success === false) {
          setError(true);
          setMessage(projectResult.message);
        } else {
          setError(false);
          setMessage(projectResult.message || '');
          if (projectResult.proposals) {
            setProposals(projectResult.proposals.map(p => ({ id: p.id, title: p.title })));
          }
        }
      }
    };

    fetchData();
  }, []);



  const [selectedProject, setSelectedProject] = useState('');

  const handleProposalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProject(event.target.value);
  };
  return (
    <div className="flex min-h-screen flex-col justify-center gap-5 bg-[#270927] p-4">
      {session ? (
        <>
          <div className="mx-auto">
            <h4 className="text-center text-2xl font-bold capitalize text-white">Choose a Project</h4>
            <select
              name="project"
              id="project"
              className="block w-[300px] rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-amber-900 focus:border-amber-500 focus:ring-amber-500"
              onChange={handleProposalChange}
              value={selectedProject}
            >
              <option value="" disabled>Select a proposal</option>
              {proposals.map((proposal) => (
                <option key={proposal.id} value={proposal.id}>
                  {proposal.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            {selectedProject && <CreateSubProjectForm proposalId={selectedProject} />}
          </div>
        </>
      ) : (<div className="min-h-screen px-4 py-8 text-black">
        <h2 className="mb-6 text-2xl font-bold text-white">Create New Proposal</h2>
        <p className="text-white">Please sign in to create a new proposal</p>
      </div>)
      }
    </div>
  );
}
