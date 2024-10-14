#!/usr/bin/env python3
"""This file contains a class that serves as a database table.
"""
from sqlalchemy import Column, Integer, String
from app.database import Base


class Vote(Base):
    
    __tablename__ = 'votes'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    governance_issue_id = Column(Integer, ForeignKey('governance_issues.id'))
    vote_choice = Column(String)
    weighted_value = Column(Float)
