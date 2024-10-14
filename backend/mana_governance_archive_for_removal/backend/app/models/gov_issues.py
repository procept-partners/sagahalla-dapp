#!/usr/bin/env python3
"""This file contains a class that serves as a database table.
"""
from sqlalchemy import Integer, Column, String, Boolean
from app.database import Base


class GovernanceIssue(Base):
    __tablename__ = "governance_issues"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    resolved = Column(Boolean, default=True)