// Enum for tracking the lifecycle of a task from planning through execution
export enum TaskStatus {
  Planned = "Planned",
  NotStarted = "NotStarted",
  InProgress = "InProgress",
  Completed = "Completed",
  Rejected = "Rejected"
}

// Main type for Proposal
export interface Proposal {
  id: number;
  title: string;
  description: string;
  yesVotes: number;
  noVotes: number;
  manaTokenAllocated: number; // Changed to match JSON naming
  isEnded: boolean;
  submittedBy: string;
  manaHoursBudgeted: number;
  targetApprovalDate: string | null; // Adjusted to match JSON
  createdAt: string;
  updatedAt: string | null;
  budgetWindowLow?: number; // Optional to match JSON
  budgetWindowHigh?: number; // Optional to match JSON
  subProjects: SubProject[];
  budgetItems?: ProposalBudget[];
}

// Type for SubProject within a proposal
export interface SubProject {
  id: number;
  proposalId: number;
  subProjectName: string;
  epics: Epic[];
}

// Type for Epic within a subproject
export interface Epic {
  id: number;
  subProjectId: number;
  epicName: string;
  tasks: Task[];
}

// Type for Task within an epic
export interface Task {
  id: number;
  epicId: number;
  taskName: string;
  rolesManaHours: TaskRoleManaHours[];
  manaTokenAllocated: number; // Added to match JSON
  status?: TaskStatus; // Optional as status may not be included in all tasks
}

// Type for RoleManaHours within a task
export interface TaskRoleManaHours {
  id: number;
  taskId: number;
  roleName: string;
  manaHours: number;
}

// Type for ProposalBudget within a proposal
export interface ProposalBudget {
  id: number;
  proposalId: number;
  roleName: string;
  budgetUsd: number;
  budgetMana: number;
}
