from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ProjectExecution(BaseModel):
    id: int
    project_plan_id: int  # Link to the project plan
    actual_mana_hours: float  # Actual MANA hours spent during execution

    # Relationships
    project_plan: Optional["ProjectPlan"]  # Link to the original project plan
    peer_votes: Optional[List["PeerVote"]] = []  # Peer voting for validation
    tasks: Optional[List["TaskExecution"]] = []  # Task execution records

    class Config:
        from_attributes = True


class TaskExecution(BaseModel):
    id: int
    project_execution_id: int  # Link to the project execution
    task_plan_id: int  # Link to the planned task
    actual_mana_hours: float  # Actual hours spent on this task

    # Relationships
    project_execution: Optional[ProjectExecution]  # Link to the project execution
    task_plan: Optional["TaskPlan"]  # Link to the original task plan
    
    class Config:
        from_attributes = True


class TaskFeedback(BaseModel):
    id: int
    task_execution_id: int  # Link to the task execution
    user_id: int  # ID of the user providing feedback
    feedback: str  # Textual feedback on task performance
    rating: int  # Rating scale (e.g., 1-5)
    created_at: datetime

    # Relationships
    task_execution: Optional[TaskExecution]  # Link to the executed task
    user: Optional["User"]  # Link to the user providing feedback

    class Config:
        from_attributes = True


class PeerVote(BaseModel):
    id: int
    project_execution_id: int  # Link to the project execution
    user_id: int  # ID of the voting user
    vote: bool  # True for approval, False for rejection
    created_at: datetime

    # Relationships
    project_execution: Optional[ProjectExecution]  # Link to the project execution
    user: Optional["User"]  # Link to the voting user

    class Config:
        from_attributes = True
