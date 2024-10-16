from models.project_plan import ProjectPlan
from models.project_execution import ProjectExecution
from models.task_plan import TaskPlan
from util.database import SessionLocal
from sqlalchemy.orm import Session
from fastapi import HTTPException

class ProjectService:
    @staticmethod
    def get_db() -> Session:
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
        new_project = ProjectPlan(**project_data)
        
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
        
        for key, value in update_data.items():
            setattr(project, key, value)
        
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
        
        new_task = TaskPlan(**task_data)
        new_task.project_plan_id = project_id
        
        db.add(new_task)
        db.commit()
        db.refresh(new_task)
        return new_task

    @staticmethod
    def track_project_execution(project_id: int, actual_total_hours: float) -> ProjectExecution:
        """
        Tracks the execution of a project by recording actual total hours.
        """
        db = next(ProjectService.get_db())
        project_execution = db.query(ProjectExecution).filter(ProjectExecution.project_plan_id == project_id).first()
        
        if not project_execution:
            # If no project execution record exists, create a new one
            project_execution = ProjectExecution(
                project_plan_id=project_id,
                actual_total_hours=actual_total_hours
            )
            db.add(project_execution)
        else:
            # Update the existing record with new hours
            project_execution.actual_total_hours = actual_total_hours
        
        db.commit()
        db.refresh(project_execution)
        return project_execution
