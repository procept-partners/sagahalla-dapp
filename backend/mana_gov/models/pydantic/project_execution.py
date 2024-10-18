from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ProjectExecution(BaseModel):
    id: int
    project_plan_id: int
    actual_mana_hours: float

    # Relationships
    project_plan: Optional["ProjectPlan"]
    peer_votes: Optional[List["PeerVote"]] = []
    tasks: Optional[List["TaskExecution"]] = []

    class Config:
        from_attributes = True


class TaskExecution(BaseModel):
    id: int
    project_execution_id: int
    task_plan_id: int
    actual_mana_hours: float

    # Relationships
    project_execution: Optional[ProjectExecution]
    task_plan: Optional["TaskPlan"]
    
    class Config:
        from_attributes = True


class TaskFeedback(BaseModel):
    id: int
    task_execution_id: int
    user_id: int
    feedback: str  # Textual feedback
    rating: int  # Rating scale (e.g., 1-5)
    created_at: datetime

    # Relationships
    task_execution: Optional[TaskExecution]
    user: Optional["User"]

    class Config:
        from_attributes = True
