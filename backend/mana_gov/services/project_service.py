from models.project import Project  # Assuming this is the Project model
from util.database import SessionLocal  # Assuming this provides the database session
from sqlalchemy.orm import Session
from fastapi import HTTPException

class ProjectService:
    def __init__(self):
        self.db: Session = SessionLocal()

    # Get all projects
    async def get_all_projects(self):
        try:
            projects = self.db.query(Project).all()
            return projects
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # Create a new project
    async def create_project(self, project_data: Project):
        try:
            new_project = Project(
                name=project_data.name,
                description=project_data.description,
                status=project_data.status,  # Assuming there's a status field
                owner_id=project_data.owner_id  # Assuming the project has an owner ID
            )
            self.db.add(new_project)
            self.db.commit()
            self.db.refresh(new_project)  # To return the newly created project with ID
            return new_project
        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=500, detail=str(e))

    # Get a single project by ID
    async def get_project_by_id(self, project_id: int):
        try:
            project = self.db.query(Project).filter(Project.id == project_id).first()
            if not project:
                raise HTTPException(status_code=404, detail="Project not found")
            return project
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # Update a project
    async def update_project(self, project_id: int, updated_data: Project):
        try:
            project = self.db.query(Project).filter(Project.id == project_id).first()
            if not project:
                raise HTTPException(status_code=404, detail="Project not found")

            # Update fields
            project.name = updated_data.name
            project.description = updated_data.description
            project.status = updated_data.status

            self.db.commit()
            self.db.refresh(project)
            return project
        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=500, detail=str(e))

    # Delete a project by ID
    async def delete_project(self, project_id: int):
        try:
            project = self.db.query(Project).filter(Project.id == project_id).first()
            if not project:
                raise HTTPException(status_code=404, detail="Project not found")

            self.db.delete(project)
            self.db.commit()
            return True
        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
