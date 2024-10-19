from mana_gov.models.project_plan import TaskPlan
from mana_gov.models.project_execution import TaskExecution, TaskFeedback
from mana_gov.util.database import SessionLocal
from sqlalchemy.orm import Session
from fastapi import HTTPException
from contextlib import contextmanager
from typing import Generator, List, Dict

class TaskService:
    @staticmethod
    @contextmanager
    def get_db() -> Generator[Session, None, None]:
        """
        Provides a database session and ensures it's properly closed after use.
        """
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    @staticmethod
    def create_task(task_data: Dict) -> TaskPlan:
        """
        Creates a new task and assigns it to a project.
        """
        with TaskService.get_db() as db:
            try:
                new_task = TaskPlan(**task_data)
                db.add(new_task)
                db.commit()
                db.refresh(new_task)
                return new_task
            except Exception as e:
                db.rollback()
                raise HTTPException(status_code=500, detail=f"Failed to create task: {str(e)}")

    @staticmethod
    def assign_task_to_user(task_id: int, user_id: int) -> TaskPlan:
        """
        Assigns a task to a user.
        """
        with TaskService.get_db() as db:
            task = db.query(TaskPlan).filter(TaskPlan.id == task_id).first()
            if not task:
                raise HTTPException(status_code=404, detail="Task not found.")
            
            try:
                task.assigned_user_id = user_id
                db.commit()
                db.refresh(task)
                return task
            except Exception as e:
                db.rollback()
                raise HTTPException(status_code=500, detail=f"Failed to assign user to task: {str(e)}")

    @staticmethod
    def track_task_execution(task_id: int, actual_hours: float) -> TaskExecution:
        """
        Tracks the execution of a task by recording actual hours worked.
        """
        with TaskService.get_db() as db:
            task_execution = db.query(TaskExecution).filter(TaskExecution.task_plan_id == task_id).first()
            
            if not task_execution:
                # Create a new execution record if it doesn't exist
                task_execution = TaskExecution(
                    task_plan_id=task_id,
                    actual_hours=actual_hours
                )
                db.add(task_execution)
            else:
                # Update existing execution record with new hours
                task_execution.actual_hours = actual_hours
            
            try:
                db.commit()
                db.refresh(task_execution)
                return task_execution
            except Exception as e:
                db.rollback()
                raise HTTPException(status_code=500, detail=f"Failed to track task execution: {str(e)}")

    @staticmethod
    def get_task(task_id: int) -> TaskPlan:
        """
        Retrieves a task by its ID.
        """
        with TaskService.get_db() as db:
            task = db.query(TaskPlan).filter(TaskPlan.id == task_id).first()
            if not task:
                raise HTTPException(status_code=404, detail="Task not found.")
            return task

    @staticmethod
    def submit_task_feedback(task_id: int, feedback_data: Dict) -> TaskFeedback:
        """
        Submits feedback for a task.
        """
        with TaskService.get_db() as db:
            task_execution = db.query(TaskExecution).filter(TaskExecution.task_plan_id == task_id).first()
            if not task_execution:
                raise HTTPException(status_code=404, detail="Task execution not found.")

            # Create the feedback entry
            task_feedback = TaskFeedback(**feedback_data, task_execution_id=task_execution.id)
            
            try:
                db.add(task_feedback)
                db.commit()
                db.refresh(task_feedback)
                return task_feedback
            except Exception as e:
                db.rollback()
                raise HTTPException(status_code=500, detail=f"Failed to submit task feedback: {str(e)}")

    @staticmethod
    def list_tasks_by_project(project_id: int) -> List[TaskPlan]:
        """
        Lists all tasks assigned to a specific project.
        """
        with TaskService.get_db() as db:
            try:
                tasks = db.query(TaskPlan).filter(TaskPlan.project_plan_id == project_id).all()
                return tasks
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Failed to list tasks for project: {str(e)}")
