import { useState, useEffect } from 'react';
import { SubProject } from '@prisma/client';
import { fetchUserProposalsWithDetails, type FetchUserProposalsWithDetailsResponse } from '@/lib/actions';

interface Props {
  username: string
}


const ProposalList = ({ username }: Props) => {
  const [proposals, setProposals] = useState<FetchUserProposalsWithDetailsResponse['proposals'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await fetchUserProposalsWithDetails(username);
        if (response.success) {
          setProposals(response.proposals);
        } else {
          setError(response.message || ''); // Set error message if there's an issue
        }
      } catch (err) {
        setError("An error occurred fetching proposals."); // Catch any unexpected errors
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [username]); // Re-fetch if username changes



  if (loading) {
    return <p>Loading proposals...</p>; // Display loading message
  }

  if (error) {
    return <p>Error: {error}</p>;  // Display error message if any
  }



  return (
    <div>
      {proposals && proposals && proposals.length > 0 ? (
        proposals.map((proposal) => (
          <ul key={proposal.id} className="max-w-md list-inside list-disc space-y-1 text-amber-500">
            {/* Make sure proposal.title and proposal.description exist */}
            {proposal.title && <li className="text-gray-500">{proposal.title}</li>}
            {proposal.description && <li className="text-gray-500">{proposal.description}</li>}
            {/* Example of rendering nested data (adapt as needed for your data structure) */}
          </ul>
        ))
      ) : (
        <p>No proposals available. Create a new proposal to get started.</p>
      )}
    </div>
  );
};

export default ProposalList;
