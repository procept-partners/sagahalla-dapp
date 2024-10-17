from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ProjectPlan(BaseModel):
    id: int
    proposal_id: int
    project_name: str
    total_mana_hours: float
    voting_power: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]
    
    # Relationships
    sub_projects: Optional[List["SubProjectPlan"]] = []
    proposal: Optional["Proposal"]

    class Config:
        from_attributes = True


class SubProjectPlan(BaseModel):
    id: int
    project_plan_id: int
    sub_project_name: str
    
    # Relationships
    project_plan: Optional[ProjectPlan]
    epics: Optional[List["EpicPlan"]] = []

    class Config:
        from_attributes = True


class EpicPlan(BaseModel):
    id: int
    sub_project_plan_id: int
    epic_name: str
    
    # Relationships
    sub_project_plan: Optional[SubProjectPlan]
    tasks: Optional[List["TaskPlan"]] = []

    class Config:
        from_attributes = True


class TaskPlan(BaseModel):
    id: int
    epic_plan_id: int
    task_name: str
    estimated_mana_hours: float
    
    # Relationships
    epic_plan: Optional[EpicPlan]
    roles_mana_hours: Optional[List["TaskRoleManaHours"]] = []

    class Config:
        from_attributes = True


class TaskRoleManaHours(BaseModel):
    id: int
    task_plan_id: int
    role_name: str
    mana_hours: float
    
    # Relationships
    task_plan: Optional[TaskPlan]

    class Config:
        from_attributes = True
