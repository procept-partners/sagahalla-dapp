from pydantic import BaseModel
from typing import Optional
from enum import Enum

class VoteType(str, Enum):
    PROPOSAL = "proposal"
    PEER = "peer"

class ProposalVote(BaseModel):
    id: int
    proposal_id: int
    user_id: int
    voting_power: float
    vote: bool

    # Relationships
    proposal: Optional["Proposal"]
    user: Optional["User"]

    class Config:
        from_attributes = True


class PeerVote(BaseModel):
    id: int
    project_execution_id: int
    voter_id: int
    votee_id: int
    allocation: float

    # Relationships
    project_execution: Optional["ProjectExecution"]
    voter: Optional["User"]
    votee: Optional["User"]

    class Config:
        from_attributes = True
