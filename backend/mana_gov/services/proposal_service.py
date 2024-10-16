from models.proposal import Proposal  # Assuming this is the Proposal model
from util.database import SessionLocal  # Assuming this provides the database session
from sqlalchemy.orm import Session
from fastapi import HTTPException

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
    async def create_proposal(self, proposal_data: Proposal):
        try:
            new_proposal = Proposal(
                title=proposal_data.title,
                description=proposal_data.description,
                status=proposal_data.status,  # Assuming there's a status field
                creator_id=proposal_data.creator_id  # Assuming there's a creator ID
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
    async def update_proposal(self, proposal_id: int, updated_data: Proposal):
        try:
            proposal = self.db.query(Proposal).filter(Proposal.id == proposal_id).first()
            if not proposal:
                raise HTTPException(status_code=404, detail="Proposal not found")

            # Update fields
            proposal.title = updated_data.title
            proposal.description = updated_data.description
            proposal.status = updated_data.status

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

