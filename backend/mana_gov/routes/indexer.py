from fastapi import APIRouter

indexer_router = APIRouter()

@indexer_router.get("/status")
async def get_indexer_status():
    return {"status": "Indexer is running"}

