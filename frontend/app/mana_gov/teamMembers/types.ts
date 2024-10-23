// app/mana_gov/types.ts

export interface Proposal {
  projectId: number;
  title: string;
  description: string;
  hoursRequired: number;
  tokenPerHour: number;
  yesVotes: number;
  noVotes: number;
  totalTokensAllocated: number;
  isEnded: boolean;
}
