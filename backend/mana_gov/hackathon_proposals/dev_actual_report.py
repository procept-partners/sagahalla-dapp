import json
from typing import List, Dict
import os
import pandas as pd
from collections import defaultdict

def clean_string(s):
    if isinstance(s, str):
        return s.lstrip('-').strip()
    return s

# Helper function to load JSON file
def load_json(file_path: str) -> dict:
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File '{file_path}' not found.")
    
    with open(file_path, "r") as f:
        return json.load(f)

# Save the updated project data to a new JSON file
def save_project_to_json(project_dict, file_name: str):
    try:
        with open(file_name, 'w') as json_file:
            json.dump(project_dict, json_file, indent=4)
        print(f"Updated project data has been saved to {file_name}")
    except Exception as e:
        print(f"Error saving project data to JSON: {e}")

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
    
    # Clean each sheet by applying the clean_string function to all string fields
    for sheet_name, data in sheets.items():
        # Apply clean_string to all string columns
        data = data.applymap(clean_string)
        
        # Iterate over the rows to collect tasks
        for _, row in data.iterrows():
            subproject_name = clean_string(row.get('Subproject'))
            epic_name = clean_string(row.get('Epic'))
            task_name = clean_string(row.get('Task'))
            role_name = clean_string(row.get('Role'))
            budgeted_hours = row.get('Budgeted', None)
            actual_hours = row.get('Actual Hours', None)
            
            # Only skip rows where both budgeted and actual hours are NaN
            if pd.isna(budgeted_hours) and pd.isna(actual_hours):
                continue
            
            # Create task entry consistent with your structure
            task = {
                'task_name': task_name,
                'role': role_name if role_name else "Unknown",  # Handle missing role
                'roles_mana_hours': {
                    'budgeted': budgeted_hours,
                    'actual': actual_hours
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
            # Only add epics that have tasks
            if tasks:
                epic_entry = {
                    'epic_name': epic_name,
                    'tasks': tasks
                }
                subproject_entry['epics'].append(epic_entry)
        
        # Only add subprojects that have epics with tasks
        if subproject_entry['epics']:
            dev_report_dict['sub_projects'].append(subproject_entry)
    
    return dev_report_dict

# Function to calculate totals for each developer's report (Budgeted and Actual)
def calculate_dev_report_totals(dev_report: dict, global_avg_rates: Dict[str, float], mana_founder_conversion: float) -> dict:
    total_budgeted_hours = 0
    total_actual_hours = 0
    total_budget_usd = 0
    total_actual_usd = 0
    
    # Calculate total hours and USD budget based on role multipliers and rates
    for sub_project in dev_report["sub_projects"]:
        for epic in sub_project["epics"]:
            for task in epic["tasks"]:
                roles_mana_hours = task.get("roles_mana_hours", {})
                
                # Add budgeted and actual hours separately
                budgeted_hours = roles_mana_hours.get('budgeted', 0) or 0
                actual_hours = roles_mana_hours.get('actual', 0) or 0
                
                total_budgeted_hours += budgeted_hours
                total_actual_hours += actual_hours
                
                role = task.get('role', 'Unknown')  # Ensure there's a fallback if role is missing
                rate = global_avg_rates.get(role, 0)

                # Calculate the budget in USD based on budgeted hours
                total_budget_usd += budgeted_hours * rate
                total_actual_usd += actual_hours * rate

    # Calculate total budget and actual in MANA
    total_budget_mana = total_budget_usd / mana_founder_conversion
    total_actual_mana = total_actual_usd / mana_founder_conversion
    
    # Add totals to the developer's report
    dev_report["totals"] = {
        "total_budgeted_hours": total_budgeted_hours,
        "total_actual_hours": total_actual_hours,
        "total_budget_usd": total_budget_usd,
        "total_actual_usd": total_actual_usd,
        "total_budget_mana": total_budget_mana,
        "total_actual_mana": total_actual_mana
    }

    return dev_report

def find_missing_rows(budget_data, actual_data):
    # Create a set to hold the task names and roles that are in the actual report
    actual_tasks_set = set()

    # Loop through actual data and collect task names and roles into the set
    for developer_name, dev_report in actual_data.items():
        if developer_name == 'totals':  # Skip the totals section
            continue
        for sub_project in dev_report['sub_projects']:
            for epic in sub_project['epics']:
                for task in epic['tasks']:
                    task_name = clean_string(task.get('task_name'))
                    role = clean_string(task.get('role'))  # Load the role directly
                    roles_mana_hours = task.get('roles_mana_hours', {})
                    
                    # Add to actual set only if actual hours are logged
                    if 'actual' in roles_mana_hours and roles_mana_hours['actual'] > 0:
                        actual_tasks_set.add((task_name, role))

    # Now check the budget data and compare with the actual set
    missing_rows = []

    for sub_project in budget_data['sub_projects']:
        for epic in sub_project['epics']:
            for task in epic['tasks']:
                task_name = clean_string(task.get('task_name'))
                role = clean_string(task.get('role'))  # Load the role directly
                roles_mana_hours = task.get('roles_mana_hours', {})
                
                # If the task has budgeted hours but is missing in the actual set, mark it as missing
                if 'budgeted' in roles_mana_hours and roles_mana_hours['budgeted'] > 0:
                    if (task_name, role) not in actual_tasks_set:
                        missing_rows.append({
                            'task_name': task_name,
                            'role': role,
                            'budgeted_hours': roles_mana_hours['budgeted']
                        })

    return missing_rows



# Process all developer reports and calculate totals
def process_all_dev_reports(dev_reports_folder: str, output_folder: str, project_name: str, budget_data, mana_founder_conversion: float, global_avg_rates: dict):
    if not os.path.exists(dev_reports_folder):
        print(f"Error: Folder '{dev_reports_folder}' not found.")
        return

    # Create the output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder, exist_ok=True)

    combined_report = defaultdict(lambda: defaultdict(lambda: defaultdict(list)))
    
    # Initialize totals for combined budget and actual values
    total_combined_budgeted_hours = 0
    total_combined_actual_hours = 0
    total_combined_budget_usd = 0
    total_combined_actual_usd = 0

    # Iterate over all Excel files in the dev_reports folder
    for file_name in os.listdir(dev_reports_folder):
        if file_name.endswith('.xlsx'):
            # Get the developer's name from the file name (without extension)
            dev_name = os.path.splitext(file_name)[0]
            file_path = os.path.join(dev_reports_folder, file_name)

            try:
                # Read the individual developer's report
                dev_report = read_excel_to_dev_report(file_path, dev_name, project_name)
                
                # Calculate totals (both budgeted and actual) for the developer
                dev_report_with_totals = calculate_dev_report_totals(dev_report, global_avg_rates, mana_founder_conversion)

                # Accumulate combined totals for budgeted and actual hours and USD values
                total_combined_budgeted_hours += dev_report_with_totals["totals"]["total_budgeted_hours"]
                total_combined_actual_hours += dev_report_with_totals["totals"]["total_actual_hours"]
                total_combined_budget_usd += dev_report_with_totals["totals"]["total_budget_usd"]
                total_combined_actual_usd += dev_report_with_totals["totals"]["total_actual_usd"]

            except Exception as e:
                print(f"Error processing file '{file_name}': {e}")
                continue

            # Add the developer's report to the combined report
            combined_report[dev_name] = dev_report_with_totals

            # Save the developer's individual report as a JSON file
            output_file = os.path.join(output_folder, f'{dev_name}_report.json')
            save_project_to_json(dev_report_with_totals, output_file)

    # Add the combined totals to the final report
    combined_report["totals"] = {
        "total_combined_budgeted_hours": total_combined_budgeted_hours,
        "total_combined_actual_hours": total_combined_actual_hours,
        "total_combined_budget_usd": total_combined_budget_usd,
        "total_combined_actual_usd": total_combined_actual_usd,
        "total_combined_budget_mana": total_combined_budget_usd / mana_founder_conversion,
        "total_combined_actual_mana": total_combined_actual_usd / mana_founder_conversion
    }

    # Find missing rows by comparing budgeted and actual data
    missing_rows = find_missing_rows(budget_data, combined_report)
    print(f"Missing rows from actual report: {missing_rows}")

    # Save the combined report to a JSON file
    combined_output_file_path = os.path.join(output_folder, 'combined_report.json')
    save_project_to_json(combined_report, combined_output_file_path)

# Main function
def main():
    dev_reports_folder = "backend/mana_algo/mana_algo_inputs/dev_reports"  # Folder containing all the dev reports
    output_folder = "backend/mana_algo/mana_algo_inputs/output_reports"  # Folder to save the individual and combined JSON reports
    project_name = "Saga Mana Project"  # The name of the project

    # Load budget data
    budget_data = load_json("backend/mana_algo/mana_algo_inputs/hackathon_proposal.json")

    # Load role multipliers and global average rates
    role_multiplier_data = load_json("backend/mana_algo/proposals/role_multipliers.json")
    global_avg_rates = role_multiplier_data["weighted_global_average_rates"]
    mana_founder_conversion = role_multiplier_data.get("mana_founder_conversion", 1)

    # Process all developer reports
    process_all_dev_reports(dev_reports_folder, output_folder, project_name, budget_data, mana_founder_conversion, global_avg_rates)

if __name__ == "__main__":
    main()
