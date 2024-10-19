from mana_gov.models.project_plan import ProjectPlan, TaskPlan
from mana_gov.models.project_execution import ProjectExecution
from mana_gov.util.database import SessionLocal
from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List, Generator


class ProjectService:
    @staticmethod
    def get_db() -> Generator[Session, None, None]:
        """
        Dependency for yielding a database session.
        """
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    @staticmethod
    def create_project(project_data: dict, db: Session) -> ProjectPlan:
        """
        Creates a new project with the provided data.
        """
        # Ensure alignment of project_data with the expected fields
        new_project = ProjectPlan(
            proposal_id=project_data.get('proposal_id'),
            title=project_data.get('project_name'),
            total_mana_hours=project_data.get('total_mana_hours', 0.0),
            voting_power=project_data.get('voting_power', None),
            mana_tokens_allocated=project_data.get('mana_tokens_allocated', 0.0)
        )
        
        db.add(new_project)
        db.commit()
        db.refresh(new_project)
        return new_project

    @staticmethod
    def get_project(project_id: int, db: Session) -> ProjectPlan:
        """
        Retrieves a project by its ID.
        """
        project = db.query(ProjectPlan).filter(ProjectPlan.id == project_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found.")
        return project

    @staticmethod
    def update_project(project_id: int, update_data: dict, db: Session) -> ProjectPlan:
        """
        Updates the project details.
        """
        project = db.query(ProjectPlan).filter(ProjectPlan.id == project_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found.")
        
        # Update fields
        project.title = update_data.get('project_name', project.title)
        project.total_mana_hours = update_data.get('total_mana_hours', project.total_mana_hours)
        project.voting_power = update_data.get('voting_power', project.voting_power)
        project.mana_tokens_allocated = update_data.get('mana_tokens_allocated', project.mana_tokens_allocated)
        
        db.commit()
        db.refresh(project)
        return project

    @staticmethod
    def list_projects(db: Session) -> List[ProjectPlan]:
        """
        Lists all projects.
        """
        projects = db.query(ProjectPlan).all()
        return projects

    @staticmethod
    def assign_task_to_project(project_id: int, task_data: dict, db: Session) -> TaskPlan:
        """
        Assigns a new task to a project by creating the task and linking it.
        """
        project = db.query(ProjectPlan).filter(ProjectPlan.id == project_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found.")
        
        new_task = TaskPlan(
            task_name=task_data.get('task_name'),
            estimated_mana_hours=task_data.get('estimated_mana_hours', 0.0),
            epic_plan_id=task_data.get('epic_plan_id'),  # Assuming task belongs to an epic
            project_plan_id=project_id  # Link task to the project
        )
        
        db.add(new_task)
        db.commit()
        db.refresh(new_task)
        return new_task

    @staticmethod
    def track_project_execution(project_id: int, actual_mana_hours: float, db: Session) -> ProjectExecution:
        """
        Tracks the execution of a project by recording actual MANA hours spent.
        """
        project_execution = db.query(ProjectExecution).filter(ProjectExecution.project_plan_id == project_id).first()
        
        if not project_execution:
            # If no project execution record exists, create a new one
            project_execution = ProjectExecution(
                project_plan_id=project_id,
                actual_total_hours=actual_mana_hours  # Track actual MANA hours
            )
            db.add(project_execution)
        else:
            # Update the existing record with new actual hours
            project_execution.actual_total_hours = actual_mana_hours
        
        db.commit()
        db.refresh(project_execution)
        return project_execution
