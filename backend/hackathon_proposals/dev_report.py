import os
import pandas as pd
import json
from mana_algo.models import Task, Epic, SubProject

def clean_string(s):
    if isinstance(s, str):
        return s.lstrip('-').strip()
    return s

def read_excel_to_dev_report(file_path: str, dev_name: str) -> dict:
    sheets = pd.read_excel(file_path, sheet_name=None)
    dev_report_dict = {}

    for sheet_name, data in sheets.items():
        data = data.applymap(clean_string)

        current_sub_project = None
        current_epic = None
        tasks = []

        for _, row in data.iterrows():
            sub_project_name = row.get('Subproject')  # Subproject comes from the 2nd column
            epic_name = row.get('Epic')  # Epic comes from the Epic column
            task_name = row.get('Task')
            role_name = row.get('Role')
            actual_hours = row.get('Actual Hours', None)  # New field for Actual Hours

            if pd.isna(actual_hours) or actual_hours == 0:
                # Skip tasks where Actual Hours is blank or zero
                continue

            if pd.notna(sub_project_name):  # If there is a new subproject
                if current_epic is not None and tasks:
                    if current_sub_project not in dev_report_dict:
                        dev_report_dict[current_sub_project] = []
                    dev_report_dict[current_sub_project].append(Epic(epic_name=current_epic, tasks=tasks))
                current_sub_project = sub_project_name  # Set new subproject
                current_epic = None
                tasks = []

            if pd.notna(epic_name):  # If there is a new epic
                if current_epic is not None and tasks:
                    if current_sub_project not in dev_report_dict:
                        dev_report_dict[current_sub_project] = []
                    dev_report_dict[current_sub_project].append(Epic(epic_name=current_epic, tasks=tasks))
                current_epic = epic_name  # Set new epic
                tasks = []
                continue

            if pd.isna(task_name):
                continue

            # Collect Actual Hours for the task
            roles_actual_hours = {}
            try:
                actual_hours = float(actual_hours)
                if actual_hours > 0:
                    roles_actual_hours[role_name] = actual_hours
            except ValueError:
                continue

            # Create Task object with Actual Hours
            task = Task(task_name=task_name, roles_mana_hours=roles_actual_hours)
            tasks.append(task)

        # Append the last epic after finishing the sheet
        if current_epic is not None and tasks:
            if current_sub_project not in dev_report_dict:
                dev_report_dict[current_sub_project] = []
            dev_report_dict[current_sub_project].append(Epic(epic_name=current_epic, tasks=tasks))

    # Structure to return: top-level dev name, subprojects, epics, and tasks
    dev_report = {
        "developer_name": dev_name,
        "sub_projects": [
            {
                "sub_project_name": sub_project_name,
                "epics": [
                    {
                        "epic_name": epic.epic_name,
                        "tasks": [
                            {
                                "task_name": task.task_name,
                                "roles_mana_hours": task.roles_mana_hours
                            }
                            for task in epic.tasks
                        ]
                    }
                    for epic in sub_projects
                ]
            }
            for sub_project_name, sub_projects in dev_report_dict.items()
        ]
    }

    return dev_report

def process_all_dev_reports(dev_reports_folder: str, output_folder: str):
    if not os.path.exists(dev_reports_folder):
        print(f"Error: Folder '{dev_reports_folder}' not found.")
        return

    # Create the output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Iterate over all Excel files in the dev_reports folder
    for file_name in os.listdir(dev_reports_folder):
        if file_name.endswith('.xlsx'):
            # Get the developer's name from the file name (without extension)
            dev_name = os.path.splitext(file_name)[0]
            file_path = os.path.join(dev_reports_folder, file_name)

            try:
                dev_report = read_excel_to_dev_report(file_path, dev_name)
            except Exception as e:
                print(f"Error processing file '{file_name}': {e}")
                continue

            # Output the developer's report as a JSON file
            output_file = os.path.join(output_folder, f'{dev_name}_report.json')
            with open(output_file, 'w') as f:
                json.dump(dev_report, f, indent=4)

            print(f"Developer report for '{dev_name}' saved to {output_file}")

def main():
    dev_reports_folder = "dev_reports"  # Folder containing all the dev reports
    output_folder = "output_reports"  # Folder to save the JSON reports

    process_all_dev_reports(dev_reports_folder, output_folder)

if __name__ == "__main__":
    main()
