import { useState } from 'react';

interface ChangeLog {
  time: string;
  user: string;
  fieldChanged: string;
  oldValue: number;
  newValue: number;
}

interface Proposal {
  hoursRequired: number;
  tokenPerHour: number;
  yesVotes: number;
  noVotes: number;
  totalTokensAllocated: number;
  isEnded: boolean;
}

interface Props {
  proposal: Proposal;
  changeLog: ChangeLog[];
}

const ReportSection = ({ proposal, changeLog }: Props) => {
  const [isReportVisible, setIsReportVisible] = useState(false);

  const totalTokens = proposal.hoursRequired * proposal.tokenPerHour;
  const approved = proposal.yesVotes > proposal.noVotes;

  const handleViewReport = () => {
    setIsReportVisible(true);
  };

  return (
    <div>
      {proposal.isEnded && !isReportVisible && (
        <button
          onClick={handleViewReport}
          className="px-6 py-2 bg-primary text-center text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300 ease-in-out"
        >
          Download Report
        </button>
      )}

      {isReportVisible && (
        <div>
          <h3>Report</h3>
          <p>Hours Required: {proposal.hoursRequired}</p>
          <p>Token Per Hour: {proposal.tokenPerHour}</p>
          <p>Total Tokens Allocated: {approved ? totalTokens : 0}</p>
          <p>Proposal Status: {approved ? 'Approved' : 'Not Approved'}</p>

          <h4 className="mt-4">Change Log</h4>
          {changeLog.length > 0 ? (
            <table className="min-w-full bg-white border mt-2">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Time</th>
                  <th className="px-4 py-2 border">User</th>
                  <th className="px-4 py-2 border">Field Changed</th>
                  <th className="px-4 py-2 border">Old Value</th>
                  <th className="px-4 py-2 border">New Value</th>
                </tr>
              </thead>
              <tbody>
                {changeLog.map((log, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border">{log.time}</td>
                    <td className="px-4 py-2 border">{log.user}</td>
                    <td className="px-4 py-2 border">{log.fieldChanged}</td>
                    <td className="px-4 py-2 border">{log.oldValue}</td>
                    <td className="px-4 py-2 border">{log.newValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No changes were logged.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportSection;
