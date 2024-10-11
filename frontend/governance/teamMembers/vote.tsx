import { useState } from 'react';

interface Proposal {
  id: number;
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
    if (proposal.isEnded) {
      return;
    }

    if (isYesVote) {
      setYesVotes((prevYesVotes) => prevYesVotes + 1);
    } else {
      setNoVotes((prevNoVotes) => prevNoVotes + 1);
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
      <p className="mb-2 text-lg font-semibold text-gray-700">Yes Votes: {yesVotes}</p>
      <p className="mb-4 text-lg font-semibold text-gray-700">No Votes: {noVotes}</p>

      {/* Display a message if the proposal has ended */}
      {proposal.isEnded ? (
        <p className="text-red-500 font-bold">Voting has ended for this proposal.</p>
      ) : (
        <div className="flex space-x-4">
          <button
            onClick={() => handleVote(true)}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-lg hover:from-green-500 hover:to-blue-600 transform hover:scale-105 transition-transform duration-300 ease-in-out"
            aria-label="Vote Yes"
          >
            Vote Yes
          </button>
          <button
            onClick={() => handleVote(false)}
            className="px-6 py-3 bg-destructive text-white font-semibold rounded-lg shadow-lg hover:from-red-500 hover:to-pink-600 transform hover:scale-105 transition-transform duration-300 ease-in-out"
            aria-label="Vote No"
          >
            Vote No
          </button>
        </div>
      )}
    </div>
  );
};

export default VoteSection;
