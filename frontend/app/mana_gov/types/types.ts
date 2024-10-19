// app/mana_gov/types.ts

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
  subProjects: SubProject[];
  budgetItems: ProposalBudget[];
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
  proposalId: number;
  projectName: string;
  totalManaHours: number;
  votingPower?: string;
  createdAt: string;
  updatedAt?: string;
  subProjects: SubProjectPlan[];
  proposal?: Proposal;
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

// Type for TaskPlan within an epic plan
export interface TaskPlan {
  id: number;
  epicPlanId: number;
  taskName: string;
  estimatedManaHours: number;
  rolesManaHours: TaskRoleManaHours[];
}

// Main type for ProjectExecution
export interface ProjectExecution {
  id: number;
  projectPlanId: number;
  actualManaHours: number;
  tasks: TaskExecution[];
  peerVotes: PeerVote[];
}

// Type for TaskExecution within a project execution
export interface TaskExecution {
  id: number;
  projectExecutionId: number;
  taskPlanId: number;
  actualManaHours: number;
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

// AssignedTasksProps for the AssignedTasks component
export interface AssignedTasksProps {
  tasks: Task[];
  userId: number;
}

  

