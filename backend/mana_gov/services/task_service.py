from mana_gov.models.task_plan import TaskPlan
from mana_gov.models.task_execution import TaskExecution
from mana_gov.models.task_feedback import TaskFeedback
from mana_gov.util.database import SessionLocal
from sqlalchemy.orm import Session
from fastapi import HTTPException

class TaskService:
    @staticmethod
    def get_db() -> Session:
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    @staticmethod
    def create_task(task_data: dict) -> TaskPlan:
        """
        Creates a new task and assigns it to a project.
        """
        db = next(TaskService.get_db())
        new_task = TaskPlan(**task_data)
        
        db.add(new_task)
        db.commit()
        db.refresh(new_task)
        return new_task

    @staticmethod
    def assign_task_to_user(task_id: int, user_id: int) -> TaskPlan:
        """
        Assigns a task to a user.
        """
        db = next(TaskService.get_db())
        task = db.query(TaskPlan).filter(TaskPlan.id == task_id).first()
        if not task:
            raise HTTPException(status_code=404, detail="Task not found.")
        
        task.assigned_user_id = user_id
        db.commit()
        db.refresh(task)
        return task

    @staticmethod
    def track_task_execution(task_id: int, actual_hours: float) -> TaskExecution:
        """
        Tracks the execution of a task by recording actual hours worked.
        """
        db = next(TaskService.get_db())
        task_execution = db.query(TaskExecution).filter(TaskExecution.task_plan_id == task_id).first()
        
        if not task_execution:
            # If no task execution record exists, create a new one
            task_execution = TaskExecution(
                task_plan_id=task_id,
                actual_hours=actual_hours
            )
            db.add(task_execution)
        else:
            # Update the existing record with new hours
            task_execution.actual_hours = actual_hours
        
        db.commit()
        db.refresh(task_execution)
        return task_execution

    @staticmethod
    def get_task(task_id: int) -> TaskPlan:
        """
        Retrieves a task by its ID.
        """
        db = next(TaskService.get_db())
        task = db.query(TaskPlan).filter(TaskPlan.id == task_id).first()
        if not task:
            raise HTTPException(status_code=404, detail="Task not found.")
        return task

    @staticmethod
    def submit_task_feedback(task_id: int, feedback_data: dict) -> TaskFeedback:
        """
        Submits feedback for a task.
        """
        db = next(TaskService.get_db())
        task_execution = db.query(TaskExecution).filter(TaskExecution.task_plan_id == task_id).first()
        if not task_execution:
            raise HTTPException(status_code=404, detail="Task execution not found.")

        # Create the feedback entry
        task_feedback = TaskFeedback(**feedback_data, task_execution_id=task_execution.id)
        
        db.add(task_feedback)
        db.commit()
        db.refresh(task_feedback)
        return task_feedback

    @staticmethod
    def list_tasks_by_project(project_id: int) -> list[TaskPlan]:
        """
        Lists all tasks assigned to a specific project.
        """
        db = next(TaskService.get_db())
        tasks = db.query(TaskPlan).filter(TaskPlan.project_plan_id == project_id).all()
        return tasks
