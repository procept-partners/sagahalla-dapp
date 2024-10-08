from pydantic import BaseModel, Field
from typing import List, Dict

# Define the Task model
class Task(BaseModel):
    task_name: str = Field(..., description="Name of the task")
    roles_mana_hours: Dict[str, float] = Field(
        ..., description="Mapping of roles to MANA hours for this task"
    )

# Define the Epic model
class Epic(BaseModel):
    epic_name: str = Field(..., description="Name of the epic")
    tasks: List[Task] = Field(..., description="List of tasks associated with this epic")

    # Calculate total MANA hours for the epic (sum of all tasks)
    def calculate_total_mana_hours(self) -> float:
        return sum(sum(task.roles_mana_hours.values()) for task in self.tasks)

    # Return a dictionary of total MANA hours for each role in the epic
    def total_mana_hours_per_role(self) -> Dict[str, float]:
        role_hours: Dict[str, float] = {}
        for task in self.tasks:
            for role, hours in task.roles_mana_hours.items():
                if role in role_hours:
                    role_hours[role] += hours
                else:
                    role_hours[role] = hours
        return role_hours

# Define the Sub-Project model
class SubProject(BaseModel):
    sub_project_name: str = Field(..., description="Name of the sub-project")
    epics: List[Epic] = Field(..., description="List of epics associated with this sub-project")
    total_mana_hours: float = Field(..., description="Total MANA hours allocated for this sub-project")

    # Calculate total MANA hours for the sub-project (sum of all epics)
    def calculate_total_mana_hours(self) -> float:
        return sum(epic.calculate_total_mana_hours() for epic in self.epics)

    # Return a dictionary of total MANA hours for each role in the sub-project
    def total_mana_hours_per_role(self) -> Dict[str, float]:
        role_hours: Dict[str, float] = {}
        for epic in self.epics:
            epic_role_hours = epic.total_mana_hours_per_role()
            for role, hours in epic_role_hours.items():
                if role in role_hours:
                    role_hours[role] += hours
                else:
                    role_hours[role] = hours
        return role_hours

# Define the Project model
class Project(BaseModel):
    project_name: str = Field(..., description="Name of the overall project")
    sub_projects: List[SubProject] = Field(..., description="List of sub-projects within this project")
    total_mana_hours: float = Field(..., description="Total MANA hours for the entire project")

    # Calculate total MANA hours for the project (sum of all sub-projects)
    def calculate_total_mana_hours(self) -> float:
        return sum(sub_project.calculate_total_mana_hours() for sub_project in self.sub_projects)

    # Return a dictionary of total MANA hours for each role in the project
    def total_mana_hours_per_role(self) -> Dict[str, float]:
        role_hours: Dict[str, float] = {}
        for sub_project in self.sub_projects:
            sub_project_role_hours = sub_project.total_mana_hours_per_role()
            for role, hours in sub_project_role_hours.items():
                if role in role_hours:
                    role_hours[role] += hours
                else:
                    role_hours[role] = hours
        return role_hours

