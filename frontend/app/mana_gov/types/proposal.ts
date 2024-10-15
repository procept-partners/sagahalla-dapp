// app/mana_gov/types.ts

export interface Proposal {
  id: number;
  title: string;
  description: string;
  hoursRequired: number;
  tokenPerHour: number;
  yesVotes: number;
  noVotes: number;
  totalTokensAllocated: number;
  isEnded: boolean;
}
