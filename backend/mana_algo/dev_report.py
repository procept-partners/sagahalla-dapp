import os
import pandas as pd
import json
from collections import defaultdict

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
            
            # Create task entry
            task = {
                'task_name': task_name,
                'role': role_name,
                'budgeted_hours': budgeted_hours
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
                    task_hours = task.get('budgeted_hours', 0)
                    role = task.get('role', "Unknown")
                    
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

def process_all_dev_reports(dev_reports_folder: str, output_folder: str):
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
                dev_report = read_excel_to_dev_report(file_path, dev_name)
            except Exception as e:
                print(f"Error processing file '{file_name}': {e}")
                continue

            # Merge the developer's report into the combined report
            for dev, subprojects in dev_report.items():
                for subproject, epics in subprojects.items():
                    for epic, tasks in epics.items():
                        combined_report[dev][subproject][epic].extend(tasks)
            
            # Output the developer's individual report as a JSON file
            output_file = os.path.join(output_folder, f'{dev_name}_report.json')
            with open(output_file, 'w') as f:
                json.dump(dev_report, f, indent=4)
            print(f"Developer report for '{dev_name}' saved to {output_file}")

    return combined_report

def save_combined_report(combined_report, output_path: str):
    # Save the combined report as a JSON file
    with open(output_path, 'w') as f:
        json.dump(combined_report, f, indent=4)
    print(f"Combined report saved to {output_path}")

def main():
    dev_reports_folder = "backend/hackathon_proposals/dev_reports"  # Folder containing all the dev reports
    output_folder = "backend/hackathon_proposals/output_reports"  # Folder to save the individual and combined JSON reports
    combined_report_file = os.path.join(output_folder, "combined_report.json")  # Path to save the combined report

    combined_report = process_all_dev_reports(dev_reports_folder, output_folder)
    save_combined_report(combined_report, combined_report_file)

if __name__ == "__main__":
    main()
