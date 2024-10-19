from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

# Model for each developer's project data
class DeveloperProjectData(BaseModel):
    developer_name: str
    total_estimated_mana_hours: float  # Total estimated hours for the developer
    total_allocated_mana: float  # Total allocated MANA for the developer
    
    # Relationships
    sub_projects: Optional[List["SubProjectPlan"]] = []  # Developer-specific subprojects

    class Config:
        from_attributes = True
        fields = {
            'developer_name': 'developerName',
            'total_estimated_mana_hours': 'totalEstimatedManaHours',
            'total_allocated_mana': 'totalAllocatedMana',
            'sub_projects': 'subProjects'
        }

# Main ProjectPlan model
class ProjectPlan(BaseModel):
    id: int
    proposal_id: int
    title: str
    total_mana_hours: float  # Developer allocation of hours at the project level
    mana_tokens_allocated: float
    voting_power: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]
    
    # Relationships
    sub_projects: Optional[List["SubProjectPlan"]] = []  # General subprojects
    developers: Optional[Dict[str, DeveloperProjectData]] = {}  # Developer-specific data
    proposal: Optional["Proposal"]
    budget_items: Optional[List["ProposalBudget"]] = []

    class Config:
        from_attributes = True
        fields = {
            'title': 'title',
            'total_mana_hours': 'manaHoursBudgeted',
            'mana_tokens_allocated': 'manaTokensAllocated',
            'created_at': 'createdAt',
            'updated_at': 'updatedAt',
            'sub_projects': 'subProjects',
            'developers': 'developers',  # Field for developers
            'budget_items': 'budgetItems'
        }

class SubProjectPlan(BaseModel):
    id: int
    project_plan_id: int
    sub_project_name: str
    
    # Relationships
    project_plan: Optional[ProjectPlan]
    epics: Optional[List["EpicPlan"]] = []

    class Config:
        from_attributes = True
        fields = {
            'project_plan_id': 'projectPlanId',  # Adjusted from proposalId to projectPlanId
            'sub_project_name': 'subProjectName',
            'epics': 'epics'
        }

class EpicPlan(BaseModel):
    id: int
    sub_project_plan_id: int
    epic_name: str
    
    # Relationships
    sub_project_plan: Optional[SubProjectPlan]
    tasks: Optional[List["TaskPlan"]] = []

    class Config:
        from_attributes = True
        fields = {
            'sub_project_plan_id': 'subProjectId',
            'epic_name': 'epicName',
            'tasks': 'tasks'
        }

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
        fields = {
            'epic_plan_id': 'epicId',
            'task_name': 'taskName',
            'estimated_mana_hours': 'estimatedManaHours',
            'roles_mana_hours': 'rolesManaHours'
        }

class TaskRoleManaHours(BaseModel):
    id: int
    task_plan_id: int
    role_name: str
    mana_hours: float

    # Relationships
    task_plan: Optional[TaskPlan]

    class Config:
        from_attributes = True
        fields = {
            'task_plan_id': 'taskId',
            'role_name': 'roleName',
            'mana_hours': 'manaHours'
        }

class ProposalBudget(BaseModel):
    id: int
    proposal_id: int
    role_name: str
    budget_usd: float
    budget_mana: float

    class Config:
        from_attributes = True
        fields = {
            'proposal_id': 'proposalId',
            'role_name': 'roleName',
            'budget_usd': 'budgetUsd',
            'budget_mana': 'budgetMana'
        }
