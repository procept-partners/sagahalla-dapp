import json
from typing import List, Dict
from models import Project

# Load the role multipliers from the JSON file
def load_role_multipliers(file_path: str) -> Dict:
    with open(file_path, "r") as f:
        return json.load(f)
    

  # Import the function to load multipliers

# Load the role multipliers from the JSON file
role_multiplier_data = load_role_multipliers("role_multipliers.json")
global_avg_rates = role_multiplier_data["weighted_global_average_rates"]
role_multipliers = role_multiplier_data["role_multipliers"]

# Load the project from the JSON file
with open("hackathon_proposal.json", "r") as f:
    project_data = json.load(f)

# Create the Project instance from the JSON data
project = Project(**project_data)

# Calculate the total project budget
total_budget = project.calculate_project_budget(role_multipliers, global_avg_rates)
print(f"Total project budget in USD: ${total_budget}")
