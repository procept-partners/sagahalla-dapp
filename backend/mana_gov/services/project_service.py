from mana_gov.models.project_plan import ProjectPlan
from mana_gov.models.project_execution import ProjectExecution
from mana_gov.models.project_plan import TaskPlan
from mana_gov.util.database import SessionLocal
from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import Generator

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
    def create_project(project_data: dict) -> ProjectPlan:
        """
        Creates a new project with the provided data.
        """
        db = next(ProjectService.get_db())
        
        # Ensure alignment of project_data with the expected fields
        new_project = ProjectPlan(
            proposal_id=project_data.get('proposal_id'),
            project_name=project_data.get('project_name'),
            total_mana_hours=project_data.get('total_mana_hours', 0.0),
            voting_power=project_data.get('voting_power', None)
        )
        
        db.add(new_project)
        db.commit()
        db.refresh(new_project)
        return new_project

    @staticmethod
    def get_project(project_id: int) -> ProjectPlan:
        """
        Retrieves a project by its ID.
        """
        db = next(ProjectService.get_db())
        project = db.query(ProjectPlan).filter(ProjectPlan.id == project_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found.")
        return project

    @staticmethod
    def update_project(project_id: int, update_data: dict) -> ProjectPlan:
        """
        Updates the project details.
        """
        db = next(ProjectService.get_db())
        project = db.query(ProjectPlan).filter(ProjectPlan.id == project_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found.")
        
        # Update fields
        project.project_name = update_data.get('project_name', project.project_name)
        project.total_mana_hours = update_data.get('total_mana_hours', project.total_mana_hours)
        project.voting_power = update_data.get('voting_power', project.voting_power)
        
        db.commit()
        db.refresh(project)
        return project

    @staticmethod
    def list_projects() -> list[ProjectPlan]:
        """
        Lists all projects.
        """
        db = next(ProjectService.get_db())
        projects = db.query(ProjectPlan).all()
        return projects

    @staticmethod
    def assign_task_to_project(project_id: int, task_data: dict) -> TaskPlan:
        """
        Assigns a new task to a project by creating the task and linking it.
        """
        db = next(ProjectService.get_db())
        project = db.query(ProjectPlan).filter(ProjectPlan.id == project_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found.")
        
        new_task = TaskPlan(
            task_name=task_data.get('task_name'),
            estimated_mana_hours=task_data.get('estimated_mana_hours', 0.0),
            epic_plan_id=task_data.get('epic_plan_id')  # Assuming task belongs to an epic
        )
        new_task.project_plan_id = project_id
        
        db.add(new_task)
        db.commit()
        db.refresh(new_task)
        return new_task

    @staticmethod
    def track_project_execution(project_id: int, actual_mana_hours: float) -> ProjectExecution:
        """
        Tracks the execution of a project by recording actual MANA hours spent.
        """
        db = next(ProjectService.get_db())
        project_execution = db.query(ProjectExecution).filter(ProjectExecution.project_plan_id == project_id).first()
        
        if not project_execution:
            # If no project execution record exists, create a new one
            project_execution = ProjectExecution(
                project_plan_id=project_id,
                actual_mana_hours=actual_mana_hours  # Track actual MANA hours
            )
            db.add(project_execution)
        else:
            # Update the existing record with new actual hours
            project_execution.actual_mana_hours = actual_mana_hours
        
        db.commit()
        db.refresh(project_execution)
        return project_execution

