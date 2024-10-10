import os
import pandas as pd
import json
from collections import defaultdict
from models import Task, Epic, SubProject, Project  # Assuming these are defined in models.py

# Define the base directory relative to the app
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROPOSALS_DIR = os.path.join(BASE_DIR, "mana_algo", "proposals")

def clean_string(s):
    if isinstance(s, str):
        return s.lstrip('-').strip()
    return s

def read_excel_to_project(file_path: str) -> Project:
    sheets = pd.read_excel(file_path, sheet_name=None)
    
    sub_projects = []
    
    for sheet_name, data in sheets.items():
        data = data.applymap(clean_string)
        epics_dict = defaultdict(list)  # This will collect tasks under each epic
        
        # Iterate over the rows to collect tasks
        for _, row in data.iterrows():
            subproject_name = row.get('Subproject')
            epic_name = row.get('Epic')
            task_name = row.get('Task')
            role_name = row.get('Role')
            mana_hours = row.get('Estimated Hours', 0)
            
            # Skip rows without task names
            if pd.isna(task_name):
                continue
            
            # Create a task (convert task format to match the Task model)
            task = Task(
                task_name=task_name,
                roles_mana_hours={role_name: mana_hours}
            )
            
            # Append the task to the corresponding epic
            epics_dict[epic_name].append(task)
        
        # After collecting all tasks for the current sub-project, convert them into Epics
        epics = [Epic(epic_name=epic_name, tasks=tasks) for epic_name, tasks in epics_dict.items()]
        
        # Create a sub-project
        sub_project = SubProject(sub_project_name=subproject_name, epics=epics)
        sub_projects.append(sub_project)
    
    # Return the Project instance
    return Project(project_name="Saga Mana Project", sub_projects=sub_projects)

def calculate_totals(project: Project):
    total_mana_hours = project.calculate_total_mana_hours()
    role_mana_hours = project.total_mana_hours_per_role()

    return total_mana_hours, role_mana_hours

def save_project_to_json(project: Project, file_name='hackathon_mana_hours.json'):
    file_path = os.path.join(PROPOSALS_DIR, file_name)
    try:
        with open(file_path, 'w') as json_file:
            json.dump(project.dict(), json_file, indent=4)
        print(f"Project data has been saved to {file_path}")
    except Exception as e:
        print(f"Error saving project data to JSON: {e}")

def main():
    file_name = "HACKATHON_PROPOSAL.xlsx"  # Replace with your actual file name
    json_file_name = "hackathon_proposal.json"  # JSON output file
    
    excel_file_path = os.path.join(PROPOSALS_DIR, file_name)
    
    if not os.path.exists(excel_file_path):
        print(f"Error: File '{file_name}' not found in the '{PROPOSALS_DIR}' directory.")
        return

    try:
        project = read_excel_to_project(excel_file_path)
    except Exception as e:
        print(f"Error processing the Excel file: {e}")
        return

    # Calculate and display total MANA hours and MANA hours per role
    total_mana_hours, role_mana_hours = calculate_totals(project)

    print(f"\nTotal MANA Hours for the Project: {total_mana_hours}")
    print("\nTotal MANA Hours per Role:")
    for role, hours in role_mana_hours.items():
        print(f"  {role}: {hours}")

    # Save the project to a JSON file
    save_project_to_json(project, json_file_name)


if __name__ == "__main__":
    main()
