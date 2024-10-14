from pydantic import BaseModel, Field
from typing import List, Dict

# Define the Task model
class Task(BaseModel):
    task_name: str = Field(..., description="Name of the task")
    roles_mana_hours: Dict[str, float] = Field(
        ..., description="Mapping of roles to MANA hours for this task"
    )

    def calculate_task_mana_hours(self) -> float:
        """Calculate total MANA hours for this task."""
        return sum(self.roles_mana_hours.values())  # Sum MANA hours for all roles in this task


class Epic(BaseModel):
    epic_name: str
    tasks: List[Task]

    def calculate_total_mana_hours(self) -> float:
        """Sum total MANA hours across all tasks in this epic."""
        return sum(task.calculate_task_mana_hours() for task in self.tasks)

    def total_mana_hours_per_role(self) -> dict:
        """Return a dictionary of total MANA hours per role across all tasks in this epic."""
        role_hours = {}
        for task in self.tasks:
            for role, hours in task.roles_mana_hours.items():
                if role in role_hours:
                    role_hours[role] += hours
                else:
                    role_hours[role] = hours
        return role_hours


class SubProject(BaseModel):
    sub_project_name: str
    epics: List[Epic]

    def calculate_total_mana_hours(self) -> float:
        """Sum total MANA hours across all epics in this sub-project."""
        return sum(epic.calculate_total_mana_hours() for epic in self.epics)

    def total_mana_hours_per_role(self) -> dict:
        """Return a dictionary of total MANA hours per role across all epics in this sub-project."""
        role_hours = {}
        for epic in self.epics:
            epic_role_hours = epic.total_mana_hours_per_role()
            for role, hours in epic_role_hours.items():
                if role in role_hours:
                    role_hours[role] += hours
                else:
                    role_hours[role] = hours
        return role_hours


class Project(BaseModel):
    project_name: str = Field(..., description="Name of the overall project")
    sub_projects: List[SubProject] = Field(..., description="List of sub-projects within this project")

    def calculate_total_mana_hours(self) -> float:
        """Sum total MANA hours across all sub-projects in the project."""
        return sum(sub_project.calculate_total_mana_hours() for sub_project in self.sub_projects)

    def total_mana_hours_per_role(self) -> Dict[str, float]:
        """Return a dictionary of total MANA hours per role across all sub-projects."""
        role_hours: Dict[str, float] = {}
        for sub_project in self.sub_projects:
            sub_project_role_hours = sub_project.total_mana_hours_per_role()
            for role, hours in sub_project_role_hours.items():
                if role in role_hours:
                    role_hours[role] += hours
                else:
                    role_hours[role] = hours
        return role_hours

    def calculate_project_budget(self, global_avg_rates: Dict[str, float]) -> float:
        """Calculate total project budget in USD using global average hourly rates."""
        total_budget = 0.0
        # Get total MANA hours per role
        role_hours = self.total_mana_hours_per_role()
        
        # Calculate cost per role using the role multipliers and global average rates
        for role, hours in role_hours.items():
            if role in global_avg_rates:
                rate = global_avg_rates[role]
                total_budget += hours * rate
            else:
                print(f"Warning: No rate available for role {role}")
        
        return total_budget


