from fastapi import APIRouter

# Define the APIRouter for the indexer
indexer_router = APIRouter()

# Add a sample route
@indexer_router.get("/status")
async def get_status():
    return {"status": "Indexer is running"}
