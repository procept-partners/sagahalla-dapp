import { useState } from 'react';

interface Proposal {
  projectId: number;
  yesVotes: number;
  noVotes: number;
  isEnded: boolean;
}

interface Props {
  proposal: Proposal;
}

const VoteSection = ({ proposal }: Props) => {
  const [yesVotes, setYesVotes] = useState(proposal.yesVotes);
  const [noVotes, setNoVotes] = useState(proposal.noVotes);

  const handleVote = (isYesVote: boolean) => {
    if (proposal.isEnded) return;

    if (isYesVote) {
      setYesVotes(yesVotes + 1);
      
    } else {
      setNoVotes(noVotes + 1);
      
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
      <p className="mb-2">Yes Votes: {yesVotes}</p>
      <p className="mb-4">No Votes: {noVotes}</p>

      {proposal.isEnded ? (
        <p className="text-red-500">Voting has ended for this proposal.</p>
      ) : (
        <div className="flex space-x-4">
          <button
            onClick={() => handleVote(true)}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Vote Yes
          </button>
          <button
            onClick={() => handleVote(false)}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Vote No
          </button>
        </div>
      )}
    </div>
  );
};

export default VoteSection;
