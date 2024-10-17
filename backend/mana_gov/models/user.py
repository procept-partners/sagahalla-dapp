
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class User(BaseModel):
    id: int
    username: str
    email: str
    near_wallet_address: str
    near_account_id: str
    dao_role: str = "member"
    nft_token_id: Optional[str]
    hashed_password: Optional[str]
    is_active: bool = True
    is_admin: bool = False
    created_at: datetime
    updated_at: Optional[datetime]
    role_assignments: Optional[List["UserRoleAssignment"]] = []
    proposals: Optional[List["Proposal"]] = []
    tasks: Optional[List["Task"]] = []
    votes: Optional[List["Vote"]] = []
    dao_votes: Optional[List["DaoVote"]] = []
    proposal_votes: Optional[List["ProposalVote"]] = []
    given_peer_votes: Optional[List["PeerVote"]] = []
    received_peer_votes: Optional[List["PeerVote"]] = []
    task_feedback: Optional[List["TaskFeedback"]] = []
    class Config:
        from_attributes = True

class UserRoleAssignment(BaseModel):
    id: int
    user_id: int
    task_id: int
    role_name: str
    mana_hours: float
    user: Optional[User]
    task: Optional["Task"]
    class Config:
        from_attributes = True
