from fastapi import APIRouter, HTTPException, status
from typing import List
from mana_gov.models.pydantic.project_plan import Project, ProjectCreate, ProjectUpdate
from mana_gov.services.project_service import ProjectService

projects_router = APIRouter()

# Service instance
project_service = ProjectService()

# GET /api/projects - List all projects
@projects_router.get("/projects", response_model=List[Project])
async def list_projects():
    try:
        projects = await project_service.get_all_projects()  # Ensure this method is async
        return projects
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# POST /api/projects - Create a new project
@projects_router.post("/projects", response_model=Project, status_code=status.HTTP_201_CREATED)
async def create_project(project: ProjectCreate):
    try:
        new_project = await project_service.create_project(project)  # Ensure async method
        return new_project
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# GET /api/projects/{id} - Fetch a single project by ID
@projects_router.get("/projects/{id}", response_model=Project)
async def get_project(id: int):
    try:
        project = await project_service.get_project_by_id(id)  # Ensure async method
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        return project
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# PUT /api/projects/{id} - Update a project by ID
@projects_router.put("/projects/{id}", response_model=Project)
async def update_project(id: int, updated_project: ProjectUpdate):
    try:
        project = await project_service.update_project(id, updated_project)  # Ensure async method
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        return project
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# DELETE /api/projects/{id} - Delete a project by ID
@projects_router.delete("/projects/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(id: int):
    try:
        success = await project_service.delete_project(id)  # Ensure async method
        if not success:
            raise HTTPException(status_code=404, detail="Project not found")
        return {"message": "Project deleted successfully"}  # Or return `None` for 204 status
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
