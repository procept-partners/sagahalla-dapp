import json
import math

# Prices
MANA_PRICE = 0.73  # USD per MANA
SHLD_PRICE = 135  # USD for one SHLD
FYRE_PRICE = 0.40  # USD per FYRE

# Testnet tokens
TESTNET_TOKENS = 10

# Load developer data
with open('mana_gov/hackathon_proposals/project_plan/output_reports/combined_project_plan.json', 'r') as f:
    data = json.load(f)

developers = data['developers']

acquisition_plan = {}
total_fyre_required = 0

# Calculate the token acquisition plan
for dev_key, developer in developers.items():
    developer_name = developer['developerName']
    
    # MANA calculation: Round to nearest 1000
    mana_allocated = developer['manaTokenAllocated']
    mana_acquired = round(mana_allocated / 1000) * 1000
    mana_cost = mana_acquired * MANA_PRICE
    
    # SHLD acquisition
    shld_acquired = 1
    shld_cost = SHLD_PRICE
    
    # Total cost in USD
    total_cost = mana_cost + shld_cost
    
    # FYRE acquisition (10% more than needed for MANA and SHLD)
    fyre_required = 1.1 * (total_cost / FYRE_PRICE)
    total_fyre_required += fyre_required
    
    # Store the acquisition plan for the developer
    acquisition_plan[developer_name] = {
        "MANA_acquired": mana_acquired,
        "MANA_value_usd": round(mana_cost, 2),
        "SHLD_acquired": shld_acquired,
        "SHLD_value_usd": round(shld_cost, 2),
        "FYRE_acquired": math.ceil(fyre_required),  # round up FYRE tokens
        "FYRE_value_usd": round(fyre_required * FYRE_PRICE, 2)
    }

# Calculate FYRE conversion factor for testnet tokens
fyre_per_testnet_token = total_fyre_required / TESTNET_TOKENS

# Add the FYRE conversion factor to the output
acquisition_plan['FYRE_conversion_factor'] = {
    "testnet_to_FYRE": round(fyre_per_testnet_token, 2)
}

# Output the acquisition plan to a JSON file
with open('mana_gov/hackathon_proposals/project_plan/output_reports/token_acquisition_plan.json', 'w') as out_file:
    json.dump(acquisition_plan, out_file, indent=4)

print("Token acquisition plan generated and saved as 'token_acquisition_plan.json'.")
