#!/usr/bin/env python3
""" This module contains a class that serves as a database engine.
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


SQLALCHEMY_DATABASE_URL = "sqlite:///./mana_governance.db"

# Create the database engine
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args=({"check_same_thread": False}))

# Create the database session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for declarative models
Base = declarative_base()
