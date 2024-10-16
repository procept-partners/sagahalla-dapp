// app/mana_gov/index.ts

export interface Proposal {
    id: number; // Unique identifier for the proposal
    title: string; // Title of the proposal
    description?: string; // Optional description of the proposal
    yesVotes: number; // Number of yes votes
    noVotes: number; // Number of no votes
    totalTokensAllocated: number; // Total tokens allocated to the proposal
    totalTokens?: number; // Optional total number of tokens for the proposal (for calculating percentages)
    isEnded: boolean; // Whether the proposal has ended
    createdAt: string; // Date and time the proposal was created
    updatedAt?: string; // Optional date and time for the last update
    submittedBy: string; // The user who submitted the proposal (could be a username or user ID)
    hoursRequired: number; // Number of hours required for this proposal
    tokenPerHour: number; // Number of tokens earned per hour
    endTime?: string; // Optional time when the proposal is scheduled to end (if applicable)
  }
  
  
  export interface Project {
    id: number; // Unique identifier for the project
    title: string; // Project title
    subproject?: string; // Optional subproject name
    epic?: string; // Optional epic name
    totalManaHours: number; // Total mana hours allocated to the project
    manaHours: {
      userId: number; // User ID of the person assigned mana hours
      hours: number; // Number of mana hours assigned
    }[]; // Array of assigned mana hours
    votingPower: string; // Voting power associated with the project
    description?: string; // Optional description of the project
    teamMembers?: {
      name: string; // Team member name
    }[]; // Array of team members (optional)
    tasks: {
      id: number; // Task ID
      title: string; // Task title
      assignedTo: number; // User ID of the person the task is assigned to
    }[]; // Array of tasks associated with the project
  }
  
  
  
  export interface Task {
    id: number;
    title: string;
    assignedTo: number;
    projectId: number;
  }

  

