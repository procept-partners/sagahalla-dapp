from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from mana_gov.util.database import Base  # Assuming Base is your declarative base

class Proposal(Base):
    __tablename__ = 'proposals'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    
    # Voting fields
    yes_votes = Column(Integer, default=0)
    no_votes = Column(Integer, default=0)
    total_tokens_allocated = Column(Float, nullable=False)
    total_tokens = Column(Float, nullable=True)

    is_ended = Column(Boolean, default=False)
    submitted_by = Column(String, nullable=False)
    hours_required = Column(Float, nullable=False)
    token_per_hour = Column(Float, nullable=False)
    end_time = Column(DateTime, nullable=True)

    # Automatically managed timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    sub_projects = relationship("SubProject", back_populates="proposal")
    budget_items = relationship("ProposalBudget", back_populates="proposal")


class SubProject(Base):
    __tablename__ = 'sub_projects'

    id = Column(Integer, primary_key=True, index=True)
    proposal_id = Column(Integer, ForeignKey('proposals.id'))
    sub_project_name = Column(String, nullable=False)

    proposal = relationship("Proposal", back_populates="sub_projects")
    epics = relationship("Epic", back_populates="sub_project")


class Epic(Base):
    __tablename__ = 'epics'

    id = Column(Integer, primary_key=True, index=True)
    sub_project_id = Column(Integer, ForeignKey('sub_projects.id'))
    epic_name = Column(String, nullable=False)

    sub_project = relationship("SubProject", back_populates="epics")
    tasks = relationship("Task", back_populates="epic")


class Task(Base):
    __tablename__ = 'tasks'

    id = Column(Integer, primary_key=True, index=True)
    epic_id = Column(Integer, ForeignKey('epics.id'))
    task_name = Column(String, nullable=False)

    epic = relationship("Epic", back_populates="tasks")
    roles_mana_hours = relationship("RoleManaHours", back_populates="task")


class RoleManaHours(Base):
    __tablename__ = 'roles_mana_hours'

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey('tasks.id'))
    role_name = Column(String, nullable=False)
    mana_hours = Column(Float, nullable=False)

    task = relationship("Task", back_populates="roles_mana_hours")


class ProposalBudget(Base):
    __tablename__ = 'proposal_budgets'

    id = Column(Integer, primary_key=True, index=True)
    proposal_id = Column(Integer, ForeignKey('proposals.id'))
    role_name = Column(String, nullable=False)
    budget_usd = Column(Float, nullable=False)
    budget_mana = Column(Float, nullable=False)

    proposal = relationship("Proposal", back_populates="budget_items")
