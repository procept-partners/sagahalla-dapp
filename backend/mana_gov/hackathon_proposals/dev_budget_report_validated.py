import os
import pandas as pd
import json
from collections import defaultdict
from datetime import datetime

def clean_string(s):
    if isinstance(s, str):
        return s.lstrip('-').strip()
    return s

def read_excel_to_dev_report(file_path: str, developer_name: str) -> dict:
    sheets = pd.read_excel(file_path, sheet_name=None)
    
    # Dictionary to store the structure with Developer name as key
    dev_report_dict = defaultdict(lambda: defaultdict(lambda: defaultdict(list)))
    
    for sheet_name, data in sheets.items():
        data = data.applymap(clean_string)
        
        # Iterate over the rows to collect tasks
        for _, row in data.iterrows():
            subproject_name = row.get('Subproject')
            epic_name = row.get('Epic')
            task_name = row.get('Task')
            role_name = row.get('Role')
            budgeted_hours = row.get('Budgeted', None)  # Using 'Budgeted' column
            
            # Skip rows where budgeted hours are NaN or not available
            if pd.isna(budgeted_hours) or pd.isna(task_name):
                continue
            
            # Create task entry with necessary fields for `Task`
            task = {
                'id': row.get('TaskID', 0),  # Assuming TaskID is available
                'task_name': task_name,
                'roles_mana_hours': [
                    {
                        'role_name': role_name,
                        'mana_hours': budgeted_hours
                    }
                ]
            }
            
            # Add the task to the appropriate epic in the subproject
            dev_report_dict[developer_name][subproject_name][epic_name].append(task)
    
    # Remove empty subprojects and epics (those without budgeted tasks)
    dev_report_dict = {
        dev_name: {
            subproject: {
                epic: tasks for epic, tasks in epics.items() if tasks
            } for subproject, epics in subprojects.items() if any(epics.values())
        } for dev_name, subprojects in dev_report_dict.items()
    }
    
    return dev_report_dict

def calculate_totals(dev_report_dict):
    total_budgeted_hours = 0
    role_budgeted_hours = defaultdict(float)
    dev_totals = defaultdict(lambda: defaultdict(float))

    # Iterate over the developers, sub-projects, and epics to sum the budgeted hours
    for developer, subprojects in dev_report_dict.items():
        dev_budgeted_hours = 0
        dev_role_budgeted_hours = defaultdict(float)
        
        for sub_project, epics in subprojects.items():
            subproject_budgeted_hours = 0
            subproject_role_budgeted_hours = defaultdict(float)
            
            for epic, tasks in epics.items():
                for task in tasks:
                    task_hours = sum([role['mana_hours'] for role in task['roles_mana_hours']])
                    role = task['roles_mana_hours'][0]['role_name']  # Assuming only one role per task
                    
                    # Aggregate totals
                    subproject_budgeted_hours += task_hours
                    dev_budgeted_hours += task_hours
                    subproject_role_budgeted_hours[role] += task_hours
                    dev_role_budgeted_hours[role] += task_hours
            
            dev_totals[developer][sub_project] = {
                'total_budgeted_hours': subproject_budgeted_hours,
                'role_budgeted_hours': dict(subproject_role_budgeted_hours)
            }
        
        total_budgeted_hours += dev_budgeted_hours

    return total_budgeted_hours, dict(dev_totals)

def generate_proposal_json(dev_report_dict, developer_name):
    """
    Generate the JSON file in the required format for proposals, including the additional fields.
    """
    proposal = {
        'id': 1,  # Placeholder value, would need to dynamically generate
        'title': f"Proposal for {developer_name}",
        'description': f"Development tasks for {developer_name}",
        'yes_votes': 0,
        'no_votes': 0,
        'mana_tokens_allocated': 1000,  # Placeholder for mana allocation
        'is_ended': False,
        'submitted_by': developer_name,
        'mana_hours_budgeted': calculate_total_mana_hours(dev_report_dict[developer_name]),
        'target_date': None,
        'created_at': str(datetime.now()),
        'updated_at': None,
        'sub_projects': []
    }

    # Iterate over the subprojects and epics
    for subproject_name, epics in dev_report_dict[developer_name].items():
        subproject = {
            'id': 1,  # Placeholder value, would need to dynamically generate
            'sub_project_name': subproject_name,
            'epics': []
        }

        for epic_name, tasks in epics.items():
            epic = {
                'id': 1,  # Placeholder value, would need to dynamically generate
                'epic_name': epic_name,
                'tasks': tasks
            }
            subproject['epics'].append(epic)

        proposal['sub_projects'].append(subproject)
    
    return proposal

def calculate_total_mana_hours(developer_tasks):
    total_mana_hours = 0
    for subproject, epics in developer_tasks.items():
        for epic, tasks in epics.items():
            for task in tasks:
                total_mana_hours += sum(role['mana_hours'] for role in task['roles_mana_hours'])
    return total_mana_hours

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

            # Generate proposal JSON file for this developer
            proposal_json = generate_proposal_json(dev_report, dev_name)

            # Output the developer's report as a JSON file
            output_file = os.path.join(output_folder, f'{dev_name}_proposal_validated.json')
            with open(output_file, 'w') as f:
                json.dump(proposal_json, f, indent=4)

            print(f"Developer proposal for '{dev_name}' saved to {output_file}")

def main():
    dev_reports_folder = "mana_gov/hackathon_proposals/dev_reports"  # Folder containing all the dev reports
    output_folder = "mana_gov/hackathon_proposals/output_reports"  # Folder to save the JSON reports

    process_all_dev_reports(dev_reports_folder, output_folder)

if __name__ == "__main__":
    main()
