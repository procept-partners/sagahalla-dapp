from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Schema for creating a new proposal (submission from front-end)
class ProposalCreate(BaseModel):
    title: str
    description: Optional[str] = None
    mana_hours_budgeted: float
    mana_tokens_allocated: float
    target_date: Optional[datetime] = None
    submitted_by: str  # Logged-in user's ID

    class Config:
        orm_mode = True  # For compatibility with ORM models


# Schema for updating an existing proposal (for use in PUT requests)
class ProposalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    mana_hours_budgeted: Optional[float] = None
    mana_tokens_allocated: Optional[float] = None
    target_date: Optional[datetime] = None
    is_ended: Optional[bool] = None

    class Config:
        orm_mode = True  # For compatibility with ORM models


# Schema for returning a proposal (database model)
class Proposal(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    
    # Voting fields
    yes_votes: int = 0
    no_votes: int = 0
    mana_tokens_allocated: float

    is_ended: bool = False
    submitted_by: str
    mana_hours_budgeted: float
    target_date: Optional[datetime] = None

    # Automatically managed timestamps
    created_at: datetime
    updated_at: Optional[datetime] = None

    # Relationships
    sub_projects: Optional[List["SubProject"]] = []  # List of SubProjects
    budget_items: Optional[List["ProposalBudget"]] = []  # List of ProposalBudgets

    class Config:
        orm_mode = True  # For compatibility with ORM


# Schema for SubProjects within a proposal
class SubProject(BaseModel):
    id: int
    proposal_id: int
    sub_project_name: str

    # Relationships
    proposal: Optional[Proposal] = None  # Link back to the parent Proposal
    epics: Optional[List["Epic"]] = []  # List of Epics under the SubProject

    class Config:
        orm_mode = True  # Ensures compatibility with ORM


# Schema for Epics within a subproject
class Epic(BaseModel):
    id: int
    sub_project_id: int
    epic_name: str

    # Relationships
    sub_project: Optional[SubProject] = None  # Link back to the parent SubProject
    tasks: Optional[List["Task"]] = []  # List of Tasks under the Epic

    class Config:
        orm_mode = True  # Ensures compatibility with ORM


# Schema for Tasks within an epic
class Task(BaseModel):
    id: int
    epic_id: int
    task_name: str

    # Relationships
    epic: Optional[Epic] = None  # Link back to the parent Epic
    roles_mana_hours: Optional[List["RoleManaHours"]] = []  # List of RoleManaHours for the task

    class Config:
        orm_mode = True  # Ensures compatibility with ORM


# Schema for RoleManaHours within a task
class RoleManaHours(BaseModel):
    id: int
    task_id: int
    role_name: str
    mana_hours: float

    # Relationships
    task: Optional[Task] = None  # Link back to the parent Task

    class Config:
        orm_mode = True  # Ensures compatibility with ORM


# Schema for the budget items of a proposal
class ProposalBudget(BaseModel):
    id: int
    proposal_id: int
    role_name: str
    budget_usd: float
    budget_mana: float

    # Relationships
    proposal: Optional[Proposal] = None  # Link back to the parent Proposal

    class Config:
        orm_mode = True  # Ensures compatibility with ORM
