from fastapi import APIRouter

reports_router = APIRouter()

@reports_router.get("/overview")
async def get_report_overview():
    return {"report": "Report overview"}

