#!/usr/bin/env python3
""" This module contains a class that serves as a database engine.
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = f"sqlite:///./mana_gov.db"

# Create the database engine
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args=({"check_same_thread": False}))

# Create the database session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for declarative models
Base = declarative_base()

def get_db():
    db: Session = SessionLocal()    # Create a new database session
    try:
        yield db    # Yield the session for use in the request
    finally:
        db.close()  # Ensure the session is closed after the request is done
