from fastapi import FastAPI
from app.api.routers.chat import chat_router
from app.api.routers.chat_config import config_router
from app.api.routers.upload import file_upload_router
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# Add CORS middleware for development
environment = os.getenv("ENVIRONMENT", "dev")
if environment == "dev":
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include app-specific routers
app.include_router(chat_router, prefix="/api/chat")
app.include_router(config_router, prefix="/api/chat/config")
app.include_router(file_upload_router, prefix="/api/chat/upload")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Chat App!"}

# Add any middleware or additional configuration specific to this app

