from fastapi import APIRouter, HTTPException
from typing import List
from mana_gov.models.project_plan import Task  # Assuming Task model is in project_plan.py
from mana_gov.services.task_service import TaskService  # Assuming this service handles the business logic

tasks_router = APIRouter()

# Service instance
task_service = TaskService()

# GET /api/tasks - List all tasks
@tasks_router.get("/tasks", response_model=List[Task])
async def list_tasks():
    try:
        tasks = await task_service.get_all_tasks()
        return tasks
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# POST /api/tasks - Create a new task
@tasks_router.post("/tasks", response_model=Task)
async def create_task(task: Task):
    try:
        new_task = await task_service.create_task(task)
        return new_task
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# GET /api/tasks/{id} - Fetch a single task by ID
@tasks_router.get("/tasks/{id}", response_model=Task)
async def get_task(id: int):
    try:
        task = await task_service.get_task_by_id(id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        return task
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# PUT /api/tasks/{id} - Update a task by ID
@tasks_router.put("/tasks/{id}", response_model=Task)
async def update_task(id: int, updated_task: Task):
    try:
        task = await task_service.update_task(id, updated_task)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        return task
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# DELETE /api/tasks/{id} - Delete a task by ID
@tasks_router.delete("/tasks/{id}")
async def delete_task(id: int):
    try:
        success = await task_service.delete_task(id)
        if not success:
            raise HTTPException(status_code=404, detail="Task not found")
        return {"message": "Task deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
