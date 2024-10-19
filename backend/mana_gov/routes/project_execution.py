from fastapi import APIRouter, HTTPException
from typing import List
from mana_gov.models.pydantic.project_execution import ProjectExecution, ProjectExecutionCreate, ProjectExecutionUpdate
from mana_gov.models.pydantic.project_execution import TaskExecution, TaskExecutionCreate, TaskExecutionUpdate  # Added necessary imports for task execution models
from mana_gov.services.project_service import ProjectService

project_execution_router = APIRouter()

# Service instance
project_service = ProjectService()

# GET /api/projects/{project_id}/execution - Fetch project execution by project plan ID
@project_execution_router.get("/projects/{project_id}/execution", response_model=ProjectExecution)
async def get_project_execution(project_id: int):
    try:
        execution = await project_service.get_project_execution_by_project_id(project_id)
        if not execution:
            raise HTTPException(status_code=404, detail="Project execution not found")
        return execution
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# POST /api/projects/{project_id}/execution - Create a new project execution
@project_execution_router.post("/projects/{project_id}/execution", response_model=ProjectExecution)
async def create_project_execution(project_id: int, execution_data: ProjectExecutionCreate):
    try:
        project_execution = await project_service.create_project_execution(project_id, execution_data)
        return project_execution
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# PUT /api/projects/{project_id}/execution - Update project execution
@project_execution_router.put("/projects/{project_id}/execution", response_model=ProjectExecution)
async def update_project_execution(project_id: int, updated_execution: ProjectExecutionUpdate):
    try:
        execution = await project_service.update_project_execution(project_id, updated_execution)
        if not execution:
            raise HTTPException(status_code=404, detail="Project execution not found")
        return execution
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# DELETE /api/projects/{project_id}/execution - Delete a project execution by project ID
@project_execution_router.delete("/projects/{project_id}/execution")
async def delete_project_execution(project_id: int):
    try:
        success = await project_service.delete_project_execution(project_id)
        if not success:
            raise HTTPException(status_code=404, detail="Project execution not found")
        return {"message": "Project execution deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---- Task Execution Endpoints ---- #

# POST /api/projects/{project_id}/execution/task - Create a new task execution
@project_execution_router.post("/projects/{project_id}/execution/task", response_model=TaskExecution)
async def create_task_execution(project_id: int, task_data: TaskExecutionCreate):
    try:
        task_execution = await project_service.create_task_execution(project_id, task_data)
        return task_execution
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# PUT /api/projects/{project_id}/execution/task/{task_id} - Update task execution
@project_execution_router.put("/projects/{project_id}/execution/task/{task_id}", response_model=TaskExecution)
async def update_task_execution(project_id: int, task_id: int, updated_task: TaskExecutionUpdate):
    try:
        task_execution = await project_service.update_task_execution(project_id, task_id, updated_task)
        if not task_execution:
            raise HTTPException(status_code=404, detail="Task execution not found")
        return task_execution
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# DELETE /api/projects/{project_id}/execution/task/{task_id} - Delete task execution
@project_execution_router.delete("/projects/{project_id}/execution/task/{task_id}")
async def delete_task_execution(project_id: int, task_id: int):
    try:
        success = await project_service.delete_task_execution(project_id, task_id)
        if not success:
            raise HTTPException(status_code=404, detail="Task execution not found")
        return {"message": "Task execution deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
