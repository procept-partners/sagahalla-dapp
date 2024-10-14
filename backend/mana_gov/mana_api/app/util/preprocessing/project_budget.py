import json
from typing import List, Dict
from models import Project
import os

# Get the root directory of the mana-algo app (assuming this file is inside the mana-algo directory)
app_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

# Construct paths relative to the app root
role_multipliers_path = os.path.join(app_root, "backend", "mana_gov", "proposal_and_plan", "role_multipliers.json")
project_data_path = os.path.join(app_root, "backend", "mana_gov", "proposal_and_plan", "hackathon_mana_hours.json")
output_file_path = os.path.join(app_root, "backend", "mana_gov", "proposal_and_plan", "hackathon_proposal.json")

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

# Calculate the total project budget in USD
total_budget_usd = project.calculate_project_budget(global_avg_rates)

# Convert the project budget to MANA using mana_founder_conversion
total_budget_mana = total_budget_usd / mana_founder_conversion

# Calculate the budget window (±15%)
budget_window = 0.15
lower_budget_usd = total_budget_usd * (1 - budget_window)
upper_budget_usd = total_budget_usd * (1 + budget_window)
lower_budget_mana = total_budget_mana * (1 - budget_window)
upper_budget_mana = total_budget_mana * (1 + budget_window)

# Calculate totals per role
total_hours_per_role = project.total_mana_hours_per_role()
budget_per_role_usd = {role: hours * global_avg_rates.get(role, 0) for role, hours in total_hours_per_role.items()}
budget_per_role_mana = {role: usd / mana_founder_conversion for role, usd in budget_per_role_usd.items()}

# Calculate total hours across all roles
total_hours = sum(total_hours_per_role.values())

# Calculate weighted average pay rate (USD per mana hour)
if total_hours > 0:
    weighted_avg_pay_rate_usd = sum(global_avg_rates[role] * hours for role, hours in total_hours_per_role.items() if role in global_avg_rates) / total_hours
    weighted_avg_pay_rate_mana = weighted_avg_pay_rate_usd / mana_founder_conversion
else:
    weighted_avg_pay_rate_usd = 0
    weighted_avg_pay_rate_mana = 0

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
    },
    "total_hours_per_role": total_hours_per_role,
    "budget_per_role_usd": budget_per_role_usd,
    "budget_per_role_mana": budget_per_role_mana,
    "total_hours": total_hours,  # Add total hours here
    "weighted_avg_pay_rate_usd_per_mana_hour": weighted_avg_pay_rate_usd,
    "weighted_avg_pay_rate_mana_per_mana_hour": weighted_avg_pay_rate_mana
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

# Output the results to the console
print(f"Total project budget in USD: ${total_budget_usd}")
print(f"Total project budget in MANA: {total_budget_mana}")
print(f"Budget window (USD): ${lower_budget_usd} - ${upper_budget_usd}")
print(f"Budget window (MANA): {lower_budget_mana} - {upper_budget_mana}")

# Output the totals per role
print(f"Total Hours per Role: {total_hours_per_role}")
print(f"Budget per Role (USD): {budget_per_role_usd}")
print(f"Budget per Role (MANA): {budget_per_role_mana}")

# Output the total hours across all roles
print(f"Total Hours: {total_hours}")

# Output the weighted average pay rate
print(f"Weighted Average Pay Rate: ${weighted_avg_pay_rate_usd:.2f} per mana hour (USD)")
print(f"Weighted Average Pay Rate: {weighted_avg_pay_rate_mana:.2f} per mana hour (MANA)")
