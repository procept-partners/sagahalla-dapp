from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from mana_gov.util.database import Base  # Assuming Base is the declarative base
from .proposal import Proposal

class ProjectPlan(Base):
    __tablename__ = 'project_plans'

    id = Column(Integer, primary_key=True, index=True)
    proposal_id = Column(Integer, ForeignKey('proposals.id'))
    project_name = Column(String, nullable=False)

    # Total Mana hours allocated to the project
    total_mana_hours = Column(Float, nullable=False)

    # Voting power associated with the project
    voting_power = Column(String, nullable=True)

    # Automatically managed timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    sub_projects = relationship("SubProjectPlan", back_populates="project_plan")
    proposal = relationship("Proposal", back_populates="project_plans")


class SubProjectPlan(Base):
    __tablename__ = 'sub_project_plans'

    id = Column(Integer, primary_key=True, index=True)
    project_plan_id = Column(Integer, ForeignKey('project_plans.id'))
    sub_project_name = Column(String, nullable=False)

    project_plan = relationship("ProjectPlan", back_populates="sub_projects")
    epics = relationship("EpicPlan", back_populates="sub_project_plan")


class EpicPlan(Base):
    __tablename__ = 'epic_plans'

    id = Column(Integer, primary_key=True, index=True)
    sub_project_plan_id = Column(Integer, ForeignKey('sub_project_plans.id'))
    epic_name = Column(String, nullable=False)

    sub_project_plan = relationship("SubProjectPlan", back_populates="epics")
    tasks = relationship("TaskPlan", back_populates="epic_plan")


class TaskPlan(Base):
    __tablename__ = 'task_plans'

    id = Column(Integer, primary_key=True, index=True)
    epic_plan_id = Column(Integer, ForeignKey('epic_plans.id'))
    task_name = Column(String, nullable=False)

    # Estimated (planned) mana hours
    estimated_mana_hours = Column(Float, nullable=False)  # Planned hours for the task

    epic_plan = relationship("EpicPlan", back_populates="tasks")
    roles_mana_hours = relationship("TaskRoleManaHours", back_populates="task_plan")



class TaskRoleManaHours(Base):
    __tablename__ = 'task_role_mana_hours'

    id = Column(Integer, primary_key=True, index=True)
    task_plan_id = Column(Integer, ForeignKey('task_plans.id'))
    role_name = Column(String, nullable=False)
    mana_hours = Column(Float, nullable=False)

    task_plan = relationship("TaskPlan", back_populates="roles_mana_hours")
