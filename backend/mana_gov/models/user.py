#!/usr/bin/env python3
"""
This module contains a class that serves as a database table.
"""

from sqlalchemy import Column, Integer, String, Float
from app.database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    mana_contribution = Column(Float, default=0.0)

