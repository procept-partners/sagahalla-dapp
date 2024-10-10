import json
from typing import List, Dict
from models import Project
import os

# Get the root directory of the mana-algo app (assuming this file is inside the mana-algo directory)
app_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

# Construct paths relative to the app root
role_multipliers_path = os.path.join(app_root, "backend", "mana_algo", "proposals", "role_multipliers.json")
project_data_path = os.path.join(app_root, "backend", "mana_algo", "proposals", "hackathon_mana_hours.json")
output_file_path = os.path.join(app_root, "backend", "mana_algo", "proposals", "hackathon_proposal.json")

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
role_multipliers = role_multiplier_data["role_multipliers"]

# Load mana_founder_conversion from the JSON file
mana_founder_conversion = role_multiplier_data.get("mana_founder_conversion", 1)

# Load the project from the JSON file
if not os.path.exists(project_data_path):
    raise FileNotFoundError(f"Project data file '{project_data_path}' not found.")

with open(project_data_path, "r") as f:
    project_data = json.load(f)

# Create the Project instance from the JSON data
project = Project(**project_data)

# Calculate the total project budget in USD
total_budget_usd = project.calculate_project_budget(role_multipliers, global_avg_rates)

# Convert the project budget to MANA using mana_founder_conversion
total_budget_mana = total_budget_usd / mana_founder_conversion

# Calculate the budget window (±15%)
budget_window = 0.15
lower_budget_usd = total_budget_usd * (1 - budget_window)
upper_budget_usd = total_budget_usd * (1 + budget_window)
lower_budget_mana = total_budget_mana * (1 - budget_window)
upper_budget_mana = total_budget_mana * (1 + budget_window)

# Add the project budget details to the original project data
project_data["budget"] = {
    "total_budget_usd": total_budget_usd,
    "total_budget_mana": total_budget_mana,
    "budget_window_usd": {
        "lower_bound": lower_budget_usd,
        "upper_bound": upper_budget_usd
    },
    "budget_window_mana": {
        "lower_bound": lower_budget_mana,
        "upper_bound": upper_budget_mana
    }
}

# Save the updated project data to a new JSON file
def save_project_to_json(project_dict, file_name: str):
    try:
        with open(file_name, 'w') as json_file:
            json.dump(project_dict, json_file, indent=4)
        print(f"Updated project data has been saved to {file_name}")
    except Exception as e:
        print(f"Error saving project data to JSON: {e}")

# Save the updated project data with budget details
save_project_to_json(project_data, output_file_path)

print(f"Total project budget in USD: ${total_budget_usd}")
print(f"Total project budget in MANA: {total_budget_mana}")
print(f"Budget window (USD): ${lower_budget_usd} - ${upper_budget_usd}")
print(f"Budget window (MANA): {lower_budget_mana} - {upper_budget_mana}")
