#!/usr/bin/env python3
"""
This module contains a class that serves as a database table.
"""

from sqlalchemy import Column, Integer, String, Float
from mana_gov.util.database import Base
from pydantic import BaseModel


# User Model extension for voting
class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    mana_contribution = Column(Float, default=0.0)

    # Relationships for Proposal Votes
    proposal_votes = relationship("ProposalVote", back_populates="user")

    # Relationships for Peer Votes
    given_peer_votes = relationship("PeerVote", foreign_keys=[PeerVote.voter_id], back_populates="voter")
    received_peer_votes = relationship("PeerVote", foreign_keys=[PeerVote.votee_id], back_populates="votee")

    # Other relationships...
    task_feedback = relationship("TaskFeedback", back_populates="user")
