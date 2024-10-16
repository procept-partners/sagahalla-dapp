from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from util.database import Base

# Project Execution Model (with voting relationship)
class ProjectExecution(Base):
    __tablename__ = 'project_executions'

    id = Column(Integer, primary_key=True, index=True)
    project_plan_id = Column(Integer, ForeignKey('project_plans.id'))

    # Sum of all actual hours worked (across roles and users)
    actual_total_hours = Column(Float, nullable=False)

    # Relationships
    project_plan = relationship("ProjectPlan", back_populates="executions")
    peer_votes = relationship("PeerVote", back_populates="project_execution")
    tasks = relationship("TaskExecution", back_populates="project_execution")

# TaskExecution Model (tracks the execution of individual tasks)
class TaskExecution(Base):
    __tablename__ = 'task_executions'

    id = Column(Integer, primary_key=True, index=True)
    project_execution_id = Column(Integer, ForeignKey('project_executions.id'))
    task_plan_id = Column(Integer, ForeignKey('task_plans.id'))

    # Actual hours worked, summed from all role assignments
    actual_hours = Column(Float, nullable=False)

    # Relationships
    project_execution = relationship("ProjectExecution", back_populates="tasks")
    task_plan = relationship("TaskPlan", back_populates="executions")

# TaskFeedback Model (tracks feedback for tasks)
class TaskFeedback(Base):
    __tablename__ = 'task_feedback'

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
