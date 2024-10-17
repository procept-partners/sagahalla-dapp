from sqlalchemy import Column, Integer, Float, ForeignKey, String, Boolean, Enum
from sqlalchemy.orm import relationship
from mana_gov.util.database import Base
import enum

class VoteType(enum.Enum):
    PROPOSAL = "proposal"
    PEER = "peer"

# Proposal Voting Model
class ProposalVote(Base):
    __tablename__ = 'proposal_votes'

    id = Column(Integer, primary_key=True, index=True)
    proposal_id = Column(Integer, ForeignKey('proposals.id'))
    user_id = Column(Integer, ForeignKey('users.id'))

    # Voting Power
    voting_power = Column(Float, nullable=False)

    # Vote decision (for or against the proposal)
    vote = Column(Boolean, nullable=False)

    # Relationships
    proposal = relationship("Proposal", back_populates="votes")
    user = relationship("User", back_populates="proposal_votes")

    def __init__(self, proposal_id: int, user_id: int, voting_power: float, vote: bool):
        self.proposal_id = proposal_id
        self.user_id = user_id
        self.voting_power = voting_power
        self.vote = vote

# 360-Degree Peer Voting Model
class PeerVote(Base):
    __tablename__ = 'peer_votes'

    id = Column(Integer, primary_key=True, index=True)
    project_execution_id = Column(Integer, ForeignKey('project_executions.id'))
    voter_id = Column(Integer, ForeignKey('users.id'))
    votee_id = Column(Integer, ForeignKey('users.id'))

    # Vote allocation (0-100 points, must total 100 for all votees)
    allocation = Column(Float, nullable=False)

    # Relationships
    project_execution = relationship("ProjectExecution", back_populates="peer_votes")
    voter = relationship("User", foreign_keys=[voter_id], back_populates="given_peer_votes")
    votee = relationship("User", foreign_keys=[votee_id], back_populates="received_peer_votes")

    def __init__(self, project_execution_id: int, voter_id: int, votee_id: int, allocation: float):
        self.project_execution_id = project_execution_id
        self.voter_id = voter_id
        self.votee_id = votee_id
        self.allocation = allocation



