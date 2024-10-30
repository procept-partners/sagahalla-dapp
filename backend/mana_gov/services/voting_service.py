from mana_gov.models.proposal import Proposal
from mana_gov.models.voting import ProposalVote, PeerVote
from mana_gov.models.project_execution import ProjectExecution
from mana_gov.models.project_plan import TaskPlan
from mana_gov.util.database import SessionLocal
from sqlalchemy.orm import Session
from fastapi import HTTPException
from contextlib import contextmanager
from typing import Generator, Dict, List

class VotingService:
    @staticmethod
    @contextmanager
    def get_db() -> Generator[Session, None, None]:
        """
        Provides a database session and ensures proper cleanup after use.
        """
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    @staticmethod
    def submit_proposal_vote(user_id: int, proposal_id: int, vote: bool) -> ProposalVote:
        """
        Submits a vote for a proposal (True = Yes, False = No).
        """
        with VotingService.get_db() as db:
            proposal = db.query(Proposal).filter(Proposal.id == proposal_id).first()
            if not proposal:
                raise HTTPException(status_code=404, detail="Proposal not found.")
            
            # Check if the user has already voted
            existing_vote = db.query(ProposalVote).filter(
                ProposalVote.user_id == user_id,
                ProposalVote.proposal_id == proposal_id
            ).first()
            if existing_vote:
                raise HTTPException(status_code=400, detail="User has already voted on this proposal.")
            
            # Create the new vote entry
            new_vote = ProposalVote(user_id=user_id, proposal_id=proposal_id, vote=vote)
            db.add(new_vote)
            db.commit()
            db.refresh(new_vote)
            return new_vote

    @staticmethod
    def submit_peer_vote(voter_id: int, project_id: int, vote_allocations: Dict[int, int]) -> List[PeerVote]:
        """
        Submits peer votes for mana hour allocation in a 360-degree voting system.
        The vote_allocations dictionary must have the form {votee_id: allocation}.
        Each user must receive some allocation, and the total must sum to 100.
        """
        with VotingService.get_db() as db:
            assigned_tasks = db.query(TaskPlan).filter(TaskPlan.project_plan_id == project_id).all()
            assigned_users = set(task.assigned_user_id for task in assigned_tasks)

            # Ensure all assigned users (including voter) are in vote_allocations
            if not assigned_users.issubset(set(vote_allocations.keys())):
                raise HTTPException(status_code=400, detail="All assigned users must receive a vote allocation.")

            # Ensure total allocation equals 100
            total_allocation = sum(vote_allocations.values())
            if total_allocation != 100:
                raise HTTPException(status_code=400, detail="Total vote allocation must sum to 100%.")

            peer_votes = []
            for votee_id, allocation in vote_allocations.items():
                if allocation < 0 or allocation > 100:
                    raise HTTPException(status_code=400, detail="Allocation must be between 0 and 100.")
                
                # Create a new peer vote
                peer_vote = PeerVote(
                    voter_id=voter_id,
                    votee_id=votee_id,
                    project_execution_id=project_id,
                    allocation=allocation
                )
                db.add(peer_vote)
                peer_votes.append(peer_vote)

            db.commit()
            for peer_vote in peer_votes:
                db.refresh(peer_vote)
            return peer_votes

    @staticmethod
    def calculate_peer_vote_allocation(project_id: int) -> Dict[int, int]:
        """
        Calculates the final mana hour allocation based on peer votes for a project.
        Aggregates votes and calculates the final distribution of mana hours.
        """
        with VotingService.get_db() as db:
            project_execution = db.query(ProjectExecution).filter(ProjectExecution.id == project_id).first()
            if not project_execution:
                raise HTTPException(status_code=404, detail="Project execution not found.")
            
            peer_votes = db.query(PeerVote).filter(PeerVote.project_execution_id == project_id).all()

            vote_summary = {}
            for vote in peer_votes:
                if vote.votee_id not in vote_summary:
                    vote_summary[vote.votee_id] = 0
                vote_summary[vote.votee_id] += vote.allocation
            
            return vote_summary

    @staticmethod
    def get_voting_results(proposal_id: int) -> Dict[str, int]:
        """
        Retrieves the voting results for a proposal.
        Returns the total yes and no votes for the given proposal.
        """
        with VotingService.get_db() as db:
            proposal = db.query(Proposal).filter(Proposal.id == proposal_id).first()
            if not proposal:
                raise HTTPException(status_code=404, detail="Proposal not found.")
            
            yes_votes = db.query(ProposalVote).filter(
                ProposalVote.proposal_id == proposal_id,
                ProposalVote.vote == True
            ).count()
            
            no_votes = db.query(ProposalVote).filter(
                ProposalVote.proposal_id == proposal_id,
                ProposalVote.vote == False
            ).count()
            
            return {"yes_votes": yes_votes, "no_votes": no_votes}

    @staticmethod
    def get_peer_vote_summary(project_id: int) -> Dict[int, int]:
        """
        Retrieves a summary of peer votes for a project.
        Returns the total vote allocation for each user.
        """
        with VotingService.get_db() as db:
            project_execution = db.query(ProjectExecution).filter(ProjectExecution.id == project_id).first()
            if not project_execution:
                raise HTTPException(status_code=404, detail="Project execution not found.")
            
            peer_votes = db.query(PeerVote).filter(PeerVote.project_execution_id == project_id).all()

            vote_summary = {}
            for vote in peer_votes:
                if vote.votee_id not in vote_summary:
                    vote_summary[vote.votee_id] = 0
                vote_summary[vote.votee_id] += vote.allocation
            
            return vote_summary
