from fastapi import APIRouter

proposals_router = APIRouter()

@proposals_router.get("/list")
async def list_proposals():
    return {"proposals": "Proposal list"}

