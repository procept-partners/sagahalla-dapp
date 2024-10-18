import os
import pandas as pd
import json
from collections import defaultdict
from datetime import datetime

def cleanString(s):
    if isinstance(s, str):
        return s.lstrip('-').strip()
    return s

def readExcelToProject(filePath: str, ids: dict) -> dict:
    sheets = pd.read_excel(filePath, sheet_name=None)
    
    # Dictionary to store the structure with subProject as key
    projectDict = defaultdict(lambda: defaultdict(list))
    
    for sheetName, data in sheets.items():
        data = data.applymap(cleanString)
        
        # Iterate over the rows to collect tasks
        for _, row in data.iterrows():
            subProjectName = row.get('Subproject')
            epicName = row.get('Epic')
            taskName = row.get('Task')
            roleName = row.get('Role')
            manaHours = row.get('Estimated Hours', 0)
            
            # Skip rows without task names
            if pd.isna(taskName):
                continue
            
            # Create task entry with necessary fields
            task = {
                'id': ids['task'],
                'epicId': ids['epic'],  # Add epicId to link with Epic
                'taskName': taskName,
                'rolesManaHours': [  # Updated to match frontend expectation
                    {
                        'id': ids['roleManaHours'],  # RoleManaHours ID
                        'taskId': ids['task'],  # Link RoleManaHours to Task
                        'roleName': roleName,
                        'manaHours': manaHours
                    }
                ]
            }
            ids['task'] += 1
            ids['roleManaHours'] += 1
            
            # Add the task to the appropriate epic in the subProject
            projectDict[subProjectName][epicName].append(task)
    
    # Remove empty subProjects and epics (those without budgeted tasks)
    projectDict = {
        subProject: {
            epic: tasks for epic, tasks in epics.items() if tasks
        } for subProject, epics in projectDict.items() if any(epics.values())
    }
    
    return projectDict

def calculateTotals(projectDict):
    totalManaHours = 0
    roleManaHours = defaultdict(float)
    subProjectTotals = defaultdict(lambda: defaultdict(float))

    # Iterate over the subProjects and epics to sum the MANA hours
    for subProject, epics in projectDict.items():
        subProjectManaHours = 0
        subProjectRoleManaHours = defaultdict(float)
        
        for epic, tasks in epics.items():
            for task in tasks:
                taskHours = sum([role['manaHours'] for role in task['rolesManaHours']])
                role = task['rolesManaHours'][0]['roleName']  # Assuming only one role per task
                
                # Accumulate total MANA hours and hours by role
                totalManaHours += taskHours
                roleManaHours[role] += taskHours
                
                # Accumulate subProject-level totals
                subProjectManaHours += taskHours
                subProjectRoleManaHours[role] += taskHours

        # Store totals for each subProject
        subProjectTotals[subProject]['totalManaHours'] = subProjectManaHours
        subProjectTotals[subProject]['roleManaHours'] = subProjectRoleManaHours

    return totalManaHours, roleManaHours, subProjectTotals

def generateProjectJson(projectDict, ids, developerName):
    """
    Generate a compliant JSON output with IDs for subProjects, epics, and tasks.
    """
    projectJson = {
        'id': ids['project'],
        'title': f'Proposal for {developerName}',
        'description': 'Project based on the Excel data',
        'yesVotes': 0,  # Updated to match frontend
        'noVotes': 0,   # Updated to match frontend
        'manaTokenAllocated': 1000,  # Updated to match frontend
        'isEnded': False,  # Updated to match frontend
        'submittedBy': developerName,  # Updated to match frontend
        'manaHoursBudgeted': calculateTotalManaHours(projectDict),  # Updated to match frontend
        'targetApprovalDate': None,  # Updated to match frontend
        'createdAt': str(datetime.now()),  # Updated to match frontend
        'updatedAt': None,  # Updated to match frontend
        'subProjects': []  # Updated to match frontend
    }
    ids['project'] += 1

    for subProjectName, epics in projectDict.items():
        subProjectId = ids['subProject']
        ids['subProject'] += 1
        
        subProject = {
            'id': subProjectId,
            'proposalId': ids['project'] - 1,  # Link subProject to proposal, updated to match frontend
            'subProjectName': subProjectName,  # Updated to match frontend
            'epics': []
        }

        for epicName, tasks in epics.items():
            epicId = ids['epic']
            ids['epic'] += 1
            
            epic = {
                'id': epicId,
                'subProjectId': subProjectId,  # Link epic to subProject, updated to match frontend
                'epicName': epicName,  # Updated to match frontend
                'tasks': []
            }

            for task in tasks:
                task['epicId'] = epicId  # Updated to match camelCase
                epic['tasks'].append(task)

            subProject['epics'].append(epic)

        projectJson['subProjects'].append(subProject)
    
    return projectJson

def calculateTotalManaHours(projectDict):
    totalManaHours = 0
    for subProject, epics in projectDict.items():
        for epic, tasks in epics.items():
            for task in tasks:
                totalManaHours += sum(role['manaHours'] for role in task['rolesManaHours'])
    return totalManaHours

def saveProjectToJson(projectJson, fileName='hackathon_proposal_validated.json'):
    try:
        with open(fileName, 'w') as jsonFile:
            json.dump(projectJson, jsonFile, indent=4)
        print(f"Project data has been saved to {fileName}")
    except Exception as e:
        print(f"Error saving project data to JSON: {e}")

def main():
    fileName = "mana_gov/hackathon_proposals/HACKATHON_PROPOSAL.xlsx"  # Replace with your actual file name
    jsonFileName = "mana_gov/hackathon_proposals/hackathon_proposal.json"  # JSON output file
    developerName = "DeveloperName"  # Placeholder for developer name
    if not os.path.exists(fileName):
        print(f"Error: File '{fileName}' not found in the current directory.")
        return

    # Initialize the ID counters
    ids = {
        'project': 1,
        'subProject': 1,
        'epic': 1,
        'task': 1,
        'roleManaHours': 1
    }

    try:
        projectDict = readExcelToProject(fileName, ids)
    except Exception as e:
        print(f"Error processing the Excel file: {e}")
        return

    # Calculate and display total MANA hours and MANA hours per role
    budgetedManaHours, roleManaHours, subProjectTotals = calculateTotals(projectDict)

    print(f"\nTotal MANA Hours for the Project: {budgetedManaHours}")
    print("\nTotal MANA Hours per Role:")
    for role, hours in roleManaHours.items():
        print(f"  {role}: {hours}")

    # Generate compliant project JSON
    projectJson = generateProjectJson(projectDict, ids, developerName)

    # Save the project to a JSON file
    saveProjectToJson(projectJson, jsonFileName)

if __name__ == "__main__":
    main()

