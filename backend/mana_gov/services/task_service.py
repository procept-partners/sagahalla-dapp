from models.project_plan import Task  # Assuming Task model is defined in project_plan.py
from util.database import SessionLocal  # Assuming this provides the database session
from sqlalchemy.orm import Session
from fastapi import HTTPException

class TaskService:
    def __init__(self):
        self.db: Session = SessionLocal()

    # Get all tasks
    async def get_all_tasks(self):
        try:
            tasks = self.db.query(Task).all()
            return tasks
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # Create a new task
    async def create_task(self, task_data: Task):
        try:
            new_task = Task(
                name=task_data.name,
                description=task_data.description,
                status=task_data.status,  # Assuming a status field (e.g., pending, completed)
                assigned_to=task_data.assigned_to,  # Assuming the task is assigned to a user
                project_id=task_data.project_id  # Assuming the task belongs to a project
            )
            self.db.add(new_task)
            self.db.commit()
            self.db.refresh(new_task)  # To return the newly created task with ID
            return new_task
        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=500, detail=str(e))

    # Get a single task by ID
    async def get_task_by_id(self, task_id: int):
        try:
            task = self.db.query(Task).filter(Task.id == task_id).first()
            if not task:
                raise HTTPException(status_code=404, detail="Task not found")
            return task
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # Update a task
    async def update_task(self, task_id: int, updated_data: Task):
        try:
            task = self.db.query(Task).filter(Task.id == task_id).first()
            if not task:
                raise HTTPException(status_code=404, detail="Task not found")

            # Update fields
            task.name = updated_data.name
            task.description = updated_data.description
            task.status = updated_data.status
            task.assigned_to = updated_data.assigned_to

            self.db.commit()
            self.db.refresh(task)
            return task
        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=500, detail=str(e))

    # Delete a task by ID
    async def delete_task(self, task_id: int):
        try:
            task = self.db.query(Task).filter(Task.id == task_id).first()
            if not task:
                raise HTTPException(status_code=404, detail="Task not found")

            self.db.delete(task)
            self.db.commit()
            return True
        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
