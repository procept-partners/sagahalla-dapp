from mana_gov.models.proposal import Proposal  # Assuming this is the Proposal model
from mana_gov.util.database import SessionLocal  # Assuming this provides the database session
from sqlalchemy.orm import Session
from fastapi import HTTPException
from mana_gov.models.pydantic.proposal import ProposalCreate, ProposalUpdate

class ProposalService:
    def __init__(self):
        self.db: Session = SessionLocal()

    # Get all proposals
    async def get_all_proposals(self):
        try:
            proposals = self.db.query(Proposal).all()
            return proposals
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # Create a new proposal
    async def create_proposal(self, proposal_data: ProposalCreate):
        try:
            new_proposal = Proposal(
                title=proposal_data.title,
                description=proposal_data.description,
                mana_hours_budgeted=proposal_data.mana_hours_budgeted,
                mana_tokens_allocated=proposal_data.mana_tokens_allocated,
                target_date=proposal_data.target_date,
                submitted_by=proposal_data.submitted_by  # Ensure this matches your Pydantic model
            )
            self.db.add(new_proposal)
            self.db.commit()
            self.db.refresh(new_proposal)  # To return the newly created proposal with ID
            return new_proposal
        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=500, detail=str(e))

    # Get a single proposal by ID
    async def get_proposal_by_id(self, proposal_id: int):
        try:
            proposal = self.db.query(Proposal).filter(Proposal.id == proposal_id).first()
            if not proposal:
                raise HTTPException(status_code=404, detail="Proposal not found")
            return proposal
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # Update a proposal
    async def update_proposal(self, proposal_id: int, updated_data: ProposalUpdate):
        try:
            proposal = self.db.query(Proposal).filter(Proposal.id == proposal_id).first()
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

            self.db.commit()
            self.db.refresh(proposal)
            return proposal
        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=500, detail=str(e))

    # Delete a proposal by ID
    async def delete_proposal(self, proposal_id: int):
        try:
            proposal = self.db.query(Proposal).filter(Proposal.id == proposal_id).first()
            if not proposal:
                raise HTTPException(status_code=404, detail="Proposal not found")

            self.db.delete(proposal)
            self.db.commit()
            return True
        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
