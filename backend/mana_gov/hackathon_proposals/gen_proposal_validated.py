import os
import pandas as pd
import json
from collections import defaultdict
from datetime import datetime

def cleanString(s):
    if isinstance(s, str):
        return s.lstrip('-').strip()
    return s

def readRoleMultipliers(filePath: str) -> dict:
    try:
        with open(filePath, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: {filePath} not found.")
        return {}

def calculateManaAllocated(roleName, manaHours, roleMultipliers):
    # Use the weighted global average rates and conversion
    rate = roleMultipliers.get('weighted_global_average_rates', {}).get(roleName, 0)
    conversion = roleMultipliers.get('mana_founder_conversion', 1)
    return manaHours * rate / conversion  # Convert mana hours to MANA allocated

def readExcelToProject(filePath: str, ids: dict, roleMultipliers: dict) -> dict:
    sheets = pd.read_excel(filePath, sheet_name=None)
    projectDict = defaultdict(lambda: defaultdict(list))
    
    for sheetName, data in sheets.items():
        data = data.applymap(cleanString)
        
        for _, row in data.iterrows():
            subProjectName = row.get('Subproject')
            epicName = row.get('Epic')
            taskName = row.get('Task')
            roleName = row.get('Role')
            manaHours = row.get('Estimated Hours', 0)
            
            if pd.isna(taskName):
                continue
            
            # Calculate manaTokenAllocated using role multipliers
            manaTokenAllocated = calculateManaAllocated(roleName, manaHours, roleMultipliers)
            
            task = {
                'id': ids['task'],
                'epicId': ids['epic'],
                'taskName': taskName,
                'rolesManaHours': [{
                    'id': ids['roleManaHours'],
                    'taskId': ids['task'],
                    'roleName': roleName,
                    'manaHours': manaHours
                }],
                'manaTokenAllocated': manaTokenAllocated  # Include MANA allocation
            }
            ids['task'] += 1
            ids['roleManaHours'] += 1
            
            projectDict[subProjectName][epicName].append(task)
    
    return projectDict

def calculateTotalManaHours(projectDict):
    totalManaHours = 0
    for subProject, epics in projectDict.items():
        for epic, tasks in epics.items():
            for task in tasks:
                for role in task['rolesManaHours']:
                    totalManaHours += role['manaHours']
    return totalManaHours

def calculateTotals(projectDict, budgetWindow=0.15):
    totalManaHours = 0
    totalManaAllocated = 0
    roleManaHours = defaultdict(float)
    subProjectTotals = defaultdict(lambda: defaultdict(float))

    for subProject, epics in projectDict.items():
        subProjectManaHours = 0
        subProjectManaAllocated = 0
        subProjectRoleManaHours = defaultdict(float)
        
        for epic, tasks in epics.items():
            for task in tasks:
                taskHours = sum([role['manaHours'] for role in task['rolesManaHours']])
                role = task['rolesManaHours'][0]['roleName']
                
                totalManaHours += taskHours
                totalManaAllocated += task.get('manaTokenAllocated', 0)
                roleManaHours[role] += taskHours
                subProjectManaHours += taskHours
                subProjectManaAllocated += task.get('manaTokenAllocated', 0)
                subProjectRoleManaHours[role] += taskHours

        subProjectTotals[subProject]['totalManaHours'] = subProjectManaHours
        subProjectTotals[subProject]['roleManaHours'] = subProjectRoleManaHours
        subProjectTotals[subProject]['manaAllocated'] = subProjectManaAllocated

    return totalManaHours, totalManaAllocated, roleManaHours, subProjectTotals

def generateProjectJson(projectDict, ids, developerName, totalManaAllocated, budgetWindow=0.15):
    projectJson = {
        'id': ids['project'],
        'title': f'SagaHalla MANA DApp',
        'description': 'The MANA DApp is a decentralized application designed to track effort contributions, facilitate governance, and manage token rewards within the SagaHalla cooperative. It enables members to log their work, validate contributions through a secure voting mechanism, and convert efforts into MANA tokens. The DApp integrates a contribution-weighted governance system, allowing cooperative members to vote on project proposals and milestones. With features like project management, effort validation, and multichain support, the MANA DApp ensures transparency and efficiency in managing cooperative contributions and decision-making processes.',
        'yesVotes': 0,
        'noVotes': 0,
        'manaTokenAllocated': totalManaAllocated,
        'isEnded': False,
        'submittedBy': developerName,
        'manaHoursBudgeted': calculateTotalManaHours(projectDict),
        'targetApprovalDate': None,
        'createdAt': str(datetime.now()),
        'updatedAt': None,
        'budgetWindowLow': round(totalManaAllocated * (1 - budgetWindow), 2),
        'budgetWindowHigh': round(totalManaAllocated * (1 + budgetWindow), 2),
        'subProjects': []
    }
    ids['project'] += 1

    for subProjectName, epics in projectDict.items():
        subProjectId = ids['subProject']
        ids['subProject'] += 1
        
        subProject = {
            'id': subProjectId,
            'proposalId': ids['project'] - 1,
            'subProjectName': subProjectName,
            'epics': []
        }

        for epicName, tasks in epics.items():
            epicId = ids['epic']
            ids['epic'] += 1
            
            epic = {
                'id': epicId,
                'subProjectId': subProjectId,
                'epicName': epicName,
                'tasks': []
            }

            for task in tasks:
                task['epicId'] = epicId
                epic['tasks'].append(task)

            subProject['epics'].append(epic)

        projectJson['subProjects'].append(subProject)
    
    return projectJson

def saveProjectToJson(projectJson, fileName='hackathon_proposal_validated.json'):
    try:
        with open(fileName, 'w') as jsonFile:
            json.dump(projectJson, jsonFile, indent=4)
        print(f"Project data has been saved to {fileName}")
    except Exception as e:
        print(f"Error saving project data to JSON: {e}")

def main():
    fileName = "mana_gov/hackathon_proposals/HACKATHON_PROPOSAL.xlsx"
    jsonFileName = "mana_gov/hackathon_proposals/hackathon_proposal.json"
    developerName = "Shandor"
    
    if not os.path.exists(fileName):
        print(f"Error: File '{fileName}' not found.")
        return

    roleMultipliersPath = "mana_gov/hackathon_proposals/role_multipliers.json"
    roleMultipliers = readRoleMultipliers(roleMultipliersPath)
    if not roleMultipliers:
        return

    ids = {
        'project': 1,
        'subProject': 1,
        'epic': 1,
        'task': 1,
        'roleManaHours': 1
    }

    try:
        projectDict = readExcelToProject(fileName, ids, roleMultipliers)
    except Exception as e:
        print(f"Error processing the Excel file: {e}")
        return

    totalManaHours, totalManaAllocated, roleManaHours, subProjectTotals = calculateTotals(projectDict)

    print(f"\nTotal MANA Hours for the Project: {totalManaHours}")
    print(f"\nTotal MANA Allocated: {totalManaAllocated}")
    print("\nTotal MANA Hours per Role:")
    for role, hours in roleManaHours.items():
        print(f"  {role}: {hours}")

    projectJson = generateProjectJson(projectDict, ids, developerName, totalManaAllocated)

    saveProjectToJson(projectJson, jsonFileName)

if __name__ == "__main__":


    main()

