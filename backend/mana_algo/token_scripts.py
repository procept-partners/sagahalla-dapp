import json
import math
import os

# Constants for token pricing
SHLD_COST = 135  # 1 SHLD = $135
MANA_COST_PER_TOKEN = 2.38  # 1 MANA = $2.38
FYRE_COST_PER_TOKEN = 0.40  # 1 FYRE = $0.40

# Path to the JSON file containing developer data
dev_budget_file_path = "backend/mana_algo/proposals/hackathon_dev_project_budget.json"

# Function to calculate required tokens for each developer
def calculate_token_purchases(developer_data):
    total_mana = developer_data["totals"]["total_budget_mana"]
    
    # Round MANA to nearest 1000
    rounded_mana = round(total_mana / 1000) * 1000
    
    # Calculate MANA cost
    mana_cost = rounded_mana * MANA_COST_PER_TOKEN
    
    # Calculate remaining USD after purchasing SHLD and MANA
    total_usd_cost = SHLD_COST + mana_cost
    
    # Calculate required FYRE tokens, rounding up to nearest 100 FYRE
    required_fyre = math.ceil((total_usd_cost / FYRE_COST_PER_TOKEN) / 100) * 105
    
    # Construct result dictionary for this developer
    return {
        "developer_name": developer_data["developer_name"],
        "required_tokens": {
            "FYRE": required_fyre,
            "SHLD": 1,
            "MANA": rounded_mana
        },
        "costs": {
            "FYRE_cost": required_fyre * FYRE_COST_PER_TOKEN,
            "SHLD_cost": SHLD_COST,
            "MANA_cost": mana_cost,
            "FYRE Balance": required_fyre * FYRE_COST_PER_TOKEN - mana_cost - SHLD_COST
        }
    }

# Function to process all developers and generate the JSON output
def generate_token_purchase_json(dev_budget_file):
    # Read the developer budget data from the JSON file
    if not os.path.exists(dev_budget_file):
        raise FileNotFoundError(f"Developer budget file not found: {dev_budget_file}")
    
    with open(dev_budget_file, "r") as f:
        developers_data = json.load(f)
    
    results = {}
    
    for developer_name, developer_data in developers_data.items():
        result = calculate_token_purchases(developer_data)
        results[developer_name] = result
    
    # Save results to a JSON file
    output_file = "backend/mana_algo/proposals/developer_token_purchases.json"
    with open(output_file, "w") as f:
        json.dump(results, f, indent=4)
    
    print(f"Developer token purchase details saved to {output_file}")

# Main function to run the script
def main():
    generate_token_purchase_json(dev_budget_file_path)

if __name__ == "__main__":
    main()

