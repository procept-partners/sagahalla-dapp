from fastapi import APIRouter
from .indexer import indexer_router
from .proposals import proposals_router
from .reports import reports_router
from .tasks import tasks_router

router = APIRouter()

# Include the individual routers
router.include_router(indexer_router, prefix="/indexer")
router.include_router(proposals_router, prefix="/proposals")
router.include_router(reports_router, prefix="/reports")
router.include_router(tasks_router, prefix="/tasks")


# A sample route to check if everything is working fine
@router.get("/")
async def root():
    return {"message": "MANA Governance API is running"}
