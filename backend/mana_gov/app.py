from fastapi import FastAPI
from mana_gov.routes.router import router as mana_gov_router  # Import the mana_gov router
from mana_gov.util.database import engine, Base

app = FastAPI()

# Include the mana_gov-specific routes
app.include_router(mana_gov_router, prefix="/api/mana_gov")

# Create all database tables (consider using Alembic for production)
Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Welcome to MANA Governance System!"}

# Add any middleware or specific configuration for mana_gov app
