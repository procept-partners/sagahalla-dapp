from mana_gov.models.proposal import Proposal
from mana_gov.util.database import SessionLocal
from sqlalchemy.orm import Session
from fastapi import HTTPException
from mana_gov.models.pydantic.proposal import ProposalCreate, ProposalUpdate
from contextlib import contextmanager
from typing import Generator


class ProposalService:
    
    @staticmethod
    @contextmanager
    def get_db() -> Generator[Session, None, None]:
        """
        Provides a new session for database operations, ensuring proper closing of the session.
        """
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    # Get all proposals
    @staticmethod
    def get_all_proposals():
        with ProposalService.get_db() as db:
            try:
                proposals = db.query(Proposal).all()
                return proposals
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))

    # Create a new proposal
    @staticmethod
    def create_proposal(proposal_data: ProposalCreate):
        with ProposalService.get_db() as db:
            try:
                new_proposal = Proposal(
                    title=proposal_data.title,
                    description=proposal_data.description,
                    mana_hours_budgeted=proposal_data.mana_hours_budgeted,
                    mana_tokens_allocated=proposal_data.mana_tokens_allocated,
                    target_date=proposal_data.target_date,
                    submitted_by=proposal_data.submitted_by  # Ensure this matches your Pydantic model
                )
                db.add(new_proposal)
                db.commit()
                db.refresh(new_proposal)  # To return the newly created proposal with ID
                return new_proposal
            except Exception as e:
                db.rollback()
                raise HTTPException(status_code=500, detail=str(e))

    # Get a single proposal by ID
    @staticmethod
    def get_proposal_by_id(proposal_id: int):
        with ProposalService.get_db() as db:
            try:
                proposal = db.query(Proposal).filter(Proposal.id == proposal_id).first()
                if not proposal:
                    raise HTTPException(status_code=404, detail="Proposal not found")
                return proposal
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))

    # Update a proposal
    @staticmethod
    def update_proposal(proposal_id: int, updated_data: ProposalUpdate):
        with ProposalService.get_db() as db:
            try:
                proposal = db.query(Proposal).filter(Proposal.id == proposal_id).first()
                if not proposal:
                    raise HTTPException(status_code=404, detail="Proposal not found")

                # Update fields if they are provided (only update fields that are not None)
                if updated_data.title is not None:
                    proposal.title = updated_data.title
                if updated_data.description is not None:
                    proposal.description = updated_data.description
                if updated_data.mana_hours_budgeted is not None:
                    proposal.mana_hours_budgeted = updated_data.mana_hours_budgeted
                if updated_data.mana_tokens_allocated is not None:
                    proposal.mana_tokens_allocated = updated_data.mana_tokens_allocated
                if updated_data.target_date is not None:
                    proposal.target_date = updated_data.target_date
                if updated_data.is_ended is not None:
                    proposal.is_ended = updated_data.is_ended

                db.commit()
                db.refresh(proposal)
                return proposal
            except Exception as e:
                db.rollback()
                raise HTTPException(status_code=500, detail=str(e))

    # Delete a proposal by ID
    @staticmethod
    def delete_proposal(proposal_id: int):
        with ProposalService.get_db() as db:
            try:
                proposal = db.query(Proposal).filter(Proposal.id == proposal_id).first()
                if not proposal:
                    raise HTTPException(status_code=404, detail="Proposal not found")

                db.delete(proposal)
                db.commit()
                return True
            except Exception as e:
                db.rollback()
                raise HTTPException(status_code=500, detail=str(e))
