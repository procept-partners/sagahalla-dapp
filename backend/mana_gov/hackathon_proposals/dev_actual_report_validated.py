import os
import json
import pandas as pd
from collections import defaultdict
from datetime import datetime

def load_proposal_metadata(file_path: str) -> dict:
    """ Load the proposal metadata from the JSON file. """
    try:
        with open(file_path, 'r') as f:
            proposal_data = json.load(f)
        return proposal_data
    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found.")
        return {}

def clean_string(s):
    """ Clean string values by removing leading/trailing characters. """
    if isinstance(s, str):
        return s.lstrip('-').strip()
    return s

def read_excel_to_dev_report(file_path: str, developer_name: str) -> dict:
    """ Read the Excel file and return the developer's execution report based on actual hours logged. """
    sheets = pd.read_excel(file_path, sheet_name=None)
    
    dev_report_dict = defaultdict(lambda: defaultdict(lambda: defaultdict(list)))
    
    for sheet_name, data in sheets.items():
        data = data.applymap(clean_string)
        
        for _, row in data.iterrows():
            subproject_name = row.get('Subproject')
            epic_name = row.get('Epic')
            task_name = row.get('Task')
            role_name = row.get('Role')
            actual_hours = row.get('Actual Hours', None)  # Use "Actual Hours" column
            task_id = row.get('TaskID', 0)  # Use TaskID directly from input file

            # Only include rows where 'Actual Hours' are valid (non-NaN and greater than 0)
            if pd.isna(actual_hours) or actual_hours <= 0 or pd.isna(task_name):
                continue  # Ignore tasks without valid actual values

            task = {
                'id': task_id,
                'task_name': task_name,
                'rolesManaHours': [
                    {
                        'roleName': role_name,
                        'actualManaHours': actual_hours  # Use actual hours for the logged value
                    }
                ]
            }
            
            # Only add tasks with a valid actual hours value to the report
            dev_report_dict[developer_name][subproject_name][epic_name].append(task)
    
    return dev_report_dict

def filter_subprojects_for_developer(dev_report_dict, developer_name):
    """
    Filter subprojects and epics to only include tasks with valid actual hours for the developer.
    """
    filtered_dev_report = defaultdict(lambda: defaultdict(list))

    for subproject_name, epics in dev_report_dict[developer_name].items():
        for epic_name, tasks in epics.items():
            filtered_tasks = [
                task for task in tasks if any(
                    role['actualManaHours'] > 0 for role in task['rolesManaHours']
                )
            ]
            if filtered_tasks:
                filtered_dev_report[subproject_name][epic_name] = filtered_tasks

    return filtered_dev_report

def calculate_totals_for_developer(dev_report_dict, developer_name):
    """
    Calculate the total actual MANA hours for a specific developer.
    """
    total_actual_mana_hours = 0

    for subproject_name, epics in dev_report_dict[developer_name].items():
        for epic_name, tasks in epics.items():
            for task in tasks:
                for role in task['rolesManaHours']:
                    total_actual_mana_hours += role['actualManaHours']
    
    return total_actual_mana_hours

def generate_project_execution_json(proposal_metadata, dev_report_dict, developer_name):
    """
    Combine the proposal metadata and developer-specific filtered subprojects into a final project execution plan.
    Include the actual MANA totals.
    """
    # Calculate totals for the developer
    total_actual_mana_hours = calculate_totals_for_developer(dev_report_dict, developer_name)

    # Retrieve relevant proposal metadata
    project_execution = {
        'developerName': developer_name,  # New field for the developer's name
        'totalActualManaHours': total_actual_mana_hours,  # Total actual MANA hours
        'subProjects': []  # We'll populate this next
    }

    # Filter subprojects and epics for the specific developer
    filtered_dev_report = filter_subprojects_for_developer(dev_report_dict, developer_name)

    # Populate subprojects based on filtered data for the developer
    for subproject_name, epics in filtered_dev_report.items():
        subproject = {
            'id': len(project_execution['subProjects']) + 1,  # Incremental ID for subprojects
            'subProjectName': subproject_name,
            'epics': []
        }

        for epic_name, tasks in epics.items():
            epic = {
                'id': len(subproject['epics']) + 1,  # Incremental ID for epics
                'subProjectId': subproject['id'],
                'epicName': epic_name,
                'tasks': []
            }

            # Add filtered tasks for the developer
            for task in tasks:
                task_json = {
                    'id': task['id'],  # Use task ID from the developer report
                    'epicId': epic['id'],
                    'taskName': task['task_name'],
                    'rolesManaHours': task['rolesManaHours']  # Use existing rolesManaHours structure
                }
                epic['tasks'].append(task_json)

            # Add this epic to the subproject
            subproject['epics'].append(epic)

        # Add this subproject to the project execution
        project_execution['subProjects'].append(subproject)

    return project_execution

def main():
    # File paths and developer information
    proposal_file = "mana_gov/hackathon_proposals/hackathon_proposal_validated.json"
    dev_reports_folder = "mana_gov/hackathon_proposals/project_execution/dev_reports"
    output_folder = "mana_gov/hackathon_proposals/project_execution/output_reports"
    
    # Load the proposal metadata
    proposal_metadata = load_proposal_metadata(proposal_file)

    combined_project_execution = {
        'id': proposal_metadata.get('id', 1),  # Proposal ID
        'title': proposal_metadata.get('title', "Unknown Title"),  # Use the project title from the proposal
        'description': proposal_metadata.get('description', "No description available."),
        'createdAt': proposal_metadata.get('createdAt', str(datetime.now())),  # Proposal creation date
        'updatedAt': proposal_metadata.get('updatedAt', None),  # Proposal last update date
        'developers': {},  # This will store each developer's project execution plan
        'totalActualManaHours': 0  # Placeholder for total actual MANA hours
    }

    # Initialize cumulative totals
    total_actual_mana_hours = 0

    # Iterate over all Excel files in the dev_reports_folder
    for file_name in os.listdir(dev_reports_folder):
        if file_name.endswith('.xlsx'):
            # Extract developer name from the base of the file name (without .xlsx extension)
            developer_name = os.path.splitext(file_name)[0]
            file_path = os.path.join(dev_reports_folder, file_name)

            # Process developer report for the specific developer
            dev_report = read_excel_to_dev_report(file_path, developer_name)

            # Generate the project execution JSON for the developer
            developer_project_execution = generate_project_execution_json(proposal_metadata, dev_report, developer_name)

            # Add developer project execution to the combined project execution
            combined_project_execution['developers'][developer_name] = developer_project_execution

            # Accumulate total actual mana hours
            total_actual_mana_hours += developer_project_execution['totalActualManaHours']

    # Update the cumulative totals in the project metadata
    combined_project_execution['totalActualManaHours'] = total_actual_mana_hours

    # Save the combined project execution to a file
    output_file = os.path.join(output_folder, "combined_project_execution.json")
    with open(output_file, 'w') as f:
        json.dump(combined_project_execution, f, indent=4)

    print(f"Combined project execution saved to {output_file}")

if __name__ == "__main__":
    main()
