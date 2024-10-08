import pandas as pd
import os
from models import Task, Epic, SubProject, Project

def clean_string(s):
    if isinstance(s, str):
        return s.lstrip('-').strip()
    return s

def read_excel_to_project(file_path: str, project_name: str) -> Project:
    # Read all sheets from the Excel file
    sheets = pd.read_excel(file_path, sheet_name=None)

    sub_projects = []

    for sheet_name, data in sheets.items():
        # Clean all string cells in the sheet
        data = data.applymap(clean_string)

        # Identify role columns (assuming any column after 'Task' is a role column)
        columns = data.columns.tolist()
        try:
            task_col_index = columns.index('Task')
        except ValueError:
            raise ValueError(f"'Task' column not found in sheet '{sheet_name}'")

        role_columns = columns[task_col_index + 1:]

        epics = []
        current_epic = None
        tasks = []

        for _, row in data.iterrows():
            epic_name = row.get('Epic')
            task_name = row.get('Task')

            # Check if the row defines a new epic
            if pd.notna(epic_name):
                # If there's an existing epic and tasks, save it
                if current_epic is not None and tasks:
                    epics.append(Epic(epic_name=current_epic, tasks=tasks))
                current_epic = epic_name
                tasks = []
                continue  # Skip to next row after setting the current epic

            # If task_name is NaN, skip the row
            if pd.isna(task_name):
                continue

            # Collect MANA hours for each role dynamically
            roles_mana_hours = {}
            for role in role_columns:
                mana_hours = row.get(role, 0)
                if pd.notna(mana_hours):
                    try:
                        mana_hours = float(mana_hours)
                        if mana_hours > 0:
                            roles_mana_hours[role] = mana_hours
                    except ValueError:
                        print(f"Invalid MANA hours '{mana_hours}' for role '{role}' in task '{task_name}'")
                        continue

            # Create Task object
            task = Task(task_name=task_name, roles_mana_hours=roles_mana_hours)
            tasks.append(task)

        # Append the last epic after finishing the sheet
        if current_epic is not None and tasks:
            epics.append(Epic(epic_name=current_epic, tasks=tasks))

        # Calculate total MANA hours for the sub-project
        sub_project = SubProject(
            sub_project_name=sheet_name,
            epics=epics,
            total_mana_hours=0  # Placeholder, will calculate next
        )
        sub_project.total_mana_hours = sub_project.calculate_total_mana_hours()
        sub_projects.append(sub_project)

    # Create the Project
    project = Project(
        project_name=project_name,
        sub_projects=sub_projects,
        total_mana_hours=0  # Placeholder, will calculate next
    )
    project.total_mana_hours = project.calculate_total_mana_hours()

    return project

def main():
    file_name = "your_spreadsheet.xlsx"  # Replace with your actual file name
    if not os.path.exists(file_name):
        print(f"Error: File '{file_name}' not found in the current directory.")
        return

    project_name = "SagaMana Development"  # Replace with your actual project name
    try:
        project = read_excel_to_project(file_name, project_name)
    except Exception as e:
        print(f"Error processing the Excel file: {e}")
        return

    # Output the project data
    print(f"Total MANA Hours for Project '{project.project_name}': {project.calculate_total_mana_hours()}")
    print("\nTotal MANA Hours per Role for Project:")
    for role, hours in project.total_mana_hours_per_role().items():
        print(f"  {role}: {hours}")

    # Optional: Print detailed breakdown
    for sub_project in project.sub_projects:
        print(f"\nSub-Project: {sub_project.sub_project_name}")
        print(f"  Total MANA Hours: {sub_project.total_mana_hours}")
        print(f"  MANA Hours per Role:")
        for role, hours in sub_project.total_mana_hours_per_role().items():
            print(f"    {role}: {hours}")
        for epic in sub_project.epics:
            print(f"    Epic: {epic.epic_name}")
            print(f"      Total MANA Hours: {epic.calculate_total_mana_hours()}")
            print(f"      MANA Hours per Role:")
            for role, hours in epic.total_mana_hours_per_role().items():
                print(f"        {role}: {hours}")

if __name__ == "__main__":
    main()
