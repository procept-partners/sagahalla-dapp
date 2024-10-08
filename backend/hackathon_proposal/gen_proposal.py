import os
import pandas as pd
import json
from collections import defaultdict

def clean_string(s):
    if isinstance(s, str):
        return s.lstrip('-').strip()
    return s

def read_excel_to_project(file_path: str) -> dict:
    sheets = pd.read_excel(file_path, sheet_name=None)
    
    # Dictionary to store the structure with Subproject as key
    project_dict = defaultdict(lambda: defaultdict(list))
    
    for sheet_name, data in sheets.items():
        data = data.applymap(clean_string)
        
        # Iterate over the rows to collect tasks
        for _, row in data.iterrows():
            subproject_name = sheet_name
            epic_name = row.get('Epic')
            task_name = row.get('Task')
            role_name = row.get('Role')
            mana_hours = row.get('Estimated Hours', 0)
            
            # Skip rows without task names
            if pd.isna(task_name):
                continue
            
            # Create task entry
            task = {
                'task_name': task_name,
                'role': role_name,
                'mana_hours': mana_hours
            }
            
            # Add the task to the appropriate epic in the subproject
            project_dict[subproject_name][epic_name].append(task)
    
    # Return the structured project dictionary
    return project_dict

def calculate_totals(project_dict):
    total_mana_hours = 0
    role_mana_hours = defaultdict(float)
    subproject_totals = defaultdict(lambda: defaultdict(float))

    # Iterate over the sub-projects and epics to sum the MANA hours
    for sub_project, epics in project_dict.items():
        subproject_mana_hours = 0
        subproject_role_mana_hours = defaultdict(float)
        
        for epic, tasks in epics.items():
            for task in tasks:
                task_hours = task.get('mana_hours', 0)
                role = task.get('role', "Unknown")
                
                # Accumulate total MANA hours and hours by role
                total_mana_hours += task_hours
                role_mana_hours[role] += task_hours
                
                # Accumulate subproject-level totals
                subproject_mana_hours += task_hours
                subproject_role_mana_hours[role] += task_hours

        # Store totals for each subproject
        subproject_totals[sub_project]['total_mana_hours'] = subproject_mana_hours
        subproject_totals[sub_project]['role_mana_hours'] = subproject_role_mana_hours

    return total_mana_hours, role_mana_hours, subproject_totals

def save_project_to_json(project_dict, file_name='hackathon_proposal.json'):
    try:
        with open(file_name, 'w') as json_file:
            json.dump(project_dict, json_file, indent=4)
        print(f"Project data has been saved to {file_name}")
    except Exception as e:
        print(f"Error saving project data to JSON: {e}")

def main():
    file_name = "HACKATHON_PROPOSAL.xlsx"  # Replace with your actual file name
    json_file_name = "hackathon_proposal.json"  # JSON output file
    if not os.path.exists(file_name):
        print(f"Error: File '{file_name}' not found in the current directory.")
        return

    try:
        project_dict = read_excel_to_project(file_name)
    except Exception as e:
        print(f"Error processing the Excel file: {e}")
        return

    # Output the structured project dictionary for inspection
    for sub_project, epics in project_dict.items():
        print(f"Sub-Project: {sub_project}")
        for epic, tasks in epics.items():
            print(f"  Epic: {epic}")
            for task in tasks:
                print(f"    Task: {task['task_name']}, Role: {task['role']}, MANA Hours: {task['mana_hours']}")

    # Calculate and display total MANA hours and MANA hours per role
    total_mana_hours, role_mana_hours, subproject_totals = calculate_totals(project_dict)

    print(f"\nTotal MANA Hours for the Project: {total_mana_hours}")
    print("\nTotal MANA Hours per Role:")
    for role, hours in role_mana_hours.items():
        print(f"  {role}: {hours}")

    # Output the totals by subproject
    print("\nTotal MANA Hours per Subproject:")
    for sub_project, totals in subproject_totals.items():
        print(f"\nSub-Project: {sub_project}")
        print(f"  Total MANA Hours: {totals['total_mana_hours']}")
        print(f"  MANA Hours per Role:")
        for role, hours in totals['role_mana_hours'].items():
            print(f"    {role}: {hours}")

    # Save the project to a JSON file
    save_project_to_json(project_dict, json_file_name)



if __name__ == "__main__":
    main()
