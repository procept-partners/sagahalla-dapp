#!/usr/bin/env python3
"""
This module contains a class that serves as a database table.
"""

from sqlalchemy import Column, Integer, String, Float
from mana_gov.util.database import Base
from pydantic import BaseModel


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    firstname = Column(String, index=True)
    lastname = Column(String, index=True)
    mana_contribution = Column(Float, default=0.0)


class UserCreate(BaseModel):
    """ Create User Schema
    """
    firstname: str
    lastname: str
    mana_contribution: float = 0.0 
