import { useEffect, useState } from 'react';
import ProjectDetailsModal from './ProjectDetailsModal';
import { Proposal } from '@prisma/client';
import { fetchUserProposals } from '@/lib/actions';

interface Props {
  username: string;
}

const ProjectList = ({ username }: Props) => {

  const [project, setProject] = useState<Proposal[]>([]);

  useEffect(() => {
    const fetchProject = async () => {
      const result = await fetchUserProposals(username);
      if (result.success) {
        setProject(result?.proposals || []);
      }
    };
    fetchProject();
  }, [username]);


  return (
    <div>
      <div className="flex w-full flex-col gap-4">
        {project.length > 0 ? ( // Check if there are projects
          project.map((proposal) => (
            <div key={proposal.id} className="flex flex-col gap-4">
              <div className="flex flex-row gap-4">
                <div className="flex flex-col gap-2">
                  <div className="text-xl font-bold">{proposal.title}</div>
                  <div className="text-sm text-gray-500">{proposal.description}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-sm text-gray-500">Budget Window: {proposal.budgetWindowLow?.toString()} - {proposal.budgetWindowHigh?.toString()}</div>
                  <div className="text-sm text-gray-500">Target Approval Date: {proposal.targetApprovalDate?.toLocaleDateString() || 'No target approval date'}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No projects available.</p> // Display this if the project array is empty
        )}
      </div>
    </div>
  );
};

export default ProjectList;
