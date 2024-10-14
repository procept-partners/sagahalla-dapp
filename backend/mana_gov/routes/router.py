from fastapi import APIRouter
from .indexer import router as indexer_router
from .proposals import router as proposals_router
from .reports import router as reports_router

router = APIRouter()

# Include the individual routers
router.include_router(indexer_router, prefix="/indexer")
router.include_router(proposals_router, prefix="/proposals")
router.include_router(reports_router, prefix="/reports")
