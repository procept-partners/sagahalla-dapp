from fastapi import APIRouter, HTTPException
from typing import List
from mana_gov.models.proposal import Proposal  # Assuming you have a Proposal model defined here
from mana_gov.services.proposal_service import ProposalService  # Assuming this service handles the business logic

proposals_router = APIRouter()

# Service instance
proposal_service = ProposalService()

# GET /api/proposals - List all proposals
@proposals_router.get("/proposals", response_model=List[Proposal])
async def list_proposals():
    try:
        proposals = await proposal_service.get_all_proposals()
        return proposals
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# POST /api/proposals - Create a new proposal
@proposals_router.post("/proposals", response_model=Proposal)
async def create_proposal(proposal: Proposal):
    try:
        new_proposal = await proposal_service.create_proposal(proposal)
        return new_proposal
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# GET /api/proposals/{id} - Fetch a single proposal by ID
@proposals_router.get("/proposals/{id}", response_model=Proposal)
async def get_proposal(id: int):
    try:
        proposal = await proposal_service.get_proposal_by_id(id)
        if not proposal:
            raise HTTPException(status_code=404, detail="Proposal not found")
        return proposal
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# PUT /api/proposals/{id} - Update a proposal by ID
@proposals_router.put("/proposals/{id}", response_model=Proposal)
async def update_proposal(id: int, updated_proposal: Proposal):
    try:
        proposal = await proposal_service.update_proposal(id, updated_proposal)
        if not proposal:
            raise HTTPException(status_code=404, detail="Proposal not found")
        return proposal
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# DELETE /api/proposals/{id} - Delete a proposal by ID
@proposals_router.delete("/proposals/{id}")
async def delete_proposal(id: int):
    try:
        success = await proposal_service.delete_proposal(id)
        if not success:
            raise HTTPException(status_code=404, detail="Proposal not found")
        return {"message": "Proposal deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
