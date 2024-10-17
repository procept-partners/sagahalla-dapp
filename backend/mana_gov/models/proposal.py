from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Proposal(BaseModel):
    id: int
    title: str
    description: Optional[str]
    
    # Voting fields
    yes_votes: Optional[int] = 0
    no_votes: Optional[int] = 0
    total_tokens_allocated: float
    total_tokens: Optional[float]

    is_ended: Optional[bool] = False
    submitted_by: str
    hours_required: float
    token_per_hour: float
    end_time: Optional[datetime]

    # Automatically managed timestamps
    created_at: datetime
    updated_at: Optional[datetime]

    # Relationships
    sub_projects: Optional[List["SubProject"]] = []  # List of SubProjects
    budget_items: Optional[List["ProposalBudget"]] = []  # List of ProposalBudgets

    class Config:
        orm_mode = True


class SubProject(BaseModel):
    id: int
    proposal_id: int
    sub_project_name: str

    # Relationships
    proposal: Optional[Proposal]  # Link back to the parent Proposal
    epics: Optional[List["Epic"]] = []  # List of Epics under the SubProject

    class Config:
        orm_mode = True


class Epic(BaseModel):
    id: int
    sub_project_id: int
    epic_name: str

    # Relationships
    sub_project: Optional[SubProject]  # Link back to the parent SubProject
    tasks: Optional[List["Task"]] = []  # List of Tasks under the Epic

    class Config:
        orm_mode = True


class Task(BaseModel):
    id: int
    epic_id: int
    task_name: str

    # Relationships
    epic: Optional[Epic]  # Link back to the parent Epic
    roles_mana_hours: Optional[List["RoleManaHours"]] = []  # List of RoleManaHours for the task

    class Config:
        orm_mode = True


class RoleManaHours(BaseModel):
    id: int
    task_id: int
    role_name: str
    mana_hours: float

    # Relationships
    task: Optional[Task]  # Link back to the parent Task

    class Config:
        orm_mode = True


class ProposalBudget(BaseModel):
    id: int
    proposal_id: int
    role_name: str
    budget_usd: float
    budget_mana: float

    # Relationships
    proposal: Optional[Proposal]  # Link back to the parent Proposal

    class Config:
        orm_mode = True
