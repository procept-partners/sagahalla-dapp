import json
import os

def load_json(file_path):
    """Load a JSON file from the given file path."""
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found.")
        return {}

def compare_developer_hours(budgeted_data, actual_data):
    """Compare budgeted and actual hours for each developer and output them."""
    output_data = {}

    # Iterate through all developers in the budgeted data
    for developer_name, budgeted_report in budgeted_data.get('developers', {}).items():
        actual_report = actual_data['developers'].get(developer_name, {})

        if not actual_report:
            continue

        developer_output = []

        # Compare each subproject
        for budgeted_subproject in budgeted_report['subProjects']:
            subproject_name = budgeted_subproject['subProjectName']
            actual_subproject = next((sp for sp in actual_report['subProjects'] if sp['subProjectName'] == subproject_name), None)

            if not actual_subproject:
                continue

            # Compare each epic within the subproject
            for budgeted_epic in budgeted_subproject['epics']:
                epic_name = budgeted_epic['epicName']
                actual_epic = next((ep for ep in actual_subproject['epics'] if ep['epicName'] == epic_name), None)

                if not actual_epic:
                    continue

                # Compare tasks within each epic
                for budgeted_task in budgeted_epic['tasks']:
                    task_name = budgeted_task['taskName']
                    actual_task = next((task for task in actual_epic['tasks'] if task['taskName'] == task_name), None)

                    if not actual_task:
                        continue

                    # Compare roles and mana hours
                    for budgeted_role in budgeted_task['rolesManaHours']:
                        role_name = budgeted_role['roleName']
                        actual_role = next((role for role in actual_task['rolesManaHours'] if role['roleName'] == role_name), None)

                        if not actual_role:
                            continue

                        # Get budgeted and actual hours
                        budgeted_hours = budgeted_role.get('manaHours', 0)
                        actual_hours = actual_role.get('actualManaHours', 0)

                        # Append the data for output
                        developer_output.append({
                            'subProjectName': subproject_name,
                            'epicName': epic_name,
                            'taskName': task_name,
                            'roleName': role_name,
                            'budgetedHours': budgeted_hours,
                            'actualHours': actual_hours
                        })

        if developer_output:
            output_data[developer_name] = developer_output

    return output_data

def save_differences(output_data, output_file):
    """Save the actual and budgeted hours to a JSON file."""
    with open(output_file, 'w') as f:
        json.dump(output_data, f, indent=4)
    print(f"Output saved to {output_file}")

def main():
    # File paths for the budgeted and actual JSON files
    budgeted_file = "mana_gov/hackathon_proposals/project_plan/output_reports/combined_project_plan.json"
    actual_file = "mana_gov/hackathon_proposals/project_execution/output_reports/combined_project_execution.json"
    output_file = "mana_gov/hackathon_proposals/output_budgeted_actual_hours.json"

    # Load the budgeted and actual data
    budgeted_data = load_json(budgeted_file)
    actual_data = load_json(actual_file)

    # Compare budgeted and actual hours
    output_data = compare_developer_hours(budgeted_data, actual_data)

    # Save the output data to a file
    save_differences(output_data, output_file)

if __name__ == "__main__":
    main()
