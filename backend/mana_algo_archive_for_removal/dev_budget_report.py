import json
from typing import List, Dict
import os
import pandas as pd
from collections import defaultdict
from models import Project

# Get the root directory of the mana-algo app (assuming this file is inside the mana-algo directory)
app_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

# Construct paths relative to the app root
role_multipliers_path = os.path.join(app_root, "backend", "mana_algo", "proposals", "role_multipliers.json")
project_data_path = os.path.join(app_root, "backend", "mana_algo", "proposals", "hackathon_mana_hours.json")
output_file_path = os.path.join(app_root, "backend", "mana_algo", "proposals", "hackathon_proposal.json")
combined_output_file_path = os.path.join(app_root, "backend", "mana_algo", "proposals", "hackathon_dev_project_budget.json")

# Ensure the directory exists for the output path
os.makedirs(os.path.dirname(output_file_path), exist_ok=True)

# Load the role multipliers from the JSON file
def load_role_multipliers(file_path: str) -> Dict:
    if not os.path.exists(file_path):
        print(f"Error: Role multipliers file '{file_path}' not found.")
        return {}
    
    with open(file_path, "r") as f:
        return json.load(f)

# Load the role multipliers using the constructed paths
role_multiplier_data = load_role_multipliers(role_multipliers_path)

if not role_multiplier_data:
    raise FileNotFoundError(f"Role multipliers file not found or empty at {role_multipliers_path}")

global_avg_rates = role_multiplier_data["weighted_global_average_rates"]

# Load mana_founder_conversion from the JSON file
mana_founder_conversion = role_multiplier_data.get("mana_founder_conversion", 1)

# Load the project from the JSON file
if not os.path.exists(project_data_path):
    raise FileNotFoundError(f"Project data file '{project_data_path}' not found.")

with open(project_data_path, "r") as f:
    project_data = json.load(f)

# Create the Project instance from the JSON data
project = Project(**project_data)

# Function to read Excel data and return a structured report for each developer
def read_excel_to_dev_report(file_path: str, developer_name: str, project_name: str) -> dict:
    sheets = pd.read_excel(file_path, sheet_name=None)
    
    # Start with the project structure
    dev_report_dict = {
        "developer_name": developer_name,
        "project_name": project_name,
        "sub_projects": []
    }
    
    # Temporary storage for subprojects, epics, and tasks
    subproject_epic_map = defaultdict(lambda: defaultdict(list))
    
    for sheet_name, data in sheets.items():
        data = data.applymap(lambda s: s.strip() if isinstance(s, str) else s)  # Clean up strings
        
        # Iterate over the rows to collect tasks
        for _, row in data.iterrows():
            subproject_name = row.get('Subproject')
            epic_name = row.get('Epic')
            task_name = row.get('Task')
            role_name = row.get('Role')
            budgeted_hours = row.get('Budgeted', None)
            
            # Skip rows where budgeted hours or task name are missing
            if pd.isna(budgeted_hours) or pd.isna(task_name):
                continue
            
            # Create task entry consistent with your structure
            task = {
                'task_name': task_name,
                'roles_mana_hours': {
                    role_name: budgeted_hours
                }
            }
            
            # Group tasks by subproject and epic
            subproject_epic_map[subproject_name][epic_name].append(task)
    
    # Build the hierarchical structure
    for subproject_name, epics in subproject_epic_map.items():
        subproject_entry = {
            'sub_project_name': subproject_name,
            'epics': []
        }
        for epic_name, tasks in epics.items():
            epic_entry = {
                'epic_name': epic_name,
                'tasks': tasks
            }
            subproject_entry['epics'].append(epic_entry)
        
        # Add each subproject to the project structure
        dev_report_dict['sub_projects'].append(subproject_entry)
    
    return dev_report_dict

# Function to calculate totals for each developer's report
def calculate_dev_report_totals(dev_report: dict, global_avg_rates: Dict[str, float], mana_founder_conversion: float) -> dict:
    total_budgeted_hours = 0
    total_budget_usd = 0
    
    # Calculate total hours and USD budget based on role multipliers and rates
    for sub_project in dev_report["sub_projects"]:
        for epic in sub_project["epics"]:
            for task in epic["tasks"]:
                roles_mana_hours = task.get("roles_mana_hours", {})
                for role, hours in roles_mana_hours.items():
                    total_budgeted_hours += hours
                    rate = global_avg_rates.get(role, 0)
                    total_budget_usd += hours * rate

    # Calculate total budget in MANA
    total_budget_mana = total_budget_usd / mana_founder_conversion
    
    # Add totals to the developer's report
    dev_report["totals"] = {
        "total_budgeted_hours": total_budgeted_hours,
        "total_budget_usd": total_budget_usd,
        "total_budget_mana": total_budget_mana
    }

    return dev_report

# Save the updated project data to a new JSON file
def save_project_to_json(project_dict, file_name: str):
    try:
        with open(file_name, 'w') as json_file:
            json.dump(project_dict, json_file, indent=4)
        print(f"Updated project data has been saved to {file_name}")
    except Exception as e:
        print(f"Error saving project data to JSON: {e}")

# Process all developer reports and calculate totals
def process_all_dev_reports(dev_reports_folder: str, output_folder: str, project_name: str):
    if not os.path.exists(dev_reports_folder):
        print(f"Error: Folder '{dev_reports_folder}' not found.")
        return

    # Create the output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder, exist_ok=True)

    combined_report = defaultdict(lambda: defaultdict(lambda: defaultdict(list)))
    
    # Iterate over all Excel files in the dev_reports folder
    for file_name in os.listdir(dev_reports_folder):
        if file_name.endswith('.xlsx'):
            # Get the developer's name from the file name (without extension)
            dev_name = os.path.splitext(file_name)[0]
            file_path = os.path.join(dev_reports_folder, file_name)

            try:
                dev_report = read_excel_to_dev_report(file_path, dev_name, project_name)
                # Calculate totals and append to the report
                dev_report_with_totals = calculate_dev_report_totals(dev_report, global_avg_rates, mana_founder_conversion)
            except Exception as e:
                print(f"Error processing file '{file_name}': {e}")
                continue

            # Add to the combined report
            combined_report[dev_name] = dev_report_with_totals

            # Save the developer's individual report as a JSON file
            output_file = os.path.join(output_folder, f'{dev_name}_report.json')
            save_project_to_json(dev_report_with_totals, output_file)

    # Save the combined report
    save_project_to_json(combined_report, combined_output_file_path)

# Main function
def main():
    dev_reports_folder = "backend/mana_algo/proposals/dev_reports"  # Folder containing all the dev reports
    output_folder = "backend/mana_algo/proposals/output_reports"  # Folder to save the individual and combined JSON reports
    project_name = "Saga Mana Project"  # The name of the project

    process_all_dev_reports(dev_reports_folder, output_folder, project_name)

if __name__ == "__main__":
    main()
