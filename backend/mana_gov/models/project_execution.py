from sqlalchemy import (
    Column, Integer, Float, String, ForeignKey, DateTime, func
)

from sqlalchemy.orm import relationship
from mana_gov.util.database import Base

# Project Execution Model (with voting relationship)
class ProjectExecution(Base):
    __tablename__ = 'project_executions'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    project_plan_id = Column(Integer, ForeignKey('project_plans.id'))

    # Sum of all actual hours worked (across roles and users)
    actual_total_hours = Column(Float, nullable=False)

    # Relationships
    project_plan = relationship("ProjectPlan", back_populates="executions")
    peer_votes = relationship("PeerVote", back_populates="project_execution", cascade="all, delete-orphan")
    tasks = relationship("TaskExecution", back_populates="project_execution", cascade="all, delete-orphan")


# TaskExecution Model (tracks the execution of individual tasks)
class TaskExecution(Base):
    __tablename__ = 'task_executions'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    project_execution_id = Column(Integer, ForeignKey('project_executions.id'))
    task_plan_id = Column(Integer, ForeignKey('task_plans.id'))

    # Actual hours worked, summed from all role assignments
    actual_hours = Column(Float, nullable=False)

    # Relationships
    project_execution = relationship("ProjectExecution", back_populates="tasks")
    task_plan = relationship("TaskPlan", back_populates="executions")
    feedback = relationship("TaskFeedback", back_populates="task_execution", cascade="all, delete-orphan")


# TaskFeedback Model (tracks feedback for tasks)
class TaskFeedback(Base):
    __tablename__ = 'task_feedback'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    task_execution_id = Column(Integer, ForeignKey('task_executions.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    
    # Feedback details
    feedback = Column(String, nullable=False)  # Textual feedback
    rating = Column(Integer, nullable=False)  # Rating scale (e.g., 1-5)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    task_execution = relationship("TaskExecution", back_populates="feedback")
    user = relationship("User", back_populates="task_feedback")


# Add relationship in TaskPlan to link to TaskExecution
class TaskPlan(Base):
    __tablename__ = 'task_plans'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    # Other fields...

    # Relationships
    executions = relationship("TaskExecution", back_populates="task_plan")


# Add relationship in ProjectPlan to link to ProjectExecution
class ProjectPlan(Base):
    __tablename__ = 'project_plans'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    # Other fields...

    # Relationships
    executions = relationship("ProjectExecution", back_populates="project_plan")


# Add PeerVote model (as an assumption since peer voting was referenced)
class PeerVote(Base):
    __tablename__ = 'peer_votes'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    project_execution_id = Column(Integer, ForeignKey('project_executions.id'))
    voter_id = Column(Integer, ForeignKey('users.id'))
    votee_id = Column(Integer, ForeignKey('users.id'))
    allocation = Column(Integer, nullable=False)  # Allocation percentage (0-100)

    # Relationships
    project_execution = relationship("ProjectExecution", back_populates="peer_votes")
    voter = relationship("User", foreign_keys=[voter_id])
    votee = relationship("User", foreign_keys=[votee_id])


# Add User model relationship to track feedback and peer voting
class User(Base):
    __tablename__ = 'users'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    # Other fields...

    # Relationships
    task_feedback = relationship("TaskFeedback", back_populates="user", cascade="all, delete-orphan")
    peer_votes_given = relationship("PeerVote", foreign_keys="[PeerVote.voter_id]", back_populates="voter")
    peer_votes_received = relationship("PeerVote", foreign_keys="[PeerVote.votee_id]", back_populates="votee")
