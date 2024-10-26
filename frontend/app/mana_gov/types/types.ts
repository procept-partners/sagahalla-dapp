// Enum for tracking the lifecycle of a task from planning through execution
export enum TaskStatus {
  Planned = "Planned",        // Task is planned but not yet started
  NotStarted = "NotStarted",  // Task is ready but hasn't begun
  InProgress = "InProgress",  // Task is currently being worked on
  Completed = "Completed",    // Task has been completed
  Rejected = "Rejected",      // Task was rejected or canceled
}

// Main type for Proposal
export interface Proposal {
  id: number;
  title: string;
  description?: string;
  yesVotes: number;
  noVotes: number;
  manaTokensAllocated: number;
  isEnded: boolean;
  submittedBy: string;
  manaHoursBudgeted: number;
  targetDate?: string;
  createdAt: string;
  updatedAt?: string;
  parentId?: number;
  subProjects: SubProject[];
  budgetItems: ProposalBudget[];
}

// Type for SubProject within a proposal
export interface SubProject {
  id: number;
  proposalId?: number; // Optional to support nested subprojects linked to a parent proposal
  subProjectName: string;
  epics: Epic[];
}

// Type for Epic within a subproject
export interface Epic {
  id: number;
  subProjectId?: number;
  epicName: string;
  tasks: Task[];
}

// Type for Task within an epic with a unified status field
export interface Task {
  id: number;
  epicId?: number;
  taskName: string;
  rolesManaHours: TaskRoleManaHours[];
  status: TaskStatus; // Unified status field for both planning and execution phases
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

// Main type for ProjectPlan
export interface ProjectPlan {
  id: number;
  proposalId?: number; // Optional to support standalone project plans
  projectName: string;
  totalManaHours: number;
  votingPowerPercentage?: number; // Voting power as a decimal percentage (e.g., 0.75 for 75%)
  createdAt: string;
  updatedAt?: string;
  developers: Record<string, DeveloperProjectPlan>;
  proposal?: Proposal;
}

// Developer-specific project plan details
export interface DeveloperProjectPlan {
  developerName: string;
  manaHoursBudgeted: number;
  manaTokenAllocated: number;
  votingPowerPercentage?: number; // Voting power as a decimal percentage (e.g., 0.75 for 75%)
  subProjects: SubProjectPlan[];
}

// Type for SubProjectPlan within a project plan
export interface SubProjectPlan {
  id: number;
  projectPlanId: number;
  subProjectName: string;
  epics: EpicPlan[];
}

// Type for EpicPlan within a subproject plan
export interface EpicPlan {
  id: number;
  subProjectPlanId: number;
  epicName: string;
  tasks: TaskPlan[];
}

// Type for TaskPlan within an epic plan, now with unified status tracking
export interface TaskPlan {
  id: number;
  epicPlanId: number;
  taskName: string;
  estimatedManaHours: number;
  rolesManaHours: TaskRoleManaHours[];
  status: TaskStatus; // Unified status field for the task's lifecycle
}

// Main type for ProjectExecution, linked to ProjectPlan by projectPlanId
export interface ProjectExecution {
  id: number;
  projectPlanId: number; // Link to parent ProjectPlan
  actualManaHours: number;
  tasks: TaskExecution[]; // Tracks task execution status based on ProjectPlan tasks
  peerVotes: PeerVote[];
}

// Type for TaskExecution within a project execution, linked to TaskPlan
export interface TaskExecution {
  id: number;
  projectExecutionId: number;
  taskPlanId: number; // Link to specific TaskPlan in ProjectPlan
  actualManaHours: number;
  status: TaskStatus; // Unified status for tracking task execution progress
}

// Type for PeerVote within a project execution
export interface PeerVote {
  id: number;
  projectExecutionId: number;
  userId: number;
  vote: boolean;
  createdAt: string;
}

// Type for TaskFeedback within a task execution
export interface TaskFeedback {
  id: number;
  taskExecutionId: number;
  userId: number;
  feedback: string;
  rating: number;
  createdAt: string;
}
