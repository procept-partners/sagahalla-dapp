#!/usr/bin/env python3
""" This file contains a FastAPI app.
"""

from fastapi import FastAPI
from app.database import engine, Base

app = FastAPI()

# Create all database tables
Base.metadata.create_all(bind=engine)


@app.get("/")
def read_root():
    return {"message": "Welcome to MANA Governance System!"}