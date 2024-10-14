from fastapi import APIRouter
from .indexer import indexer_router  # Use a unique name for each router
from .proposals import proposals_router  # Use a unique name for each router
from .reports import reports_router  # Use a unique name for each router

router = APIRouter()

# Include the individual routers
router.include_router(indexer_router, prefix="/indexer")
router.include_router(proposals_router, prefix="/proposals")
router.include_router(reports_router, prefix="/reports")

