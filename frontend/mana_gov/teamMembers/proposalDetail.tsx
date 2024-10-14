import React, { useState } from 'react';
import VoteSection from './vote';
import { Proposal } from './types';
// Need to add a button to call a smart contract function to transfer converted mana hours to MANA tokens
// API here??

interface ChangeLog {
  time: string;
  user: string;
  fieldChanged: string;
  oldValue: number;
  newValue: number;
}

interface Props {
  proposal: Proposal;
  closeModal: () => void;
}

const ProposalDetailsModal: React.FC<Props> = ({ proposal, closeModal }) => {
  const { title, description, hoursRequired, tokenPerHour, totalTokensAllocated, isEnded } = proposal;

  const [editableHours, setEditableHours] = useState(hoursRequired);
  const [editableTokens, setEditableTokens] = useState(tokenPerHour);
  const [changeLog, setChangeLog] = useState<ChangeLog[]>([]);
  const [isChangeLogVisible, setIsChangeLogVisible] = useState(false);
  const [isReportVisible, setIsReportVisible] = useState(false); 

  const [isEditingHours, setIsEditingHours] = useState(false); 
  const [isEditingTokens, setIsEditingTokens] = useState(false);

  const handleViewReport = () => {
    setIsReportVisible(true);
  };

  const logChange = (field: string, oldValue: number, newValue: number) => {
    const newChange: ChangeLog = {
      time: new Date().toLocaleString(),
      user: 'John Doe', //Change name with the real-users
      fieldChanged: field,
      oldValue: oldValue,
      newValue: newValue,
    };

    setChangeLog((prevLogs) => [...prevLogs, newChange]);
  };

  const handleSaveHours = () => {
    if (!isEditingHours) return;
    logChange('Hours Required', hoursRequired, editableHours);
    setIsEditingHours(false);
  };

  const handleSaveTokens = () => {
    if (!isEditingTokens) return;
    logChange('Token Per Hour', tokenPerHour, editableTokens);
    setIsEditingTokens(false);
  };

  const toggleChangeLogVisibility = () => {
    setIsChangeLogVisible(!isChangeLogVisible);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-opacity-30 z-50 h-screen w-screen">
      <div className="bg-white p-8 rounded-2xl min-w-[20%] max-w-[80%] relative shadow-xl transform transition-all duration-300 ease-in-out scale-100 hover:scale-105 back">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full transition-all duration-200"
          aria-label="Close"
        >
          <span className="text-3xl">&times;</span>
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">{title}</h2>
        <p className="text-gray-600 mb-6 leading-relaxed text-center">{description}</p>

        <div className="grid gap-6 text-lg text-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <label className="block font-semibold mb-2">Hours Required</label>
              {isEditingHours ? (
                <input
                  type="number"
                  value={editableHours}
                  onChange={(e) => setEditableHours(Number(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p>{editableHours}</p>
              )}
            </div>
            <button
              onClick={() => {
                if (isEditingHours) {
                  handleSaveHours();
                } else {
                  setIsEditingHours(true);
                }
              }}
              className="ml-4 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
            >
              {isEditingHours ? 'Save' : 'Edit'}
            </button>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <label className="block font-semibold mb-2">Token Per Hour</label>
              {isEditingTokens ? (
                <input
                  type="number"
                  value={editableTokens}
                  onChange={(e) => setEditableTokens(Number(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p>{editableTokens}</p>
              )}
            </div>
            <button
              onClick={() => {
                if (isEditingTokens) {
                  handleSaveTokens();
                } else {
                  setIsEditingTokens(true);
                }
              }}
              className="ml-4 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
            >
              {isEditingTokens ? 'Save' : 'Edit'}
            </button>
          </div>

          <p>Total Tokens Allocated = {totalTokensAllocated}</p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={toggleChangeLogVisibility}
            className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
          >
            {isChangeLogVisible ? 'Hide Change Log' : 'View Change Log'}
          </button>
        </div>

        {isChangeLogVisible && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Change Log</h3>
            <table className="min-w-full bg-white border">
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
          </div>
        )}

        <div className="mt-8">
          <VoteSection proposal={proposal} />
        </div>

        {/* Report Button */}
        {isEnded && !isReportVisible && (
          <div className="mt-4 text-center">
            <button
              onClick={handleViewReport}
              className="px-6 py-2 bg-destructive text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300"
            >
              View Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalDetailsModal;
